import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../authContext';
import { FaCamera } from 'react-icons/fa';

import './styles/main.css';
import Posts from '../components/Posts';
import Navbar from '../components/NavBar';

function getPostImageUrl(image) {
  if (!image) return null; // No fallback to external images
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  return `/storage/${image}`;
}

const Main = () => {
  document.title = "Home";
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [refreshPosts, setRefreshPosts] = useState(0);

  useEffect(() => {
    // No longer needed - featured posts handled by Posts component
  }, [refreshPosts]); // depend on refreshPosts

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
    if (file.size > 50 * 1024 * 1024) { // 50MB limit
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
    if (!content.trim()) {
      setError('Content cannot be empty.');
      setLoading(false);
      return;
    }
    if (!category.trim()) {
      setError('Please select a category.');
      setLoading(false);
      return;
    }
    if (image && !image.type.startsWith('image/')) {
      setError('Only image files are allowed.');
      setLoading(false);
      return;
    }
    if (image && image.size > 50 * 1024 * 1024) {
      setError('Image size must be less than 50MB.');
      setLoading(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', content.slice(0, 40) + (content.length > 40 ? '...' : ''));
      formData.append('content', content);
      formData.append('category', category);
      if (image) {
        formData.append('image', image);
      }

      // Use Bearer token authentication for admin users
      const headers = {};
      if (user?.role === 'admin') {
        const token = localStorage.getItem('auth_token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }
      headers['Accept'] = 'application/json';

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        let errorMessage = data.error || data.message || 'Failed to submit post';
        if (data.errors) {
          // If we have detailed validation errors, show the first one
          const firstError = Object.values(data.errors)[0];
          if (firstError) {
            errorMessage = firstError[0];
          }
        }
        setError(errorMessage);
      } else {
        setSuccess('Post submitted!');
        setContent('');
        setCategory('');
        setImage(null);
        setImagePreview(null);
        setRefreshPosts(r => r + 1); // trigger posts refresh
      }
    } catch (err) {
      setError('Error submitting post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar name={user?.name || user?.email || 'John'}/>
    <div className="container">

      {/* Only show post creation form for admin users */}
      {user?.role === 'admin' && (
        <>
          <form className="post-form" onSubmit={handleSubmit}>
            <img
              src={user?.avatar || 'https://i.pravatar.cc/300'}
              alt="Avatar"
              className="avatar" />

            <div className="post-input-section">
              <textarea
                placeholder="Share your thoughts!"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={loading}
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.8rem 2rem',
                  marginBottom: '0.5rem',
                  borderRadius: '12px',
                  border: '0.2rem solid #5e4ae354',
                  backgroundColor: 'white',
                  fontSize: '1rem',
                  fontFamily: 'Nunito',
                  boxShadow: '0.3rem 0.3rem 8px #b7b5c9'
                }}
              >
                <option value="">Select a category...</option>
                <option value="news">📰 News</option>
                <option value="review">⭐ Review</option>
                <option value="podcast">🎧 Podcast</option>
                <option value="opinion">💭 Opinion</option>
                <option value="lifestyle">🌟 Lifestyle</option>
              </select>

              <div className="post-actions">
                <label htmlFor="image-upload" className="custom-upload-btn">
                  <FaCamera /> Upload Image
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                  disabled={loading}
                />
                <span className="file-name">
                  {image ? image.name : ""}
                </span>
                <button type="submit" disabled={loading}>{loading ? 'Posting...' : 'Post'}</button>
              </div>

              {imagePreview && (
                <div style={{marginTop:8}}>
                  <img src={imagePreview} alt="Preview" style={{maxWidth:200, maxHeight:200, borderRadius:8, boxShadow:'0 2px 8px #ccc'}} />
                </div>
              )}
              {error && <div className="user-error-message">{error}</div>}
              {success && <div className="user-success-message" style={{color:'#22c55e',marginTop:8}}>{success}</div>}
            </div>
          </form>
          <hr />
        </>
      )}

      {/* Featured Posts Carousel Removed - Now handled in Posts component */}

      <Posts refresh={refreshPosts} />


    </div>
    </>
  );
};

export default Main;
