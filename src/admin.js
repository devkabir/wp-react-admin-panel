import './admin.scss'
import {useDispatch, useSelect} from '@wordpress/data';
import {useEffect, useState} from '@wordpress/element';
import {Button, Card, CardBody, CardFooter, CardHeader, Notice, Spinner, TextControl} from '@wordpress/components';
import {STORE_NAME} from './store';

const AdminApp = () => {
    const {getOptionValue, isLoading} = useSelect((select) => ({
        getOptionValue: select(STORE_NAME).getOptionValue(), isLoading: select(STORE_NAME).isLoading(),
    }));

    const {fetchOption, saveOption, setOptionValue} = useDispatch(STORE_NAME);

    const [message, setMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false); // Local state for button loading

    // Fetch saved option on load
    useEffect(() => {
        fetchOption();
    }, []);

    // Handle save action
    const handleSave = () => {
        setIsSaving(true); // Start button loading state
        saveOption(getOptionValue).then(() => {
            setMessage('Settings saved successfully!');
            setIsSaving(false); // Stop button loading state
        }).catch(() => {
            setIsSaving(false); // Stop loading in case of error
        });
    };

    return (<div className="wrap">


        <Card>
            <CardHeader>
                <>
                    <h2>General Settings</h2>
                    {message && <Notice status="success" isDismissible>{message}</Notice>}
                </>
            </CardHeader>
            <CardBody>
                <TextControl
                    __nextHasNoMarginBottom={true}
                    label="Custom Option"
                    value={getOptionValue}
                    onChange={(val) => setOptionValue(val)}
                    className="regular-text regular-text__inline"
                />

            </CardBody>
            <CardFooter>
                <Button
                    isPrimary
                    onClick={handleSave}
                    className="button button-primary"
                    disabled={isLoading || isSaving}
                >
                    {isSaving ? <><Spinner size={16}/> Saving...</> : 'Save Settings'}
                </Button>
            </CardFooter>
        </Card>
    </div>);
};

export default AdminApp;
