import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Admin.css';
import { useAuth } from '../authContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'same-origin',
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
                // Handle validation errors
                if (data.errors) {
                    const errorMessages = Object.values(data.errors).flat();
                    setError(errorMessages.join(' '));
                } else {
                    setError(data.message || `Login failed (status ${response.status})`);
                }
                setLoading(false);
                return;
            }

            if (data.success && data.user) {
                if (data.user.role === 'admin') {
                    // Store the token for API authentication
                    if (data.token) {
                        localStorage.setItem('auth_token', data.token);
                    }
                    login(data.user); // Set user context
                    navigate('/admin');
                } else {
                    setError('Access denied. Admin privileges required.');
                }
            } else {
                setError(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-auth-bg" style={{minHeight:'100vh',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
            <div className="admin-auth-outer" style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <div className="auth-container">
                    <h2 style={{fontSize:'2rem',fontWeight:700,marginBottom:'1.5rem',textAlign:'center'}}>Admin Login</h2>
                    {error && <div className="error-message">{error}</div>}
                    <form onSubmit={handleSubmit} className="auth-form">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login to Admin'}
                        </button>
                    </form>
                    <button type="button" style={{marginTop: '1rem', background: '#f3f4f6', color: '#222', border: 'none', borderRadius: 6, padding: '10px 0', width: '100%', fontWeight: 500, cursor: 'pointer'}} onClick={() => navigate('/')}>← Back</button>
                </div>
            </div>
        </div>
    );
};

export default Login;
