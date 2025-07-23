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
  const [comments, setComments] = useState([]);
  const [commentsPage, setCommentsPage] = useState(1);
  const [commentsLastPage, setCommentsLastPage] = useState(1);
  const [commentsTotal, setCommentsTotal] = useState(0);
  const [commentsLoadingMore, setCommentsLoadingMore] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [commentError, setCommentError] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');

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

  // Fetch comments (paginated)
  useEffect(() => {
    const fetchComments = async (page = 1, append = false) => {
      try {
        const response = await fetch(`/api/posts/${id}/comments?page=${page}&per_page=10`);
        if (!response.ok) throw new Error('Failed to fetch comments');
        const data = await response.json();
        if (append) {
          setComments((prev) => [...prev, ...data.data]);
        } else {
          setComments(data.data);
        }
        setCommentsPage(data.current_page);
        setCommentsLastPage(data.last_page);
        setCommentsTotal(data.total);
      } catch {
        if (!append) setComments([]);
      }
    };
    fetchComments(1, false);
  }, [id]);

  // Load more comments
  const loadMoreComments = async () => {
    if (commentsPage >= commentsLastPage) return;
    setCommentsLoadingMore(true);
    try {
      const nextPage = commentsPage + 1;
      const response = await fetch(`/api/posts/${id}/comments?page=${nextPage}&per_page=10`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      setComments((prev) => [...prev, ...data.data]);
      setCommentsPage(data.current_page);
      setCommentsLastPage(data.last_page);
      setCommentsTotal(data.total);
    } catch {}
    setCommentsLoadingMore(false);
  };

  // Infinite scroll for comments
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
        !commentsLoadingMore &&
        commentsPage < commentsLastPage
      ) {
        loadMoreComments();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [commentsLoadingMore, commentsPage, commentsLastPage]);

  // Submit comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError('');
    setCommentLoading(true);
    try {
      const xsrfToken = (() => {
        const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        return match ? decodeURIComponent(match[1]) : '';
      })();
      const response = await fetch(`/api/posts/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-XSRF-TOKEN': xsrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ content: commentContent }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setCommentError(data.error || data.message || 'Failed to submit comment');
      } else {
        setComments((prev) => [...prev, data.comment]);
        setCommentContent('');
      }
    } catch {
      setCommentError('Error submitting comment');
    }
    setCommentLoading(false);
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    setCommentError('');
    try {
      const xsrfToken = (() => {
        const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        return match ? decodeURIComponent(match[1]) : '';
      })();
      const response = await fetch(`/api/posts/${id}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-XSRF-TOKEN': xsrfToken,
        },
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setCommentError(data.error || data.message || 'Failed to delete comment');
      } else {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      }
    } catch {
      setCommentError('Error deleting comment');
    }
  };

  // Edit comment
  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentContent(comment.content);
  };

  const handleEditCommentSubmit = async (e, commentId) => {
    e.preventDefault();
    setCommentError('');
    setCommentLoading(true);
    try {
      const xsrfToken = (() => {
        const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        return match ? decodeURIComponent(match[1]) : '';
      })();
      const response = await fetch(`/api/posts/${id}/comments/${commentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-XSRF-TOKEN': xsrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ content: editingCommentContent }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setCommentError(data.error || data.message || 'Failed to update comment');
      } else {
        setComments((prev) => prev.map((c) => c.id === commentId ? data.comment : c));
        setEditingCommentId(null);
        setEditingCommentContent('');
      }
    } catch {
      setCommentError('Error updating comment');
    }
    setCommentLoading(false);
  };

  if (loading) return <div className="user-loading">Loading post...</div>;
  if (error) return <div className="user-error-message">{error}</div>;
  if (!post) return null;

  return (
    <>
      <Navbar />
      <div className="blog-container" key={post?.id} style={{maxWidth: '700px', margin: '2rem auto', background: 'white', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 0, overflow: 'hidden'}}>
        <img
          src={post.image ? `/storage/${post.image}` : 'https://picsum.photos/1000/400?random=1'}
          alt="Post cover"
          className="blog-image"
          style={{width: '100%', maxHeight: 300, objectFit: 'cover', borderTopLeftRadius: 16, borderTopRightRadius: 16, marginBottom: 0}}
          onError={e => { e.target.onerror = null; e.target.src = 'https://picsum.photos/1000/400?random=1'; }}
        />
        <div className="blog-content" style={{padding: '2rem 2.5rem 1.5rem 2.5rem'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
            <h1 className="post-title" style={{fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0'}}>{editing ? 'Edit Post' : post.title}</h1>
            {canEdit && !editing && (
              <div style={{display:'flex',gap:8}}>
                <button onClick={startEdit} style={{background:'#f3f4f6',color:'#222',border:'none',borderRadius:6,padding:'8px 18px',fontWeight:500,cursor:'pointer',transition:'background 0.2s',boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>Edit</button>
                <button onClick={handleDelete} style={{background:'#fee2e2',color:'#dc2626',border:'none',borderRadius:6,padding:'8px 18px',fontWeight:500,cursor:'pointer',transition:'background 0.2s',boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>Delete</button>
              </div>
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
          <div className="engagement-footer" style={{marginTop: '1.5rem', borderTop: '1px solid #eee', paddingTop: '1rem', display: 'flex', gap: '2rem', fontSize: '0.95rem', color: '#666', alignItems:'center'}}>
            <span style={{cursor: user ? 'pointer' : 'not-allowed', color: likeStatus.liked ? '#e11d48' : '#666', display: 'flex', alignItems: 'center', transition:'color 0.2s'}} onClick={handleLike} title={user ? (likeStatus.liked ? 'Unlike' : 'Like') : 'Login to like'}>
              <FaHeart style={{marginRight: 4, fill: likeStatus.liked ? '#e11d48' : 'none', stroke: '#e11d48', strokeWidth: 30, transition:'fill 0.2s'}} /> {likeStatus.like_count}
            </span>
            <span style={{display:'flex',alignItems:'center'}}><FaComment style={{marginRight:4}}/> {commentsTotal}</span>
            {post.views !== undefined && (
              <span style={{marginLeft: 'auto', color: '#aaa', fontSize: '0.95rem'}}>{post.views} views</span>
            )}
          </div>
          {/* Comments Section */}
          <hr style={{margin: '2rem 0 1.5rem 0'}} />
          <h3 style={{fontSize:'1.2rem',fontWeight:600,marginBottom:12}}>Comments ({commentsTotal})</h3>
          {commentError && <div className="user-error-message">{commentError}</div>}
          {user ? (
            <form onSubmit={handleCommentSubmit} style={{marginBottom:24,display:'flex',gap:8}}>
              <input
                type="text"
                value={commentContent}
                onChange={e => setCommentContent(e.target.value)}
                placeholder="Write a comment..."
                required
                disabled={commentLoading}
                style={{flex:1,padding:'8px',borderRadius:6,border:'1px solid #ccc'}}
              />
              <button type="submit" disabled={commentLoading || !commentContent.trim()} style={{background:'#2563eb',color:'white',border:'none',borderRadius:6,padding:'8px 18px',fontWeight:500,cursor:'pointer'}}>
                {commentLoading ? 'Posting...' : 'Post'}
              </button>
            </form>
          ) : (
            <div style={{marginBottom:24,color:'#888'}}>Log in to comment.</div>
          )}
          <div>
            {comments.length === 0 && <div style={{color:'#aaa'}}>No comments yet.</div>}
            {comments.map((comment) => (
              <div key={comment.id} style={{marginBottom:18,padding:'10px 14px',background:'#f8fafc',borderRadius:8,display:'flex',alignItems:'flex-start',gap:12,boxShadow:'0 1px 4px rgba(0,0,0,0.03)'}}>
                <img
                  src={comment.user?.avatar || 'https://i.pravatar.cc/100'}
                  alt="User"
                  style={{width:32,height:32,borderRadius:'50%',objectFit:'cover',boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}
                />
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:'1rem',display:'flex',alignItems:'center',gap:8}}>
                    {comment.user?.name || comment.user?.email || 'Anonymous'}
                    {(user && (user.id === comment.user_id || user.role === 'admin')) && editingCommentId !== comment.id && (
                      <div style={{display:'flex',gap:4,marginLeft:8}}>
                        <button onClick={() => handleEditComment(comment)} style={{background:'none',color:'#2563eb',border:'none',fontWeight:600,cursor:'pointer',padding:0,transition:'color 0.2s'}}>Edit</button>
                        <button onClick={() => handleDeleteComment(comment.id)} style={{background:'none',color:'#e11d48',border:'none',fontWeight:600,cursor:'pointer',padding:0,transition:'color 0.2s'}}>Delete</button>
                      </div>
                    )}
                  </div>
                  {editingCommentId === comment.id ? (
                    <form onSubmit={e => handleEditCommentSubmit(e, comment.id)} style={{display:'flex',gap:8,margin:'6px 0'}}>
                      <input
                        type="text"
                        value={editingCommentContent}
                        onChange={e => setEditingCommentContent(e.target.value)}
                        required
                        style={{flex:1,padding:'6px',borderRadius:6,border:'1px solid #bbb'}}
                        disabled={commentLoading}
                      />
                      <button type="submit" disabled={commentLoading || !editingCommentContent.trim()} style={{background:'#22c55e',color:'white',border:'none',borderRadius:6,padding:'6px 14px',fontWeight:500,cursor:'pointer'}}>Save</button>
                      <button type="button" onClick={() => {setEditingCommentId(null);setEditingCommentContent('');}} style={{background:'#f3f4f6',color:'#222',border:'none',borderRadius:6,padding:'6px 14px',fontWeight:500,cursor:'pointer'}}>Cancel</button>
                    </form>
                  ) : (
                    <div style={{fontSize:'0.97rem',color:'#333',margin:'2px 0 4px 0'}}>{comment.content}</div>
                  )}
                  <div style={{fontSize:'0.92rem',color:'#888'}}>{new Date(comment.created_at).toLocaleString()}</div>
                </div>
              </div>
            ))}
            {commentsPage < commentsLastPage && (
              <button onClick={loadMoreComments} disabled={commentsLoadingMore} style={{margin:'16px auto',display:'block',background:'#f3f4f6',color:'#222',border:'none',borderRadius:6,padding:'10px 24px',fontWeight:500,cursor:'pointer',boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
                {commentsLoadingMore ? 'Loading...' : 'Load more comments'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserPost;