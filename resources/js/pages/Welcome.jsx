import { Link } from "react-router-dom";

const Welcome = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(120deg, #f0f4ff 0%, #e0ffe8 100%)'
  }}>
    <div style={{
      width: '100%',
      maxWidth: 900,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 40
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 48, fontWeight: 800, color: '#2563eb', marginBottom: 8, letterSpacing: 1 }}>Erikanoelvi's Blog</h1>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#222', marginBottom: 16 }}>A modern blog platform for the DWP Subject.</h2>
        <p style={{ color: '#555', marginBottom: 32, fontSize: 18 }}>Sign in or register to get started.</p>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        width: 320,
        alignItems: 'stretch'
      }}>
        <Link to="/login" style={{
          background: '#3b82f6',
          color: 'white',
          borderRadius: 10,
          padding: '18px 0',
          fontWeight: 700,
          textDecoration: 'none',
          fontSize: 20,
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(37,99,235,0.08)'
        }}>User Login</Link>
        <Link to="/register" style={{
          background: '#22c55e',
          color: 'white',
          borderRadius: 10,
          padding: '18px 0',
          fontWeight: 700,
          textDecoration: 'none',
          fontSize: 20,
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(34,197,94,0.08)'
        }}>User Register</Link>
        <Link to="/admin/login" style={{
          background: '#fbbf24',
          color: 'white',
          borderRadius: 10,
          padding: '18px 0',
          fontWeight: 700,
          textDecoration: 'none',
          fontSize: 20,
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(251,191,36,0.08)'
        }}>Admin Login</Link>
        <Link to="/admin/signup" style={{
          background: 'linear-gradient(90deg, #e11d48 0%, #f472b6 100%)',
          color: 'white',
          borderRadius: 10,
          padding: '18px 0',
          fontWeight: 700,
          textDecoration: 'none',
          fontSize: 20,
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(225,29,72,0.08)'
        }}>Admin Register</Link>
      </div>
    </div>
  </div>
);

export default Welcome;