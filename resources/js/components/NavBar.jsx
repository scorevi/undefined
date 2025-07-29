import React from 'react';
import { FaBookOpen } from 'react-icons/fa';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import './styles/navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    let logoutSuccess = false;
    try {
      // Try user logout endpoint first
      let response = await fetch('/api/user/logout', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'Accept': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        // Try fallback logout endpoint
        response = await fetch('/api/logout', {
          method: 'POST',
          headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            'Accept': 'application/json',
          },
          credentials: 'include',
        });
      }
      logoutSuccess = response.ok;
    } catch (err) {
      logoutSuccess = false;
    }
    logout(); // Always clear local user state
    window.location.href = '/';
    if (!logoutSuccess) {
      alert('Logout may not have completed cleanly. Please refresh or clear cookies if you encounter issues.');
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <FaBookOpen className="navbar-icon" />
            <Link to={user ? "/blog" : "/"} className="navbar-title">Blog Site</Link>
          </div>
          <div className="navbar-center">
            {user ? `Welcome, ${user.name || user.email}!` : 'Welcome!'}
          </div>
          <div className="navbar-actions">
            {user && (
              <button className="logout-btn" onClick={handleLogout}>
                Log out
              </button>
            )}
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
}
