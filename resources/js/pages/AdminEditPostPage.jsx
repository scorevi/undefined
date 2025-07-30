import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminHeader from '../components/AdminHeader';
import ImageUpload from '../components/ImageUpload';

const AdminEditPostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('news');
  const [isFeatured, setIsFeatured] = useState(false);
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
      .then(response => {
        if (response.success && response.data) {
          const data = response.data;
          setPost(data);
          setTitle(data.title || '');
          setContent(data.content || '');
          setCategory(data.category || 'news');
          setIsFeatured(data.is_featured || false);
          setImagePreview(data.image ? `/storage/${data.image}` : null);
        } else {
          setError(response.error || 'Failed to load post');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load post');
        setLoading(false);
      });
  }, [id]);

  const handleImageChange = (file) => {
    setError('');
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setSaving(false);
        return;
      }

      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        const errorMsg = data.errors ? Object.values(data.errors).flat().join(', ') : (data.error || data.message || 'Failed to delete post');
        setError(errorMsg);
      } else if (!data.success) {
        setError(data.error || data.message || 'Failed to delete post');
      } else {
        setSuccess('Post deleted successfully!');
        setTimeout(() => navigate('/admin/posts'), 1000);
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
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
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setSaving(false);
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('category', category);
      formData.append('is_featured', isFeatured ? '1' : '0');
      if (image) formData.append('image', image);
      formData.append('_method', 'PUT');

      const response = await fetch(`/api/posts/${id}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        const errorMsg = data.errors ? Object.values(data.errors).flat().join(', ') : (data.error || data.message || 'Failed to update post');
        setError(errorMsg);
      } else if (!data.success) {
        setError(data.error || data.message || 'Failed to update post');
      } else {
        setSuccess('Post updated successfully!');
        setTimeout(() => navigate('/admin/posts'), 1200);
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{padding:40}}>Loading...</div>;
  if (error) return <div style={{padding:40, color:'#dc2626'}}>{error}</div>;

  return (
    <div>
      <AdminHeader showBackButton={true} backText="Back to Manage Posts" />
      <div style={{maxWidth:700,margin:'40px auto',background:'#fff',padding:32,borderRadius:12,boxShadow:'0 2px 12px #e0e0e0'}}>
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
          <label className="block font-medium mb-1">Category</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={category}
            onChange={e=>setCategory(e.target.value)}
            disabled={saving}
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
              disabled={saving}
            />
            <span className="font-medium">Featured Post</span>
          </label>
          <p className="text-sm text-gray-600 mt-1">Featured posts will be highlighted on the homepage.</p>
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2">Image</label>
          <ImageUpload
            image={image}
            imagePreview={imagePreview}
            onChange={handleImageChange}
            onRemove={handleRemoveImage}
            disabled={saving}
          />
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
        {error && <div className="error-message">{error}</div>}
        {success && <div style={{color:'#22c55e',marginBottom:8}}>{success}</div>}
        <div className="flex gap-4 mt-6">
          <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded font-semibold" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          <button type="button" className="bg-gray-300 text-gray-800 px-5 py-2 rounded font-semibold" onClick={()=>navigate('/admin/posts')} disabled={saving}>Cancel</button>
          <button type="button" className="bg-red-600 text-white px-5 py-2 rounded font-semibold ml-auto" onClick={handleDelete} disabled={saving}>Delete Post</button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default AdminEditPostPage
