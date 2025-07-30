import './bootstrap';
import React, { createContext, useContext, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useParams, useLocation } from "react-router-dom";
import Welcome from './pages/Welcome';
import Main from './pages/Main';
import UserPost from './pages/UserPost';
import Footer from './components/Footer';
import Login from './components/UserLogin';
import Register from './components/UserRegister';
import AdminLogin from './components/Login';
import AdminSignup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import AdminSettings from './pages/AdminSettings.jsx';
import AdminNewPost from './pages/AdminNewPost.jsx';
import AdminEditPostPage from './pages/AdminEditPostPage.jsx';
import AdminEditPosts from './pages/AdminEditPosts';
import AdminComments from './pages/AdminComments.jsx';
import { AuthProvider, useAuth } from './authContext';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
// Removed: import UserDashboard from './components/UserDashboard';

// Protected Route Wrapper for regular users (also allows admins)
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'user' && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

// Admin Route Wrapper
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') return <Navigate to="/admin/login" replace />;
  return children;
};

// Public Route Wrapper
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    const redirectPath = user.role === 'admin' ? '/admin' : '/blog';
    return <Navigate to={redirectPath} replace />;
  }
  return children;
};

const App = () => {
  const { user } = useAuth();
  const [siteMeta, setSiteMeta] = useState({ name: '', description: '' });
  const location = useLocation();

  useEffect(() => {
    if (!user) return; // Only fetch if user is logged in
    NProgress.start();

    // Configure request based on user role
    const endpoint = user.role === 'admin' ? '/api/admin/dashboard' : '/api/user/dashboard';
    const requestConfig = {
      credentials: 'include',
      headers: {}
    };

    // Admin uses Bearer token, users use session auth
    if (user.role === 'admin') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        requestConfig.headers['Authorization'] = `Bearer ${token}`;
      }
    } else {
      // For regular users, include CSRF token for session authentication
      const csrfToken = decodeURIComponent(document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='))?.split('=')[1] || '');
      if (csrfToken) {
        requestConfig.headers['X-XSRF-TOKEN'] = csrfToken;
      }
    }

    fetch(endpoint, requestConfig)
      .then(res => res.json())
      .then(data => {
        const name = data.stats?.site_name || 'Undefined\'s Blog';
        const desc = (data.stats?.site_description || 'A modern blog platform for the DWP Subject.').slice(0, 120);
        setSiteMeta({ name, description: desc });
        document.title = name;
        let meta = document.querySelector('meta[name="description"]');
        if (!meta) {
          meta = document.createElement('meta');
          meta.name = 'description';
          document.head.appendChild(meta);
        }
        meta.content = desc;
        NProgress.done();
      })
      .catch(() => NProgress.done());
  }, [location, user]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<PublicRoute><Welcome /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/admin/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
          <Route path="/admin/signup" element={<PublicRoute><AdminSignup /></PublicRoute>} />
          <Route path="/blog" element={<ProtectedRoute><Main /></ProtectedRoute>} />
          <Route path="/blog/post/:id" element={<ProtectedRoute><UserPost /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/posts/new" element={<AdminRoute><AdminNewPost /></AdminRoute>} />
          <Route path="/admin/posts" element={<AdminRoute><AdminEditPosts /></AdminRoute>} />
          <Route path="/admin/posts/:id/edit" element={<AdminRoute><AdminEditPostPage /></AdminRoute>} />
          <Route path="/admin/comments" element={<AdminRoute><AdminComments /></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

const root = document.getElementById('react-root');

if (root) {
  ReactDOM.createRoot(root).render(
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  );
}
