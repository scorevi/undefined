import './bootstrap';
import ReactDOM from 'react-dom/client';
import Navbar from './components/NavBar';
import Main from './pages/Main';
import UserPost from './pages/UserPost';
import Footer from './components/Footer';

const App = () => (
    <> 
        <Navbar name="John"/> {/* Placeholder name */}
        {/* <Main /> */}
        <UserPost />
        <Footer />
    </>
);

const root = document.getElementById('react-root');

if (root) {
    ReactDOM.createRoot(root).render(<App />);
}
