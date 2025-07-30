import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
      formData.append('_method', 'PUT');

      const response = await fetch(`/api/posts/${id}`, {
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

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      // Get CSRF cookie
      await fetch('/sanctum/csrf-cookie', { credentials: 'include' });

      // Get CSRF token from cookie
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          ...(csrfToken && { 'X-XSRF-TOKEN': decodeURIComponent(csrfToken) }),
        },
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        const errorMsg = data.errors ? Object.values(data.errors).flat().join(', ') : (data.error || data.message || 'Failed to delete post');
        setError(errorMsg);
      } else {
        navigate('/admin/posts');
      }
    } catch {
      setError('Network error. Failed to delete post.');
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
          <label className="block font-medium mb-2">Image</label>
          
          {/* Current Image Preview */}
          {imagePreview && (
            <div className="mb-3">
              <img 
                src={imagePreview} 
                alt="Current image" 
                style={{
                  maxWidth: '200px',
                  maxHeight: '200px',
                  borderRadius: '8px',
                  border: '2px solid #e5e7eb'
                }} 
              />
            </div>
          )}
          
          {/* Image Upload Area */}
          <div style={{
            border: '2px dashed #d1d5db',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
            backgroundColor: imagePreview ? '#f9fafb' : '#fafafa',
            transition: 'all 0.2s ease'
          }}>
            <input 
              type="file" 
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" 
              onChange={handleImageChange} 
              disabled={saving}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                backgroundColor: '#fff'
              }}
            />
            <div style={{
              marginTop: '8px',
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              {imagePreview ? 'Choose a new image to replace the current one' : 'Choose an image file (JPEG, PNG, GIF, WEBP)'}
              <br />
              Maximum file size: 50MB
            </div>
          </div>
          
          {/* Remove Image Button */}
          {imagePreview && (
            <button 
              type="button" 
              onClick={handleRemoveImage}
              disabled={saving}
              style={{
                marginTop: '8px',
                padding: '6px 12px',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                border: '1px solid #fecaca',
                borderRadius: '4px',
                fontSize: '0.875rem',
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.6 : 1
              }}
            >
              Remove Current Image
            </button>
          )}
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

export default AdminEditPostPage
