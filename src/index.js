import { createRoot } from 'react-dom/client';
import AdminApp from './admin';

document.addEventListener('DOMContentLoaded', () => {
    const rootElement = document.getElementById('wp-react-admin-panel-root');
    if (rootElement) {
        const root = createRoot(rootElement);
        root.render(<AdminApp />);
    }
});
