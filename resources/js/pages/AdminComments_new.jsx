import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FBLayout from '../components/FBLayout';
import {
  FaComments,
  FaEdit,
  FaTrash,
  FaUser,
  FaNewspaper,
  FaCalendar,
  FaArrowLeft,
  FaSearch,
  FaQuoteLeft,
  FaClock
} from 'react-icons/fa';

const AdminComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredComments, setFilteredComments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch('/api/comments?per_page=50')
      .then(res => res.json())
      .then(data => {
        const commentsData = Array.isArray(data.data) ? data.data : [];
        setComments(commentsData);
        setFilteredComments(commentsData);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load comments');
        setLoading(false);
      });
  }, [refresh]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredComments(comments);
    } else {
      const filtered = comments.filter(comment =>
        comment.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.post?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredComments(filtered);
    }
  }, [searchTerm, comments]);

  const handleDelete = async (comment) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const res = await fetch(`/api/posts/${comment.post_id}/comments/${comment.id}`, {
        method: 'DELETE',
        headers: { 'X-CSRF-TOKEN': csrfToken },
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
      setRefresh(r => r + 1);
    } catch {
      alert('Failed to delete comment.');
    }
  };

  const handleEdit = (comment) => {
    const newContent = prompt('Edit comment:', comment.content);
    if (newContent === null || newContent.trim() === '' || newContent === comment.content) return;
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    fetch(`/api/posts/${comment.post_id}/comments/${comment.id}`, {
      method: 'PATCH',
      headers: {
        'X-CSRF-TOKEN': csrfToken,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ content: newContent }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setRefresh(r => r + 1);
        else alert(data.error || 'Failed to update comment.');
      })
      .catch(() => alert('Failed to update comment.'));
  };

  const fbStyles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    header: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '20px',
      border: '1px solid #e4e6ea',
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1c1e21',
      margin: '0 0 8px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    subtitle: {
      fontSize: '16px',
      color: '#65676b',
      margin: '0 0 20px 0',
    },
    actionBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      gap: '16px',
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 16px',
      backgroundColor: '#e4e6ea',
      color: '#1c1e21',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600',
      textDecoration: 'none',
      transition: 'background-color 0.2s',
    },
    searchContainer: {
      position: 'relative',
      flex: '1',
      maxWidth: '400px',
    },
    searchInput: {
      width: '100%',
      padding: '12px 16px 12px 40px',
      border: '1px solid #e4e6ea',
      borderRadius: '8px',
      fontSize: '15px',
      outline: 'none',
      transition: 'border-color 0.2s',
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#65676b',
      fontSize: '16px',
    },
    commentsGrid: {
      display: 'grid',
      gap: '16px',
    },
    commentCard: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      border: '1px solid #e4e6ea',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s',
    },
    commentHeader: {
      padding: '16px',
      borderBottom: '1px solid #f0f2f5',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    commentMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flex: '1',
    },
    userAvatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      objectFit: 'cover',
    },
    userInfo: {
      flex: '1',
    },
    userName: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#1c1e21',
      margin: '0',
    },
    commentDate: {
      fontSize: '13px',
      color: '#65676b',
      margin: '2px 0 0 0',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    postReference: {
      fontSize: '13px',
      color: '#1877f2',
      margin: '4px 0 0 0',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      cursor: 'pointer',
    },
    commentActions: {
      display: 'flex',
      gap: '8px',
    },
    editButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      backgroundColor: '#1877f2',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '500',
      transition: 'background-color 0.2s',
    },
    deleteButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      backgroundColor: '#e41e5f',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '500',
      transition: 'background-color 0.2s',
    },
    commentContent: {
      padding: '16px',
    },
    commentText: {
      fontSize: '15px',
      color: '#1c1e21',
      lineHeight: '1.4',
      margin: '0',
      position: 'relative',
      paddingLeft: '24px',
    },
    quoteIcon: {
      position: 'absolute',
      left: '0',
      top: '0',
      color: '#65676b',
      fontSize: '16px',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
      flexDirection: 'column',
      gap: '16px',
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '3px solid #e4e6ea',
      borderTop: '3px solid #1877f2',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    errorMessage: {
      backgroundColor: '#ffebee',
      color: '#c62828',
      padding: '16px',
      borderRadius: '8px',
      textAlign: 'center',
      fontSize: '15px',
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: '#65676b',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      border: '1px solid #e4e6ea',
    },
    emptyStateIcon: {
      fontSize: '48px',
      color: '#e4e6ea',
      marginBottom: '16px',
    },
    emptyStateTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1c1e21',
      marginBottom: '8px',
    },
    emptyStateText: {
      fontSize: '15px',
      color: '#65676b',
    },
  };

  if (loading) {
    return (
      <FBLayout showAdminActions={true}>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <div style={fbStyles.container}>
          <div style={fbStyles.loadingContainer}>
            <div style={fbStyles.spinner}></div>
            <p style={{ color: '#65676b', fontSize: '16px' }}>Loading comments...</p>
          </div>
        </div>
      </FBLayout>
    );
  }

  if (error) {
    return (
      <FBLayout showAdminActions={true}>
        <div style={fbStyles.container}>
          <div style={fbStyles.errorMessage}>
            {error}
          </div>
        </div>
      </FBLayout>
    );
  }

  return (
    <FBLayout showAdminActions={true}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div style={fbStyles.container}>
        {/* Header */}
        <div style={fbStyles.header}>
          <h1 style={fbStyles.title}>
            <FaComments style={{ color: '#1877f2' }} />
            Manage Comments
          </h1>
          <p style={fbStyles.subtitle}>
            Monitor and moderate all user comments across your blog posts.
          </p>

          {/* Action Bar */}
          <div style={fbStyles.actionBar}>
            <button
              style={fbStyles.backButton}
              onClick={() => navigate('/admin')}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#d8dadf'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#e4e6ea'}
            >
              <FaArrowLeft />
              Back to Dashboard
            </button>

            <div style={fbStyles.searchContainer}>
              <FaSearch style={fbStyles.searchIcon} />
              <input
                type="text"
                placeholder="Search comments, posts, or users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={fbStyles.searchInput}
                onFocus={(e) => e.target.style.borderColor = '#1877f2'}
                onBlur={(e) => e.target.style.borderColor = '#e4e6ea'}
              />
            </div>
          </div>
        </div>

        {/* Comments Grid */}
        {filteredComments.length === 0 ? (
          <div style={fbStyles.emptyState}>
            <FaComments style={fbStyles.emptyStateIcon} />
            <h3 style={fbStyles.emptyStateTitle}>
              {searchTerm ? 'No comments found' : 'No comments yet'}
            </h3>
            <p style={fbStyles.emptyStateText}>
              {searchTerm
                ? 'Try adjusting your search terms.'
                : 'Comments will appear here once users start engaging with your posts.'
              }
            </p>
          </div>
        ) : (
          <div style={fbStyles.commentsGrid}>
            {filteredComments.map(comment => (
              <div
                key={comment.id}
                style={fbStyles.commentCard}
                onMouseEnter={(e) => e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'}
                onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
              >
                {/* Comment Header */}
                <div style={fbStyles.commentHeader}>
                  <div style={fbStyles.commentMeta}>
                    <img
                      src={comment.user?.avatar || `https://i.pravatar.cc/40?u=${comment.user?.id || comment.id}`}
                      alt={comment.user?.name || 'User'}
                      style={fbStyles.userAvatar}
                    />
                    <div style={fbStyles.userInfo}>
                      <h4 style={fbStyles.userName}>
                        {comment.user?.name || comment.user?.email || 'Anonymous User'}
                      </h4>
                      <p style={fbStyles.commentDate}>
                        <FaClock />
                        {comment.created_at ? new Date(comment.created_at).toLocaleDateString() : 'Unknown date'}
                      </p>
                      <p style={fbStyles.postReference}>
                        <FaNewspaper />
                        On: {comment.post?.title || `Post #${comment.post_id}`}
                      </p>
                    </div>
                  </div>

                  <div style={fbStyles.commentActions}>
                    <button
                      onClick={() => handleEdit(comment)}
                      style={fbStyles.editButton}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#166fe5'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#1877f2'}
                    >
                      <FaEdit />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(comment)}
                      style={fbStyles.deleteButton}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#c21858'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#e41e5f'}
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Comment Content */}
                <div style={fbStyles.commentContent}>
                  <p style={fbStyles.commentText}>
                    <FaQuoteLeft style={fbStyles.quoteIcon} />
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </FBLayout>
  );
};

export default AdminComments;
