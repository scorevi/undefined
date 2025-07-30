import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      // Get CSRF cookie
      await fetch('/sanctum/csrf-cookie', { credentials: 'include' });
      
      // Get CSRF token from cookie
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
      
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (image) formData.append('image', image);
      
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          ...(csrfToken && { 'X-XSRF-TOKEN': decodeURIComponent(csrfToken) }),
        },
        credentials: 'include',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        const errorMsg = data.errors ? Object.values(data.errors).flat().join(', ') : (data.error || data.message || 'Failed to create post');
        setError(errorMsg);
      } else if (!data.success) {
        setError(data.error || data.message || 'Failed to create post');
      } else {
        setSuccess('Post created successfully!');
        setTitle('');
        setContent('');
        setImage(null);
        setImagePreview(null);
        setTimeout(() => navigate('/admin/posts'), 1200);
      }
    } catch (err) {
      setError('Network error. Please try again.');
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

export default AdminNewPost;