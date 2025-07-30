import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import './styles/Admin.css';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Accept': 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    password_confirmation: passwordConfirmation,
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Store the token for API authentication
                if (data.token) {
                    localStorage.setItem('auth_token', data.token);
                }
                navigate('/admin');
            } else {
                // Handle validation errors
                if (data.errors) {
                    const errorMessages = Object.values(data.errors).flat();
                    setError(errorMessages.join('. '));
                } else {
                    setError(data.message || 'Registration failed. Please check your details and try again.');
                }
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('Network error occurred. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-auth-bg" style={{minHeight:'100vh',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
            <div className="admin-auth-outer" style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <div className="auth-container">
                    <h2 style={{fontSize:'2rem',fontWeight:700,marginBottom:'1.5rem',textAlign:'center'}}>Admin Registration</h2>
                    {error && <div className="error-message">{error}</div>}
                    <form onSubmit={handleSubmit} className="auth-form">
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={loading}
                        />
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
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            required
                            disabled={loading}
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? 'Creating account...' : 'Create Admin Account'}
                        </button>
                    </form>
                    <button type="button" style={{marginTop: '1rem', background: '#f3f4f6', color: '#222', border: 'none', borderRadius: 6, padding: '10px 0', width: '100%', fontWeight: 500, cursor: 'pointer'}} onClick={() => navigate('/')}>← Back</button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Signup;
