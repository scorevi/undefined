import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import './Styles/AdminHeader.css';

const AdminHeader = ({ title = "Admin Dashboard", showBackButton = false, backTo = "/admin", backText = "Back to Dashboard" }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('auth_token');

      if (token) {
        const response = await fetch('/api/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        });

        if (response.ok) {
          localStorage.removeItem('auth_token');
        }
      }
    } catch (error) {
      // Silent fail for logout errors
    } finally {
      // Always clear tokens and user state
      localStorage.removeItem('auth_token');
      logout();
      // Use a small delay to ensure state is cleared before navigation
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    }
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-nav-left">
        <Link to="/admin" className="admin-title">
          Admin Dashboard
        </Link>
        {showBackButton && (
          <button
            onClick={() => navigate(backTo)}
            className="admin-back-btn"
          >
            ← {backText}
          </button>
        )}
      </div>
      <div className="admin-logout">
        <span className="welcome-text">
          Welcome, {user?.name || 'Admin'}
        </span>
        <button
          onClick={handleLogout}
          className="logout-btn"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminHeader;
