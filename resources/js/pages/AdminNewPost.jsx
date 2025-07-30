import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../components/AdminHeader';
import ImageUpload from '../components/ImageUpload';

const AdminNewPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('news');
  const [isFeatured, setIsFeatured] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (file) => {
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
    setLoading(true);
    setError('');
    setSuccess('');
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      setLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('category', category);
      formData.append('is_featured', isFeatured ? '1' : '0');
      if (image) formData.append('image', image);

      // Debug logging
      console.log('Creating post with:', {
        title,
        category,
        isFeatured,
        is_featured_value: isFeatured ? '1' : '0',
        hasImage: !!image,
        token: token ? 'Present' : 'Missing',
        tokenLength: token ? token.length : 0
      });

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
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
        setCategory('news');
        setIsFeatured(false);
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
    <div>
      <AdminHeader showBackButton={true} backText="Back" />
      <div style={{maxWidth:600,margin:'40px auto',background:'#fff',padding:32,borderRadius:12,boxShadow:'0 2px 12px #e0e0e0'}}>
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
          <label className="block font-medium mb-1">Category</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={category}
            onChange={e=>setCategory(e.target.value)}
            disabled={loading}
          >
            <option value="news">News</option>
            <option value="review">Review</option>
            <option value="podcast">Podcast</option>
            <option value="opinion">Opinion</option>
            <option value="lifestyle">Lifestyle</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={isFeatured}
              onChange={e=>setIsFeatured(e.target.checked)}
              disabled={loading}
            />
            <span className="font-medium">Featured Post</span>
          </label>
          <p className="text-sm text-gray-600 mt-1">Featured posts will be highlighted on the homepage.</p>
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2">Image (optional)</label>
          <ImageUpload
            image={image}
            imagePreview={imagePreview}
            onChange={handleImageChange}
            onRemove={handleRemoveImage}
            disabled={loading}
          />
        </div>
        {error && <div style={{color:'#dc2626',marginBottom:8}}>{error}</div>}
        {success && <div style={{color:'#22c55e',marginBottom:8}}>{success}</div>}
        <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded font-semibold" disabled={loading}>{loading ? 'Creating...' : 'Create Post'}</button>
      </form>
    </div>
    </div>
  );
};

export default AdminNewPost;
