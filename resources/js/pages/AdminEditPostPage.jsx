import { useState } from "react";
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

export default AdminEditPostPage