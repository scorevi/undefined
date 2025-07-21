import './bootstrap';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import Main from './pages/Main';
import UserPost from './pages/UserPost';
import Footer from './components/Footer';

const App = () => (
  <>
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Main />}/>
            <Route path='/userpost' element={<UserPost />}/>
        </Routes>
    </BrowserRouter>
    <Footer />
  </>
);

const root = document.getElementById('react-root');

if (root) {
  ReactDOM.createRoot(root).render(<App />);
}
