import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import './styles/User.css';

const UserRegister = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user, login } = useAuth();

    // Redirect if already logged in
    React.useEffect(() => {
        if (user && !loading) {
            navigate('/blog', { replace: true });
        }
    }, [user, loading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== passwordConfirmation) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch('/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirmation }),
            });

            const data = await response.json();

            if (data.success && data.user) {
                login(data.user);
                navigate('/dashboard');
            } else {
                setError(data.message || 'Registration failed');
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
                        <h1 className="text-3xl font-bold mb-2" style={{color:'#22c55e'}}>Blog Platform</h1>
                        <h2 className="text-xl font-semibold mb-1">User Registration</h2>
                        <p className="text-gray-600">Join our community today</p>
                    </div>
                    <form className="user-auth-form" onSubmit={handleSubmit}>
                        {error && (
                            <div className="user-error-message">{error}</div>
                        )}
                        <input
                            className="user-auth-input"
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            required
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                        />
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
                            autoComplete="new-password"
                            required
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                        <input
                            className="user-auth-input"
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            autoComplete="new-password"
                            required
                            placeholder="Confirm Password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="user-auth-button"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                        <div className="text-center mt-2">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <a href="/login" className="font-medium" style={{color:'#22c55e'}}>Sign in here</a>
                            </p>
                        </div>
                    </form>
                    <button type="button" style={{marginTop: '1rem', background: '#f3f4f6', color: '#222', border: 'none', borderRadius: 6, padding: '10px 0', width: '100%', fontWeight: 500, cursor: 'pointer'}} onClick={() => navigate('/')}>← Back</button>
                </div>
            </div>
        </div>
    );
};

export default UserRegister; 