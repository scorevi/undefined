import React from 'react';
import { FaBookOpen } from 'react-icons/fa';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import './Styles/navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    let logoutSuccess = false;
    try {
      // First get CSRF cookie
      await fetch('/sanctum/csrf-cookie', {
        credentials: 'include',
      });

      // Get CSRF token from cookie
      const csrfCookie = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='));
      const csrfToken = csrfCookie ? decodeURIComponent(csrfCookie.split('=')[1]) : '';

      // Try user logout endpoint first
      let response = await fetch('/api/user/logout', {
        method: 'POST',
        headers: {
          'X-XSRF-TOKEN': csrfToken,
          'Accept': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        // Try fallback logout endpoint
        response = await fetch('/api/logout', {
          method: 'POST',
          headers: {
            'X-XSRF-TOKEN': csrfToken,
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
      console.warn('Logout API call failed, but local session has been cleared');
      // Note: We still navigate and clear local state even if server logout fails for better UX
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
