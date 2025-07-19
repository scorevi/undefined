import './bootstrap';
import ReactDOM from 'react-dom/client';
import Navbar from './components/NavBar';
import Main from './pages/Main';

const App = () => (
    <> 
        <Navbar name="John"/> {/* Placeholder name */}
        <Main />
    </>
);

const root = document.getElementById('react-root');

if (root) {
    ReactDOM.createRoot(root).render(<App />);
}
