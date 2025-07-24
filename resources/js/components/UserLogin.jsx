import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../authContext';
import './styles/User.css';

const UserLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, login } = useAuth();

    // Redirect if already logged in
    React.useEffect(() => {
        if (user && user.role === 'user' && !loading && location.pathname !== '/blog') {
            navigate('/blog', { replace: true });
        }
    }, [user, loading, navigate, location.pathname]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Step 1: Get CSRF cookie from Sanctum
            await fetch('/sanctum/csrf-cookie', {
                credentials: 'include',
            });
            // Step 2: Login
            // Get XSRF-TOKEN from cookie and set X-XSRF-TOKEN header
            const xsrfToken = (() => {
                const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
                return match ? decodeURIComponent(match[1]) : '';
            })();
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': xsrfToken,
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            let data;
            try {
                data = await response.json();
            } catch (jsonErr) {
                setError('Invalid server response.');
                setLoading(false);
                return;
            }

            if (!response.ok) {
                setError(data.message || `Login failed (status ${response.status})`);
                setLoading(false);
                return;
            }

            if (data.success && data.user) {
                login(data.user);
                navigate('/blog');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="user-auth-bg">
            <div className="user-auth-outer">
                <div className="user-auth-container">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold mb-2" style={{color:'#2563eb'}}>Erikanoelvi's Blog</h1>
                        <h2 className="text-xl font-semibold mb-1">User Login</h2>
                        <p className="text-gray-600">Sign in to your account</p>
                    </div>
                    <form className="user-auth-form" onSubmit={handleSubmit}>
                        {error && (
                            <div className="user-error-message">{error}</div>
                        )}
                        <input
                            className="user-auth-input"
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                        <input
                            className="user-auth-input"
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="user-auth-button"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                        <div className="text-center mt-2">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <a href="/register" className="font-medium" style={{color:'#2563eb'}}>Sign up here</a>
                            </p>
                        </div>
                    </form>
                    <button type="button" style={{marginTop: '1rem', background: '#f3f4f6', color: '#222', border: 'none', borderRadius: 6, padding: '10px 0', width: '100%', fontWeight: 500, cursor: 'pointer'}} onClick={() => navigate('/')}>← Back</button>
                </div>
            </div>
        </div>
    );
};

export default UserLogin; 