import { createReduxStore, register } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

const STORE_NAME = 'wp-react-admin-panel/store';

// Create the Redux-style store
const store = createReduxStore(STORE_NAME, {
    reducer(state = { optionValue: '', isLoading: false }, action) {
        switch (action.type) {
            case 'SET_OPTION_VALUE':
                return { ...state, optionValue: action.value, isLoading: false };
            case 'SET_LOADING':
                return { ...state, isLoading: action.isLoading };
            default:
                return state;
        }
    },
    actions: {
        setOptionValue(value) {
            return { type: 'SET_OPTION_VALUE', value };
        },
        setLoading(isLoading) {
            return { type: 'SET_LOADING', isLoading };
        },
        async fetchOption() {
            return async ({ dispatch }) => {
                dispatch.setLoading(true);
                try {
                    const response = await apiFetch({ path: '/wp-react-admin-panel/v1/get-option' });
                    dispatch.setOptionValue(response.option_value);
                } catch (error) {
                    console.error('Error fetching option:', error);
                    dispatch.setLoading(false);
                }
            };
        },
        async saveOption(value) {
            return async ({ dispatch }) => {
                dispatch.setLoading(true);
                try {
                    await apiFetch({
                        path: '/wp-react-admin-panel/v1/save-option',
                        method: 'POST',
                        data: { option_value: value },
                    });
                    dispatch.setOptionValue(value);
                } catch (error) {
                    console.error('Error saving option:', error);
                    dispatch.setLoading(false);
                }
            };
        },
    },
    selectors: {
        getOptionValue(state) {
            return state.optionValue;
        },
        isLoading(state) {
            return state.isLoading;
        },
    },
});

register(store);

export { STORE_NAME };
