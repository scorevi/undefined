import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Admin.css';

const HiddenAdminAccess = () => {
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [secretCode, setSecretCode] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSecretCodeSubmit = (e) => {
        e.preventDefault();
        if (secretCode === 'admin123') { // Simple secret code - you can make this more complex
            setShowAdminLogin(true);
            setError('');
        } else {
            setError('Invalid access code');
        }
    };

    if (!showAdminLogin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            System Access
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Enter access code to continue
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSecretCodeSubmit}>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}
                        <div>
                            <label htmlFor="secretCode" className="sr-only">
                                Access Code
                            </label>
                            <input
                                id="secretCode"
                                name="secretCode"
                                type="password"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Enter access code"
                                value={secretCode}
                                onChange={(e) => setSecretCode(e.target.value)}
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Verify Access
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // Show admin login form after secret code is verified
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="auth-container">
                <h2>Admin Access</h2>
                <p className="text-sm text-gray-600 mb-4">System Administration Panel</p>
                <div className="space-y-4">
                    <a
                        href="/admin/login"
                        className="block w-full text-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Admin Login
                    </a>
                    <a
                        href="/admin/signup"
                        className="block w-full text-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Admin Registration
                    </a>
                    <button
                        onClick={() => setShowAdminLogin(false)}
                        className="block w-full text-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HiddenAdminAccess; 