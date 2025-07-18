import './bootstrap';
import ReactDOM from 'react-dom/client';
import Navbar from './components/NavBar';

const App = () => (
    <> 
        <Navbar />
        <h1>Hello from React in Laravel!</h1>
    </>
);

const root = document.getElementById('react-root');

if (root) {
    ReactDOM.createRoot(root).render(<App />);
}
