import './bootstrap';
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import React, { createContext, useContext, useState } from 'react';
import ReactDOM from 'react-dom/client';
import Main from './pages/Main';
import UserPost from './pages/UserPost';
import Footer from './components/Footer';
import Login from './components/UserLogin';
import Register from './components/UserRegister';
import AdminLogin from './components/Login';
import AdminSignup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
// Removed: import UserDashboard from './components/UserDashboard';

// Custom Welcome Page
const Welcome = () => (
  <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(120deg, #f0f4ff 0%, #e0ffe8 100%)' }}>
    <div style={{ maxWidth: 400, width: '100%', background: 'white', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 40, textAlign: 'center' }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, color: '#2563eb', marginBottom: 8 }}>Blog Platform</h1>
      <h2 style={{ fontSize: 22, fontWeight: 600, color: '#222', marginBottom: 16 }}>Welcome!</h2>
      <p style={{ color: '#555', marginBottom: 32 }}>Sign in or register to get started.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Link to="/login" style={{ background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)', color: 'white', borderRadius: 8, padding: '12px 0', fontWeight: 600, textDecoration: 'none', fontSize: 16, boxShadow: '0 2px 8px rgba(37,99,235,0.08)' }}>User Login</Link>
        <Link to="/register" style={{ background: 'linear-gradient(90deg, #22c55e 0%, #86efac 100%)', color: 'white', borderRadius: 8, padding: '12px 0', fontWeight: 600, textDecoration: 'none', fontSize: 16, boxShadow: '0 2px 8px rgba(34,197,94,0.08)' }}>User Register</Link>
        <Link to="/admin/login" style={{ background: 'linear-gradient(90deg, #f59e42 0%, #fbbf24 100%)', color: 'white', borderRadius: 8, padding: '12px 0', fontWeight: 600, textDecoration: 'none', fontSize: 16, boxShadow: '0 2px 8px rgba(251,191,36,0.08)' }}>Admin Login</Link>
        <Link to="/admin/signup" style={{ background: 'linear-gradient(90deg, #e11d48 0%, #f472b6 100%)', color: 'white', borderRadius: 8, padding: '12px 0', fontWeight: 600, textDecoration: 'none', fontSize: 16, boxShadow: '0 2px 8px rgba(225,29,72,0.08)' }}>Admin Register</Link>
      </div>
    </div>
  </div>
);

// Simple Auth Context (replace with real auth in production)
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  // For demo: use localStorage or default to not logged in
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/blog" element={<ProtectedRoute><Main /></ProtectedRoute>} />
        <Route path="/userpost" element={<ProtectedRoute><UserPost /></ProtectedRoute>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </AuthProvider>
);

const root = document.getElementById('react-root');

if (root) {
  ReactDOM.createRoot(root).render(<App />);
}
