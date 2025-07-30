import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import './styles/AdminHeader.css';

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

        const data = await response.json();
        if (data.success) {
          localStorage.removeItem('auth_token');
          logout();
          window.location.href = '/';
        }
      } else {
        logout();
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Admin Logout error:', error);
      localStorage.removeItem('auth_token');
      logout();
      window.location.href = '/';
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
