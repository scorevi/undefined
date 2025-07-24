import './bootstrap';
import React, { createContext, useContext, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useParams, useLocation } from "react-router-dom";
import Main from './pages/Main';
import UserPost from './pages/UserPost';
import Footer from './components/Footer';
import Login from './components/UserLogin';
import Register from './components/UserRegister';
import AdminLogin from './components/Login';
import AdminSignup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import { AuthProvider, useAuth } from './authContext';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
// Removed: import UserDashboard from './components/UserDashboard';

// Custom Welcome Page
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
        <h1 style={{ fontSize: 48, fontWeight: 800, color: '#2563eb', marginBottom: 8, letterSpacing: 1 }}>Blog Platform</h1>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#222', marginBottom: 16 }}>Welcome!</h2>
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

// Protected Route Wrapper for regular users
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'user') return <Navigate to="/" replace />;
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
  console.log('PublicRoute user:', user);
  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'user') return <Navigate to="/blog" replace />;
  }
  return children;
};

// Placeholder admin pages
const AdminNewPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setImage(null);
      setImagePreview(null);
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed.');
      setImage(null);
      setImagePreview(null);
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError('Image size must be less than 50MB.');
      setImage(null);
      setImagePreview(null);
      return;
    }
    setError('');
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      setLoading(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (image) formData.append('image', image);
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'X-CSRF-TOKEN': csrfToken },
        credentials: 'include',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.error || data.message || 'Failed to create post');
      } else {
        setSuccess('Post created!');
        setTitle('');
        setContent('');
        setImage(null);
        setImagePreview(null);
        setTimeout(() => navigate('/admin/posts'), 1200);
      }
    } catch (err) {
      setError('Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{maxWidth:600,margin:'40px auto',background:'#fff',padding:32,borderRadius:12,boxShadow:'0 2px 12px #e0e0e0'}}>
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-600 hover:underline">&larr; Back</button>
      <h2 className="text-xl font-bold mb-4">Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium mb-1">Title</label>
          <input type="text" className="w-full border rounded px-3 py-2" value={title} onChange={e=>setTitle(e.target.value)} disabled={loading} required />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Content</label>
          <textarea className="w-full border rounded px-3 py-2" rows={6} value={content} onChange={e=>setContent(e.target.value)} disabled={loading} required />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Image (optional)</label>
          <input type="file" accept="image/*" onChange={handleImageChange} disabled={loading} />
          {imagePreview && <img src={imagePreview} alt="Preview" style={{maxWidth:180,maxHeight:180,marginTop:8,borderRadius:8}} />}
        </div>
        {error && <div style={{color:'#dc2626',marginBottom:8}}>{error}</div>}
        {success && <div style={{color:'#22c55e',marginBottom:8}}>{success}</div>}
        <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded font-semibold" disabled={loading}>{loading ? 'Creating...' : 'Create Post'}</button>
      </form>
    </div>
  );
};
const AdminEditPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch('/api/posts?per_page=20')
      .then(res => res.json())
      .then(data => {
        setPosts(Array.isArray(data.data) ? data.data : []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load posts');
        setLoading(false);
      });
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: { 'X-CSRF-TOKEN': csrfToken },
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
      setRefresh(r => r + 1);
    } catch {
      alert('Failed to delete post.');
    }
  };

  return (
    <div style={{maxWidth:900,margin:'40px auto',background:'#fff',padding:32,borderRadius:12,boxShadow:'0 2px 12px #e0e0e0'}}>
      <button onClick={() => navigate('/admin')} className="mb-4 text-blue-600 hover:underline">&larr; Back to Dashboard</button>
      <h2 className="text-xl font-bold mb-4">Manage Posts</h2>
      {loading ? <div>Loading...</div> : error ? <div style={{color:'#dc2626'}}>{error}</div> : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Likes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map(post => (
                <tr key={post.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{post.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{post.user?.name || post.user?.email || 'Unknown'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{post.created_at ? new Date(post.created_at).toLocaleDateString() : 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{post.likes_count ?? 0}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{post.views ?? 0}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => navigate(`/admin/posts/${post.id}/edit`)} className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
const AdminComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch('/api/comments?per_page=30')
      .then(res => res.json())
      .then(data => {
        setComments(Array.isArray(data.data) ? data.data : []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load comments');
        setLoading(false);
      });
  }, [refresh]);

  const handleDelete = async (comment) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const res = await fetch(`/api/posts/${comment.post_id}/comments/${comment.id}`, {
        method: 'DELETE',
        headers: { 'X-CSRF-TOKEN': csrfToken },
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
      setRefresh(r => r + 1);
    } catch {
      alert('Failed to delete comment.');
    }
  };

  const handleEdit = (comment) => {
    const newContent = prompt('Edit comment:', comment.content);
    if (newContent === null || newContent.trim() === '' || newContent === comment.content) return;
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    fetch(`/api/posts/${comment.post_id}/comments/${comment.id}`, {
      method: 'PATCH',
      headers: {
        'X-CSRF-TOKEN': csrfToken,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ content: newContent }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setRefresh(r => r + 1);
        else alert(data.error || 'Failed to update comment.');
      })
      .catch(() => alert('Failed to update comment.'));
  };

  return (
    <div style={{maxWidth:1100,margin:'40px auto',background:'#fff',padding:32,borderRadius:12,boxShadow:'0 2px 12px #e0e0e0'}}>
      <button onClick={() => navigate('/admin')} className="mb-4 text-blue-600 hover:underline">&larr; Back to Dashboard</button>
      <h2 className="text-xl font-bold mb-4">All Comments</h2>
      {loading ? <div>Loading...</div> : error ? <div style={{color:'#dc2626'}}>{error}</div> : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {comments.map(comment => (
                <tr key={comment.id}>
                  <td className="px-6 py-4 whitespace-pre-line max-w-xs">
                    <div className="text-sm text-gray-900">{comment.content}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{comment.post?.title || `Post #${comment.post_id}`}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{comment.user?.name || comment.user?.email || 'Unknown'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{comment.created_at ? new Date(comment.created_at).toLocaleString() : 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{comment.updated_at ? new Date(comment.updated_at).toLocaleString() : 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleEdit(comment)} className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button onClick={() => handleDelete(comment)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
const AdminSettings = () => {
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [siteName, setSiteName] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError('');
    // Fetch current admin info and site settings
    fetch('/api/dashboard', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setEmail(data.user?.email || '');
        setSiteName(data.stats?.site_name || '');
        setSiteDescription(data.stats?.site_description || '');
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load settings');
        setLoading(false);
      });
  }, []);

  const handleSaveEmail = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback('');
    setError('');
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const res = await fetch('/api/admin/email', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || data.message || 'Failed to update email');
      setFeedback('Email updated!');
    } catch (err) {
      setError(err.message || 'Failed to update email');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback('');
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setSaving(false);
      return;
    }
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const res = await fetch('/api/admin/password', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || data.message || 'Failed to update password');
      setFeedback('Password updated!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSite = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback('');
    setError('');
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const res = await fetch('/api/admin/site-settings', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ site_name: siteName, site_description: siteDescription }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || data.message || 'Failed to update site settings');
      setFeedback('Site settings updated!');
    } catch (err) {
      setError(err.message || 'Failed to update site settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{maxWidth:600,margin:'40px auto',background:'#fff',padding:32,borderRadius:12,boxShadow:'0 2px 12px #e0e0e0'}}>
      <button onClick={() => navigate('/admin')} className="mb-4 text-blue-600 hover:underline">&larr; Back to Dashboard</button>
      <h2 className="text-xl font-bold mb-4">Admin Settings</h2>
      {loading ? <div>Loading...</div> : (
        <>
          <form onSubmit={handleSaveEmail} className="mb-8">
            <h3 className="font-semibold mb-2">Change Email</h3>
            <input type="email" className="w-full border rounded px-3 py-2 mb-2" value={email} onChange={e=>setEmail(e.target.value)} disabled={saving} required />
            <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded font-semibold" disabled={saving}>Save Email</button>
          </form>
          <form onSubmit={handleSavePassword} className="mb-8">
            <h3 className="font-semibold mb-2">Change Password</h3>
            <input type="password" className="w-full border rounded px-3 py-2 mb-2" placeholder="Current password" value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)} disabled={saving} required />
            <input type="password" className="w-full border rounded px-3 py-2 mb-2" placeholder="New password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} disabled={saving} required />
            <input type="password" className="w-full border rounded px-3 py-2 mb-2" placeholder="Confirm new password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} disabled={saving} required />
            <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded font-semibold" disabled={saving}>Save Password</button>
          </form>
          <form onSubmit={handleSaveSite} className="mb-8">
            <h3 className="font-semibold mb-2">Site Settings</h3>
            <input type="text" className="w-full border rounded px-3 py-2 mb-2" placeholder="Site Name" value={siteName} onChange={e=>setSiteName(e.target.value)} disabled={saving} />
            <textarea className="w-full border rounded px-3 py-2 mb-2" placeholder="Site Description" value={siteDescription} onChange={e=>setSiteDescription(e.target.value)} disabled={saving} />
            <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded font-semibold" disabled={saving}>Save Site Settings</button>
          </form>
          {feedback && <div style={{color:'#22c55e',marginBottom:8}}>{feedback}</div>}
          {error && <div style={{color:'#dc2626',marginBottom:8}}>{error}</div>}
        </>
      )}
    </div>
  );
};

const AdminEditPostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(`/api/posts/${id}`)
      .then(res => res.json())
      .then(data => {
        setPost(data);
        setTitle(data.title || '');
        setContent(data.content || '');
        setImagePreview(data.image ? `/storage/${data.image}` : null);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load post');
        setLoading(false);
      });
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setImage(null);
      setImagePreview(post?.image ? `/storage/${post.image}` : null);
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed.');
      setImage(null);
      setImagePreview(post?.image ? `/storage/${post.image}` : null);
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError('Image size must be less than 50MB.');
      setImage(null);
      setImagePreview(post?.image ? `/storage/${post.image}` : null);
      return;
    }
    setError('');
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      setSaving(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (image) formData.append('image', image);
      formData.append('_method', 'PUT');
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const response = await fetch(`/api/posts/${id}`, {
        method: 'POST',
        headers: { 'X-CSRF-TOKEN': csrfToken },
        credentials: 'include',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.error || data.message || 'Failed to update post');
      } else {
        setSuccess('Post updated!');
        setTimeout(() => navigate('/admin/posts'), 1200);
      }
    } catch (err) {
      setError('Error updating post');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: { 'X-CSRF-TOKEN': csrfToken },
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
      navigate('/admin/posts');
    } catch {
      setError('Failed to delete post.');
    }
  };

  if (loading) return <div style={{padding:40}}>Loading...</div>;
  if (error) return <div style={{padding:40, color:'#dc2626'}}>{error}</div>;

  return (
    <div style={{maxWidth:700,margin:'40px auto',background:'#fff',padding:32,borderRadius:12,boxShadow:'0 2px 12px #e0e0e0'}}>
      <button onClick={() => navigate('/admin/posts')} className="mb-4 text-blue-600 hover:underline">&larr; Back to Manage Posts</button>
      <h2 className="text-xl font-bold mb-4">Edit Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium mb-1">Title</label>
          <input type="text" className="w-full border rounded px-3 py-2" value={title} onChange={e=>setTitle(e.target.value)} disabled={saving} required />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Content</label>
          <textarea className="w-full border rounded px-3 py-2" rows={8} value={content} onChange={e=>setContent(e.target.value)} disabled={saving} required />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Image</label>
          {imagePreview && <img src={imagePreview} alt="Preview" style={{maxWidth:180,maxHeight:180,marginBottom:8,borderRadius:8}} />}
          <div style={{marginBottom:8}}>
            <input type="file" accept="image/*" onChange={handleImageChange} disabled={saving} />
            {imagePreview && <button type="button" onClick={handleRemoveImage} style={{marginLeft:8,color:'#dc2626',background:'none',border:'none',cursor:'pointer'}}>Remove Image</button>}
          </div>
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Author</label>
          <div className="w-full border rounded px-3 py-2 bg-gray-100">{post.user?.name || post.user?.email || 'Unknown'}</div>
        </div>
        <div className="mb-4 flex gap-6">
          <div>
            <label className="block font-medium mb-1">Created</label>
            <div className="w-full border rounded px-3 py-2 bg-gray-100">{post.created_at ? new Date(post.created_at).toLocaleString() : 'N/A'}</div>
          </div>
          <div>
            <label className="block font-medium mb-1">Views</label>
            <div className="w-full border rounded px-3 py-2 bg-gray-100">{post.views ?? 0}</div>
          </div>
          <div>
            <label className="block font-medium mb-1">Likes</label>
            <div className="w-full border rounded px-3 py-2 bg-gray-100">{post.likes_count ?? 0}</div>
          </div>
        </div>
        {error && <div style={{color:'#dc2626',marginBottom:8}}>{error}</div>}
        {success && <div style={{color:'#22c55e',marginBottom:8}}>{success}</div>}
        <div className="flex gap-4 mt-6">
          <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded font-semibold" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          <button type="button" className="bg-gray-300 text-gray-800 px-5 py-2 rounded font-semibold" onClick={()=>navigate('/admin/posts')} disabled={saving}>Cancel</button>
          <button type="button" className="bg-red-600 text-white px-5 py-2 rounded font-semibold ml-auto" onClick={handleDelete} disabled={saving}>Delete Post</button>
        </div>
      </form>
    </div>
  );
};

const App = () => {
  const { user } = useAuth();
  const [siteMeta, setSiteMeta] = useState({ name: '', description: '' });
  const location = useLocation();

  useEffect(() => {
    if (!user) return; // Only fetch if user is logged in
    NProgress.start();
    fetch('/api/dashboard', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        const name = data.stats?.site_name || 'Blog Platform';
        const desc = (data.stats?.site_description || 'A modern blog platform.').slice(0, 120);
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
