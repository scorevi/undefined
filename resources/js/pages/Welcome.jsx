import React from 'react';
import { Link } from "react-router-dom";
import './styles/welcome.css';

const Welcome = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className='welcome-cont'>
        <div className="welcome-header">
          <h1>Erikanoelvi&apos;s Blog</h1>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#222', marginBottom: 16 }}>
            A modern blog platform for the DWP Subject.
          </h2>
          <p style={{ color: '#555', marginBottom: 32, fontSize: 18 }}>
            Sign in or register to get started.
          </p>
        </div>

        <div className="welcome-actions">
          <Link
            to="/login"
            style={{
              background: 'linear-gradient(10deg, #A0B0FF 0%, #5E4AE3 100%)',
              color: 'white',
            }}
          >
            User Login
          </Link>
          <Link
            to="/register"
            style={{
              background: 'linear-gradient(10deg, #A0B0FF 0%, #F8E2FF 100%)',
              color: '#1E1E24',
            }}
          >
            User Register
          </Link>
          <Link
            to="/admin/login"
            style={{
              background: 'linear-gradient(10deg, #5E4AE3 0%, #A0B0FF 100%)',
              color: 'white',
            }}
          >
            Admin Login
          </Link>
          <Link
            to="/admin/signup"
            style={{
              background: 'linear-gradient(10deg, #F8E2FF 0%, #A0B0FF 100%)',
              color: '#1E1E24',
            }}
          >
            Admin Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
