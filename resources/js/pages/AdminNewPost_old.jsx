import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './styles/adminnewpost.css';

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
    <div className="admin-new-post-container">
      <div className="admin-new-post-header">
        <h2>Create New Post</h2>
        <p>Share your thoughts and ideas with the community</p>
      </div>

      <div className="admin-new-post-content">
        <button onClick={() => navigate(-1)} className="back-btn">&larr; Back</button>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={e=>setTitle(e.target.value)}
              disabled={loading}
              required
              placeholder="Enter your post title..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea
              className="form-textarea"
              rows={8}
              value={content}
              onChange={e=>setContent(e.target.value)}
              disabled={loading}
              required
              placeholder="Write your post content here..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Featured Image (optional)</label>
            <div className={`image-upload-section ${imagePreview ? 'has-image' : ''}`}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
              />
              {imagePreview ? (
                <div className="image-preview-container">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="image-preview"
                  />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading && <span className="loading-indicator">⟳</span>}
            {loading ? 'Creating Post...' : 'Create Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminNewPost;
