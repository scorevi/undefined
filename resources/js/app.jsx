<<<<<<< HEAD
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import UserLogin from './components/UserLogin';
import UserRegister from './components/UserRegister';
import UserDashboard from './components/UserDashboard';
import HiddenAdminAccess from './components/HiddenAdminAccess';
import './components/styles/Admin.css';

// Home component
const Home = () => {
    return (
        <div className="min-h-screen">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="text-xl font-semibold text-gray-900">
                                Laravel Blog
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="text-sm text-gray-700 hover:text-gray-900">
                                Sign In
                            </Link>
                            <Link to="/register" className="text-sm text-blue-600 hover:text-blue-800">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                    <span className="block xl:inline">Welcome to </span>
                                    <span className="block text-blue-600 xl:inline">Laravel Blog</span>
                                </h1>
                                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    A modern blogging platform for everyone.
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div className="rounded-md shadow">
                                        <Link to="/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                                            Get Started
                                        </Link>
                                    </div>
                                    <div className="mt-3 sm:mt-0 sm:ml-3">
                                        <Link to="/login" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10">
                                            Sign In
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing React...');
    const rootElement = document.getElementById('root');
    console.log('Root element:', rootElement);

    if (rootElement) {
        try {
            const root = createRoot(rootElement);
            console.log('Root created, rendering React app...');
            
            root.render(
                <React.StrictMode>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<UserLogin />} />
                            <Route path="/register" element={<UserRegister />} />
                            <Route path="/dashboard" element={<UserDashboard />} />
                            
                            {/* Hidden Admin Routes - Access via direct URL */}
                            <Route path="/admin/login" element={<Login />} />
                            <Route path="/admin/signup" element={<Signup />} />
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/system" element={<HiddenAdminAccess />} />
                        </Routes>
                    </BrowserRouter>
                </React.StrictMode>
            );
            console.log('React app rendered successfully!');
        } catch (error) {
            console.error('Error rendering React app:', error);
        }
    } else {
        console.error('Root element not found!');
    }
});
=======
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
>>>>>>> origin/frontend
