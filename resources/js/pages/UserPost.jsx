import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHeart, FaComment } from 'react-icons/fa';
import { FaPencil, FaTrash } from 'react-icons/fa6';
import Navbar from '../components/NavBar';
import { useAuth } from '../authContext';
import './styles/userpost.css';

function getPostImageUrl(image) {
  if (!image) return null; // No fallback to external images
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  return `/storage/${image}`;
}

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
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
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

  // Image viewer state
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [viewerImageSrc, setViewerImageSrc] = useState('');
  const [viewerImageAlt, setViewerImageAlt] = useState('');

  const canEdit = user && post && (user.id === post.user_id || user.role === 'admin');
  const navigate = useNavigate();

  // Image viewer functions
  const openImageViewer = (src, alt = 'Image') => {
    setViewerImageSrc(src);
    setViewerImageAlt(alt);
    setImageViewerOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeImageViewer = () => {
    setImageViewerOpen(false);
    setViewerImageSrc('');
    setViewerImageAlt('');
    document.body.style.overflow = 'unset';
  };

  // Close viewer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && imageViewerOpen) {
        closeImageViewer();
      }
    };

    if (imageViewerOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [imageViewerOpen]);

  const startEdit = () => {
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditImage(null);
    setEditImagePreview(null);
    setEditError('');
    setEditing(true);
  };

  // Image upload handlers
  const handleImageChange = (file) => {
    if (!file) {
      setEditImage(null);
      setEditImagePreview(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setEditError('Only image files are allowed.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      setEditError('Image size must be less than 50MB.');
      return;
    }

    setEditError('');
    setEditImage(file);
    setEditImagePreview(URL.createObjectURL(file));
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleImageChange(files[0]);
    }
  };

  const removeEditImage = () => {
    setEditImage(null);
    setEditImagePreview(null);
    if (editImagePreview) {
      URL.revokeObjectURL(editImagePreview);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditError('');
    if (editImagePreview) {
      URL.revokeObjectURL(editImagePreview);
    }
    setEditImage(null);
    setEditImagePreview(null);
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
      <div className="blog-container" key={post?.id}>
        <div className="img-cont">
          {post.image && getPostImageUrl(post.image) && (
          <img
              src={getPostImageUrl(post.image)}
            alt="Post cover"
            className="blog-image"
            style={{ cursor: 'pointer' }}
            onClick={() => openImageViewer(getPostImageUrl(post.image), post.title)}
            onError={e => {
              e.target.style.display = 'none'; // Hide broken images instead of showing fallback
            }}
          />
          )}
        </div>

        <div className="blog-content">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
            <h1 className="post-title">{editing ? 'Edit Post' : post.title}</h1>
            {canEdit && !editing && (
              <div style={{display:'flex',gap:8}}>
                {/* Will change these to icons instead */}
                <button className="edit-btn" onClick={startEdit}><FaPencil /></button>
                <button className="delete-btn" onClick={handleDelete}><FaTrash /></button>
              </div>
            )}
          </div>

          <div className="author-section">
            <img
              src={post.user?.avatar || 'https://i.pravatar.cc/300'}
              alt="Author"
              className="author-img"
            />
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <span className="author-name">{post.user?.name || post.user?.email || 'Unknown'}</span>
              <span className="post-date">Posted at {new Date(post.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <hr />

          {editing ? (
            <div className="edit-container">
              <input className="edit-title" type="text" value={editTitle} onChange={e=>setEditTitle(e.target.value)} required/>

              <textarea className="edit-content" value={editContent} onChange={e=>setEditContent(e.target.value)} required rows={6} />

              {/* Image Upload Section */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                  Post Image
                </label>

                {/* Current Image Display */}
                {post.image && !editImagePreview && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.5rem' }}>Current image:</div>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <img
                        src={getPostImageUrl(post.image)}
                        alt="Current post image"
                        style={{
                          maxWidth: '200px',
                          maxHeight: '150px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                          border: '2px solid #e5e7eb'
                        }}
                      />
                      <div style={{
                        fontSize: '0.8rem',
                        color: '#6b7280',
                        marginTop: '0.25rem',
                        textAlign: 'center'
                      }}>
                        Upload a new image to replace this one
                      </div>
                    </div>
                  </div>
                )}

                {/* Drag and Drop Area */}
                <div
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  style={{
                    border: dragActive ? '3px dashed #3b82f6' : '2px dashed #d1d5db',
                    borderRadius: '12px',
                    padding: '2rem',
                    textAlign: 'center',
                    backgroundColor: dragActive ? '#eff6ff' : '#f9fafb',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onClick={() => document.getElementById('edit-file-input').click()}
                >
                  <input
                    id="edit-file-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e.target.files[0])}
                    style={{ display: 'none' }}
                  />

                  {editImagePreview ? (
                    <div>
                      <img
                        src={editImagePreview}
                        alt="Preview"
                        style={{
                          maxWidth: '200px',
                          maxHeight: '150px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                          marginBottom: '1rem'
                        }}
                      />
                      <div style={{ fontSize: '0.9rem', color: '#374151', marginBottom: '0.5rem' }}>
                        New image selected
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeEditImage();
                        }}
                        style={{
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.5rem 1rem',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          marginTop: '0.5rem'
                        }}
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem', color: dragActive ? '#3b82f6' : '#9ca3af' }}>
                        📸
                      </div>
                      <div style={{
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        color: dragActive ? '#1d4ed8' : '#374151',
                        marginBottom: '0.5rem'
                      }}>
                        {dragActive ? 'Drop your image here!' : 'Upload a new image'}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        Drag and drop an image here, or click to browse
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                        Supports: JPG, PNG, GIF (Max: 50MB)
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {editError && <div className="user-error-message">{editError}</div>}

              <div className="edit-btns">
                <button className="save-btn" type="button" onClick={handleEditSave} disabled={editLoading}>{editLoading ? 'Saving...' : 'Save'}</button>
                <button className="cancel-btn" type="button" onClick={cancelEdit}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="post-body">{post.content}</div>
          )}

          <div className="engagement-footer">
            <span className="likes" style={{cursor: user ? 'pointer' : 'not-allowed', color: likeStatus.liked ? '#e11d48' : '#666', transition:'color 0.2s'}} onClick={handleLike} title={user ? (likeStatus.liked ? 'Unlike' : 'Like') : 'Login to like'}>
              <FaHeart className="like-icon" style={{fill: likeStatus.liked ? '#e11d48' : 'none', transition:'fill 0.2s'}} /> {likeStatus.like_count}
            </span>

            <span className="comments">
              <FaComment className='comment-icon' style={{marginRight:4}}/> {commentsTotal}</span>
            {post.views !== undefined && (
              <span style={{marginLeft: 'auto', color: '#aaa', fontSize: '0.95rem'}}>{post.views} views</span>
            )}
          </div>
          <hr />
        </div>

          {/* Comments Section */}

        <div className="comments-container">
          <h3 className="comments-header">Comments ({commentsTotal})</h3>
          {commentError && <div className="user-error-message">{commentError}</div>}

          {user ? (
            <form className="comment-form" onSubmit={handleCommentSubmit}>
              <input
                type="text"
                value={commentContent}
                onChange={e => setCommentContent(e.target.value)}
                placeholder="Write a comment..."
                required
                disabled={commentLoading}
                className='comment-field'
              />
              <button className="submit-comment" type="submit" disabled={commentLoading || !commentContent.trim()}>
                {commentLoading ? 'Posting...' : 'Post'}
              </button>
            </form>
          ) : (
            <div style={{marginBottom:24,color:'#888'}}>Log in to comment.</div>
          )}

          <div className='comment-section'>
            {comments.length === 0 && <div style={{color:'#aaa'}}>No comments yet.</div>}

            {comments.map((comment) => (
              <div className="comment-content" key={comment.id}>
                <img
                  className='comment-avatar'
                  src={comment.user?.avatar || 'https://i.pravatar.cc/100'}
                  alt="User"
                />
                <div style={{flex:1}}>
                  <div className="comment-top">
                    <div className='comment-details'>
                      <span className='comment-name'>{comment.user?.name || comment.user?.email || 'Anonymous'}</span>
                      <span className='comment-date'>At {new Date(comment.created_at).toLocaleString()}</span>
                    </div>

                    {(user && (user.id === comment.user_id || user.role === 'admin')) && editingCommentId !== comment.id && (
                      <div className='comment-actions'>
                        <button onClick={() => handleEditComment(comment)} className='edit-btn'><FaPencil /></button>
                        <button onClick={() => handleDeleteComment(comment.id)} className='delete-btn'><FaTrash /></button>
                      </div>
                  )}
                  </div>
                  {editingCommentId === comment.id ? (
                    <form onSubmit={e => handleEditCommentSubmit(e, comment.id)} style={{display:'flex',gap:8,margin:'6px 0'}}>
                      <input
                        className='edit-comment'
                        type="text"
                        value={editingCommentContent}
                        onChange={e => setEditingCommentContent(e.target.value)}
                        required
                        disabled={commentLoading}
                      />
                      <button className='save-btn' type="submit" disabled={commentLoading || !editingCommentContent.trim()}>Save</button>
                      <button className='cancel-btn' type="button" onClick={() => {setEditingCommentId(null);setEditingCommentContent('');}}>Cancel</button>
                    </form>
                  ) : (
                    <div style={{fontSize:'0.97rem',color:'#333',margin:'2px 0 4px 0'}}>{comment.content}</div>
                  )}

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

      {/* Image Viewer Modal */}
      {imageViewerOpen && (
        <div
          className="image-viewer-overlay"
          onClick={closeImageViewer}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            cursor: 'pointer',
            overflow: 'hidden',
            boxSizing: 'border-box'
          }}
        >
          <div
            className="image-viewer-container"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '75vw',
              maxHeight: '75vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'default'
            }}
          >
            <img
              src={viewerImageSrc}
              alt={viewerImageAlt}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                display: 'block',
                cursor: 'default'
              }}
              onClick={(e) => e.stopPropagation()}
            />

            {/* Close button - positioned consistently in top-right */}
            <button
              onClick={closeImageViewer}
              style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                transition: 'all 0.2s ease',
                zIndex: 1001
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                e.target.style.transform = 'scale(1.1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                e.target.style.transform = 'scale(1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
            >
              ×
            </button>

            {/* Image title/caption */}
            {viewerImageAlt && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '-50px',
                  left: '0',
                  right: '0',
                  textAlign: 'center',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '500',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.7)',
                  padding: '10px'
                }}
              >
                {viewerImageAlt}
              </div>
            )}

            {/* Instructions */}
            <div
              style={{
                position: 'absolute',
                top: '-50px',
                left: '0',
                right: '0',
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.7)'
              }}
            >
              Click outside to close • Press ESC to close
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserPost;
