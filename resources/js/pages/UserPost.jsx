import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHeart, FaComment } from 'react-icons/fa';
import Navbar from '../components/NavBar';
import { useAuth } from '../authContext';
import './userpost.css';

const UserPost = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [likeStatus, setLikeStatus] = useState({ liked: false, like_count: 0 });
  const [likeLoading, setLikeLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editImage, setEditImage] = useState(null);
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  const canEdit = user && post && (user.id === post.user_id || user.role === 'admin');
  const navigate = useNavigate();

  const startEdit = () => {
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditImage(null);
    setEditError('');
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditError('');
  };

  const handleEditSave = async () => {
    setEditLoading(true);
    setEditError('');
    try {
      // Step 1: Get CSRF cookie from Sanctum
      await fetch('/sanctum/csrf-cookie', {
        credentials: 'include',
      });
      // Step 2: Get XSRF-TOKEN from cookie and set X-XSRF-TOKEN header
      const xsrfToken = (() => {
        const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        return match ? decodeURIComponent(match[1]) : '';
      })();
      const formData = new FormData();
      formData.append('title', editTitle);
      formData.append('content', editContent);
      if (editImage) formData.append('image', editImage);
      formData.append('_method', 'PUT'); // Laravel expects this for method spoofing
      const url = `/api/posts/${id}`;
      console.log('Editing post, URL:', url); // Debug log
      const response = await fetch(url, {
        method: 'POST', // Use POST for FormData with file upload
        headers: {
          'X-XSRF-TOKEN': xsrfToken,
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: formData,
      });
      if (!response.ok) {
        const data = await response.json();
        setEditError(data.error || 'Failed to update post');
        setEditLoading(false);
        return;
      }
      const data = await response.json();
      setPost(data.post);
      setEditing(false);
    } catch (err) {
      setEditError('Error updating post');
    }
    setEditLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': csrfToken,
        },
        credentials: 'include',
      });
      if (!response.ok) {
        alert('Failed to delete post.');
        return;
      }
      navigate('/blog');
    } catch {
      alert('Error deleting post.');
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/posts/${id}`);
        if (!response.ok) throw new Error('Post not found');
        const data = await response.json();
        setPost(data);
        document.title = data.title;
      } catch (err) {
        setError('Could not load post.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!user) return;
      try {
        const response = await fetch(`/api/posts/${id}/like-status`, { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to fetch like status');
        const data = await response.json();
        setLikeStatus(data);
      } catch {
        setLikeStatus({ liked: false, like_count: 0 });
      }
    };
    fetchLikeStatus();
  }, [id, user]);

  const handleLike = async () => {
    if (!user || likeLoading) return;
    setLikeLoading(true);
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const response = await fetch(`/api/posts/${id}/${likeStatus.liked ? 'unlike' : 'like'}`, {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': csrfToken,
        },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to update like');
      const data = await response.json();
      setLikeStatus(data);
    } catch {}
    setLikeLoading(false);
  };

  if (loading) return <div className="user-loading">Loading post...</div>;
  if (error) return <div className="user-error-message">{error}</div>;
  if (!post) return null;

  return (
    <>
      <Navbar />
      <div className="blog-container" key={post.id} style={{maxWidth: '700px', margin: '2rem auto', background: 'white', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 0, overflow: 'hidden'}}>
        <img
          src={post.image ? `/storage/${post.image}` : 'https://picsum.photos/1000/400?random=1'}
          alt="Post cover"
          className="blog-image"
          style={{width: '100%', maxHeight: 300, objectFit: 'cover', borderTopLeftRadius: 16, borderTopRightRadius: 16, marginBottom: 0}}
        />
        <div className="blog-content" style={{padding: '2rem 2.5rem 1.5rem 2.5rem'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
            <h1 className="post-title" style={{fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0'}}>{editing ? 'Edit Post' : post.title}</h1>
            {canEdit && !editing && (
              <>
                <button onClick={startEdit} style={{background:'#f3f4f6',color:'#222',border:'none',borderRadius:6,padding:'8px 18px',fontWeight:500,cursor:'pointer',marginRight:8}}>Edit</button>
                <button onClick={handleDelete} style={{background:'#fee2e2',color:'#dc2626',border:'none',borderRadius:6,padding:'8px 18px',fontWeight:500,cursor:'pointer'}}>Delete</button>
              </>
            )}
          </div>
          <div className="author-section" style={{display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem'}}>
            <img
              src={post.user?.avatar || 'https://i.pravatar.cc/300'}
              alt="Author"
              className="author-img"
              style={{width: 36, height: 36, borderRadius: '50%', objectFit: 'cover'}}
            />
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <span className="author-name" style={{fontWeight: 600, fontSize: '1rem', margin: 0}}>{post.user?.name || post.user?.email || 'Unknown'}</span>
              <span className="post-date" style={{fontSize: '0.95rem', color: '#888', margin: 0}}>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          <hr style={{margin: '1.2rem 0'}} />
          {editing ? (
            <div style={{display:'flex',flexDirection:'column',gap:16}}>
              <input type="text" value={editTitle} onChange={e=>setEditTitle(e.target.value)} required style={{fontSize:'1.1rem',padding:'8px',borderRadius:6,border:'1px solid #ccc'}} />
              <textarea value={editContent} onChange={e=>setEditContent(e.target.value)} required rows={6} style={{fontSize:'1.1rem',padding:'8px',borderRadius:6,border:'1px solid #ccc'}} />
              <input type="file" accept="image/*" onChange={e=>setEditImage(e.target.files[0])} />
              {editError && <div className="user-error-message">{editError}</div>}
              <div style={{display:'flex',gap:12}}>
                <button type="button" onClick={handleEditSave} disabled={editLoading} style={{background:'#2563eb',color:'white',border:'none',borderRadius:6,padding:'8px 18px',fontWeight:500,cursor:'pointer'}}>{editLoading ? 'Saving...' : 'Save'}</button>
                <button type="button" onClick={cancelEdit} style={{background:'#f3f4f6',color:'#222',border:'none',borderRadius:6,padding:'8px 18px',fontWeight:500,cursor:'pointer'}}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="post-body" style={{fontSize: '1.13rem', lineHeight: 1.7, marginBottom: '2rem', color: '#333'}}>{post.content}</div>
          )}
          <div className="engagement-footer" style={{marginTop: '1.5rem', borderTop: '1px solid #eee', paddingTop: '1rem', display: 'flex', gap: '2rem', fontSize: '0.95rem', color: '#666'}}>
            <span style={{cursor: user ? 'pointer' : 'not-allowed', color: likeStatus.liked ? '#e11d48' : '#666', display: 'flex', alignItems: 'center'}} onClick={handleLike} title={user ? (likeStatus.liked ? 'Unlike' : 'Like') : 'Login to like'}>
              <FaHeart style={{marginRight: 4, fill: likeStatus.liked ? '#e11d48' : 'none', stroke: '#e11d48', strokeWidth: 30}} /> {likeStatus.like_count}
            </span>
            <span><FaComment /> 0</span>
            {post.views !== undefined && (
              <span style={{marginLeft: 'auto', color: '#aaa', fontSize: '0.95rem'}}>{post.views} views</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserPost;