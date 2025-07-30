import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import FBLayout from '../components/FBLayout';
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaHeart,
  FaUser,
  FaCalendar,
  FaArrowLeft,
  FaNewspaper,
  FaSearch,
  FaPlus
} from 'react-icons/fa';

const AdminEditPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch('/api/posts?per_page=50')
      .then(res => res.json())
      .then(data => {
        const postsData = Array.isArray(data.data) ? data.data : [];
        setPosts(postsData);
        setFilteredPosts(postsData);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load posts');
        setLoading(false);
      });
  }, [refresh]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post =>
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [searchTerm, posts]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: { 'X-CSRF-TOKEN': csrfToken },
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
      setRefresh(r => r + 1);
    } catch {
      alert('Failed to delete post.');
    }
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
    newPostButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 20px',
      backgroundColor: '#1877f2',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600',
      textDecoration: 'none',
      transition: 'background-color 0.2s',
    },
    tableContainer: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      border: '1px solid #e4e6ea',
      overflow: 'hidden',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    tableHeader: {
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #e4e6ea',
    },
    th: {
      padding: '16px 12px',
      textAlign: 'left',
      fontSize: '14px',
      fontWeight: '600',
      color: '#1c1e21',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    tbody: {
      backgroundColor: '#ffffff',
    },
    tr: {
      borderBottom: '1px solid #f0f2f5',
      transition: 'background-color 0.2s',
    },
    td: {
      padding: '16px 12px',
      fontSize: '15px',
      color: '#1c1e21',
      verticalAlign: 'middle',
    },
    postTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1c1e21',
      margin: '0',
      maxWidth: '300px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    authorInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    authorAvatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      objectFit: 'cover',
    },
    authorName: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#1c1e21',
    },
    dateText: {
      fontSize: '14px',
      color: '#65676b',
    },
    statBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '14px',
      color: '#65676b',
    },
    actionButtons: {
      display: 'flex',
      gap: '8px',
    },
    editButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 12px',
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
      padding: '8px 12px',
      backgroundColor: '#e41e5f',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '500',
      transition: 'background-color 0.2s',
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
            <p style={{ color: '#65676b', fontSize: '16px' }}>Loading posts...</p>
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
            <FaNewspaper style={{ color: '#1877f2' }} />
            Manage Posts
          </h1>
          <p style={fbStyles.subtitle}>
            Edit, delete, and manage all blog posts from this central dashboard.
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
                placeholder="Search posts by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={fbStyles.searchInput}
                onFocus={(e) => e.target.style.borderColor = '#1877f2'}
                onBlur={(e) => e.target.style.borderColor = '#e4e6ea'}
              />
            </div>

            <button
              style={fbStyles.newPostButton}
              onClick={() => navigate('/admin/posts/new')}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#166fe5'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#1877f2'}
            >
              <FaPlus />
              New Post
            </button>
          </div>
        </div>

        {/* Posts Table */}
        {filteredPosts.length === 0 ? (
          <div style={fbStyles.tableContainer}>
            <div style={fbStyles.emptyState}>
              <FaNewspaper style={fbStyles.emptyStateIcon} />
              <h3 style={fbStyles.emptyStateTitle}>
                {searchTerm ? 'No posts found' : 'No posts yet'}
              </h3>
              <p style={fbStyles.emptyStateText}>
                {searchTerm
                  ? 'Try adjusting your search terms.'
                  : 'Create your first blog post to get started.'
                }
              </p>
            </div>
          </div>
        ) : (
          <div style={fbStyles.tableContainer}>
            <table style={fbStyles.table}>
              <thead style={fbStyles.tableHeader}>
                <tr>
                  <th style={fbStyles.th}>Post</th>
                  <th style={fbStyles.th}>Author</th>
                  <th style={fbStyles.th}>Date</th>
                  <th style={fbStyles.th}>Stats</th>
                  <th style={fbStyles.th}>Actions</th>
                </tr>
              </thead>
              <tbody style={fbStyles.tbody}>
                {filteredPosts.map(post => (
                  <tr
                    key={post.id}
                    style={fbStyles.tr}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
                  >
                    <td style={fbStyles.td}>
                      <h4 style={fbStyles.postTitle} title={post.title}>
                        {post.title}
                      </h4>
                    </td>
                    <td style={fbStyles.td}>
                      <div style={fbStyles.authorInfo}>
                        <img
                          src={post.user?.avatar || `https://i.pravatar.cc/32?u=${post.user?.id || 1}`}
                          alt={post.user?.name || 'User'}
                          style={fbStyles.authorAvatar}
                        />
                        <span style={fbStyles.authorName}>
                          {post.user?.name || post.user?.email || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td style={fbStyles.td}>
                      <div style={fbStyles.dateText}>
                        <FaCalendar style={{ marginRight: '6px', fontSize: '12px' }} />
                        {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td style={fbStyles.td}>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <span style={fbStyles.statBadge}>
                          <FaHeart style={{ color: '#e41e5f' }} />
                          {post.likes_count ?? 0}
                        </span>
                        <span style={fbStyles.statBadge}>
                          <FaEye style={{ color: '#1877f2' }} />
                          {post.views ?? 0}
                        </span>
                      </div>
                    </td>
                    <td style={fbStyles.td}>
                      <div style={fbStyles.actionButtons}>
                        <button
                          onClick={() => navigate(`/admin/posts/${post.id}/edit`)}
                          style={fbStyles.editButton}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#166fe5'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#1877f2'}
                        >
                          <FaEdit />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          style={fbStyles.deleteButton}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#c21858'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#e41e5f'}
                        >
                          <FaTrash />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </FBLayout>
  );
};

export default AdminEditPosts;
