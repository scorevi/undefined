import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../authContext';
import { FaBookOpen, FaEye, FaEyeSlash } from 'react-icons/fa';

const FBAuth = ({ mode = 'login', userType = 'user' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user && !loading) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/blog', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (mode === 'register' && formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      let endpoint, redirectPath;

      if (userType === 'admin') {
        if (mode === 'login') {
          endpoint = '/api/login';
          redirectPath = '/admin';
        } else {
          endpoint = '/api/register';
          redirectPath = '/admin';
        }
      } else {
        if (mode === 'login') {
          // Get CSRF cookie first for user login
          await fetch('/sanctum/csrf-cookie', { credentials: 'include' });
          endpoint = '/login';
          redirectPath = '/blog';
        } else {
          endpoint = '/api/user/register';
          redirectPath = '/blog';
        }
      }

      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      // Handle CSRF tokens differently for admin vs user
      if (userType === 'admin') {
        headers['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      } else if (mode === 'login') {
        const xsrfToken = (() => {
          const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
          return match ? decodeURIComponent(match[1]) : '';
        })();
        headers['X-XSRF-TOKEN'] = xsrfToken;
      } else {
        headers['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      }

      let body;
      if (mode === 'login') {
        body = { email: formData.email, password: formData.password };
      } else {
        body = { ...formData };
        // Add role for admin registration
        if (userType === 'admin') {
          body.role = 'admin';
        }
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || `${mode === 'login' ? 'Login' : 'Registration'} failed`);
        setLoading(false);
        return;
      }

      if (data.success && data.user) {
        // Admin role check for admin login
        if (userType === 'admin' && mode === 'login' && data.user.role !== 'admin') {
          setError('You do not have admin access.');
          setLoading(false);
          return;
        }

        login(data.user);
        navigate(redirectPath);
      } else {
        setError(data.message || `${mode === 'login' ? 'Login' : 'Registration'} failed`);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1877f2 0%, #42a5f5 50%, #1565c0 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    authCard: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      padding: '48px 40px',
      width: '100%',
      maxWidth: '400px',
      textAlign: 'center',
    },
    logoSection: {
      marginBottom: '32px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#1877f2',
      fontSize: '24px',
      fontWeight: '700',
      textDecoration: 'none',
    },
    title: {
      fontSize: '28px',
      fontWeight: '600',
      color: '#1c1e21',
      margin: '0 0 8px 0',
    },
    subtitle: {
      fontSize: '16px',
      color: '#65676b',
      margin: '0',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      marginBottom: '24px',
    },
    inputContainer: {
      position: 'relative',
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      border: '1px solid #dddfe2',
      borderRadius: '6px',
      fontSize: '16px',
      outline: 'none',
      transition: 'border-color 0.2s',
      fontFamily: 'inherit',
      boxSizing: 'border-box',
    },
    inputFocus: {
      borderColor: '#1877f2',
    },
    passwordToggle: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: '#65676b',
      cursor: 'pointer',
      padding: '4px',
      fontSize: '14px',
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#1877f2',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      fontFamily: 'inherit',
    },
    buttonHover: {
      backgroundColor: '#166fe5',
    },
    buttonDisabled: {
      backgroundColor: '#e4e6ea',
      color: '#bcc0c4',
      cursor: 'not-allowed',
    },
    error: {
      backgroundColor: '#ffebee',
      color: '#c62828',
      border: '1px solid #ffcdd2',
      borderRadius: '6px',
      padding: '12px',
      marginBottom: '16px',
      fontSize: '14px',
    },
    linkSection: {
      marginTop: '24px',
      paddingTop: '24px',
      borderTop: '1px solid #e4e6ea',
    },
    link: {
      color: '#1877f2',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
    },
    backButton: {
      marginTop: '16px',
      background: '#f0f2f5',
      color: '#1c1e21',
      border: 'none',
      borderRadius: '6px',
      padding: '12px',
      width: '100%',
      fontWeight: '500',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'background-color 0.2s',
    },
  };

  const getTitle = () => {
    if (mode === 'login') {
      return userType === 'admin' ? 'Admin Login' : 'Sign In';
    }
    return userType === 'admin' ? 'Admin Registration' : 'Create Account';
  };

  const getSubtitle = () => {
    if (mode === 'login') {
      return userType === 'admin' ? 'Access admin dashboard' : 'Welcome back to our blog';
    }
    return userType === 'admin' ? 'Create admin account' : 'Join our community today';
  };

  const getButtonText = () => {
    if (loading) {
      return mode === 'login' ? 'Signing in...' : 'Creating account...';
    }
    return mode === 'login' ? 'Sign In' : 'Create Account';
  };

  return (
    <div style={styles.container}>
      <div style={styles.authCard}>
        <div style={styles.logoSection}>
          <div style={styles.logo}>
            <FaBookOpen />
            Blog Site
          </div>
          <div>
            <h1 style={styles.title}>{getTitle()}</h1>
            <p style={styles.subtitle}>{getSubtitle()}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.error}>{error}</div>}

          {mode === 'register' && (
            <input
              style={styles.input}
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={loading}
              onFocus={(e) => e.target.style.borderColor = '#1877f2'}
              onBlur={(e) => e.target.style.borderColor = '#dddfe2'}
            />
          )}

          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={loading}
            onFocus={(e) => e.target.style.borderColor = '#1877f2'}
            onBlur={(e) => e.target.style.borderColor = '#dddfe2'}
          />

          <div style={styles.inputContainer}>
            <input
              style={styles.input}
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={loading}
              onFocus={(e) => e.target.style.borderColor = '#1877f2'}
              onBlur={(e) => e.target.style.borderColor = '#dddfe2'}
            />
            <button
              type="button"
              style={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
              onMouseEnter={(e) => e.target.style.color = '#1877f2'}
              onMouseLeave={(e) => e.target.style.color = '#65676b'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {mode === 'register' && (
            <div style={styles.inputContainer}>
              <input
                style={styles.input}
                type={showConfirmPassword ? 'text' : 'password'}
                name="password_confirmation"
                placeholder="Confirm Password"
                value={formData.password_confirmation}
                onChange={handleInputChange}
                required
                disabled={loading}
                onFocus={(e) => e.target.style.borderColor = '#1877f2'}
                onBlur={(e) => e.target.style.borderColor = '#dddfe2'}
              />
              <button
                type="button"
                style={styles.passwordToggle}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                onMouseEnter={(e) => e.target.style.color = '#1877f2'}
                onMouseLeave={(e) => e.target.style.color = '#65676b'}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {})
            }}
            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#166fe5')}
            onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#1877f2')}
          >
            {getButtonText()}
          </button>
        </form>

        <div style={styles.linkSection}>
          {mode === 'login' ? (
            userType === 'user' ? (
              <p style={{ margin: '0', fontSize: '14px', color: '#65676b' }}>
                Don't have an account?{' '}
                <a href="/register" style={styles.link}>Sign up here</a>
              </p>
            ) : (
              <p style={{ margin: '0', fontSize: '14px', color: '#65676b' }}>
                Need to create admin account?{' '}
                <a href="/admin/signup" style={styles.link}>Register here</a>
              </p>
            )
          ) : (
            <p style={{ margin: '0', fontSize: '14px', color: '#65676b' }}>
              Already have an account?{' '}
              <a href={userType === 'admin' ? '/admin/login' : '/login'} style={styles.link}>
                Sign in here
              </a>
            </p>
          )}
        </div>

        <button
          type="button"
          style={styles.backButton}
          onClick={() => navigate('/')}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e4e6ea'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#f0f2f5'}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default FBAuth;
