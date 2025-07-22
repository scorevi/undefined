import React from 'react';
import { FaBookOpen } from 'react-icons/fa';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../app.jsx';
import './navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Optionally call backend logout endpoint here
    await fetch('/api/user/logout', {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      credentials: 'include',
    });
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <FaBookOpen className="icon" />
          <Link to="/" className="title">Blog Site</Link>
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