import './bootstrap';
import ReactDOM from 'react-dom/client';

const App = () => {
    return <h1>Hello from React in Laravel!</h1>;
};

const root = document.getElementById('react-root');

if (root) {
    ReactDOM.createRoot(root).render(<App />);
}
