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

    // Always clear local user state
    logout();

    // Use a small delay to ensure state is cleared before navigation
    setTimeout(() => {
      navigate('/', { replace: true });
    }, 100);

    if (!logoutSuccess) {
      alert('Logout may not have completed cleanly. Please refresh or clear cookies if you encounter issues.');
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <FaBookOpen className="icon" />
          <Link to={user ? "/blog" : "/"} className="title">Blog Site</Link>
        </div>
        <div className="nav-center">
          {user ? `Welcome, ${user.name || user.email}!` : 'Welcome!'}
        </div>
        <div className="nav-right">
          {user && (
            <button className="logout-btn" onClick={handleLogout}>
              Log out
            </button>
          )}
        </div>
      </nav>
      <Outlet />
    </>
  );
}
