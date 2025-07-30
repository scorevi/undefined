import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FBLayout from '../components/FBLayout';
import {
  FaNewspaper,
  FaSearch,
  FaFilter,
  FaEye,
  FaHeart,
  FaComment,
  FaCalendar,
  FaUser,
  FaTags,
  FaClock,
  FaArrowRight
} from 'react-icons/fa';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [sortBy, setSortBy] = useState('newest');

  function getPostImageUrl(image) {
    if (!image) return `https://picsum.photos/400/200?random=${Math.floor(Math.random() * 1000)}`;
    if (image.startsWith('http://') || image.startsWith('https://')) return image;
    return `/storage/${image}`;
  }

  // Get CSRF token helper
  const getCSRFToken = () => {
    try {
      return decodeURIComponent(document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='))?.split('=')[1] || '');
    } catch (e) {
      return '';
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const csrfToken = getCSRFToken();
        const response = await fetch('/api/posts?per_page=20', {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'X-XSRF-TOKEN': csrfToken,
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        const postsData = Array.isArray(data.data) ? data.data : [];
        setPosts(postsData);
        setFilteredPosts(postsData);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    let filtered = posts;

    // Filter by search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(post =>
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort posts
    switch (sortBy) {
      case 'newest':
        filtered = [...filtered].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'oldest':
        filtered = [...filtered].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'popular':
        filtered = [...filtered].sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'liked':
        filtered = [...filtered].sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
        break;
      default:
        break;
    }

    setFilteredPosts(filtered);
  }, [searchTerm, posts, sortBy]);

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
    controlsBar: {
      display: 'flex',
      gap: '16px',
      alignItems: 'center',
      flexWrap: 'wrap',
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
    filterContainer: {
      position: 'relative',
    },
    filterSelect: {
      padding: '12px 16px',
      border: '1px solid #e4e6ea',
      borderRadius: '8px',
      fontSize: '15px',
      backgroundColor: '#ffffff',
      cursor: 'pointer',
      outline: 'none',
      appearance: 'none',
      paddingRight: '40px',
      minWidth: '140px',
    },
    filterIcon: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#65676b',
      fontSize: '14px',
      pointerEvents: 'none',
    },
    postsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
      gap: '24px',
    },
    postCard: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid #e4e6ea',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    postImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
    },
    postContent: {
      padding: '20px',
    },
    postTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1c1e21',
      margin: '0 0 12px 0',
      textDecoration: 'none',
      display: 'block',
      lineHeight: '1.3',
    },
    postExcerpt: {
      fontSize: '15px',
      color: '#65676b',
      lineHeight: '1.4',
      margin: '0 0 16px 0',
    },
    postMeta: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px',
      paddingTop: '12px',
      borderTop: '1px solid #f0f2f5',
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
    postDate: {
      fontSize: '13px',
      color: '#65676b',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    postStats: {
      display: 'flex',
      gap: '16px',
      fontSize: '14px',
      color: '#65676b',
    },
    statItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    readMoreBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#1877f2',
      textDecoration: 'none',
      fontSize: '15px',
      fontWeight: '600',
      transition: 'color 0.2s',
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
    resultsCount: {
      fontSize: '14px',
      color: '#65676b',
      marginBottom: '16px',
    },
  };

  if (loading) {
    return (
      <FBLayout>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <div style={fbStyles.container}>
          <div style={fbStyles.loadingContainer}>
            <div style={fbStyles.spinner}></div>
            <p style={{ color: '#65676b', fontSize: '16px' }}>Loading blog posts...</p>
          </div>
        </div>
      </FBLayout>
    );
  }

  return (
    <FBLayout>
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
            Blog Posts
          </h1>
          <p style={fbStyles.subtitle}>
            Explore our collection of articles, stories, and insights from our community.
          </p>

          {/* Controls Bar */}
          <div style={fbStyles.controlsBar}>
            <div style={fbStyles.searchContainer}>
              <FaSearch style={fbStyles.searchIcon} />
              <input
                type="text"
                placeholder="Search posts, authors, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={fbStyles.searchInput}
                onFocus={(e) => e.target.style.borderColor = '#1877f2'}
                onBlur={(e) => e.target.style.borderColor = '#e4e6ea'}
              />
            </div>

            <div style={fbStyles.filterContainer}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={fbStyles.filterSelect}
                onFocus={(e) => e.target.style.borderColor = '#1877f2'}
                onBlur={(e) => e.target.style.borderColor = '#e4e6ea'}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Viewed</option>
                <option value="liked">Most Liked</option>
              </select>
              <FaFilter style={fbStyles.filterIcon} />
            </div>
          </div>
        </div>

        {/* Results Count */}
        {searchTerm && (
          <div style={fbStyles.resultsCount}>
            {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''} found for "{searchTerm}"
          </div>
        )}

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div style={fbStyles.emptyState}>
            <FaNewspaper style={fbStyles.emptyStateIcon} />
            <h3 style={fbStyles.emptyStateTitle}>
              {searchTerm ? 'No posts found' : 'No posts yet'}
            </h3>
            <p style={fbStyles.emptyStateText}>
              {searchTerm
                ? 'Try adjusting your search terms or filters.'
                : 'Blog posts will appear here once they are published.'
              }
            </p>
          </div>
        ) : (
          <div style={fbStyles.postsGrid}>
            {filteredPosts.map(post => (
              <article
                key={post.id}
                style={fbStyles.postCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Post Image */}
                <img
                  src={getPostImageUrl(post.image)}
                  alt={post.title}
                  style={fbStyles.postImage}
                  onError={(e) => {
                    e.target.src = `https://picsum.photos/400/200?random=${post.id}`;
                  }}
                />

                {/* Post Content */}
                <div style={fbStyles.postContent}>
                  {/* Category Badge */}
                  {post.category && (
                    <div style={{
                      marginBottom: '12px',
                      padding: '4px 12px',
                      backgroundColor: '#1877f2',
                      color: 'white',
                      borderRadius: '16px',
                      display: 'inline-block',
                      fontSize: '12px',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {post.category}
                    </div>
                  )}

                  <Link to={`/blog/post/${post.id}`} style={fbStyles.postTitle}>
                    {post.title}
                  </Link>

                  <p style={fbStyles.postExcerpt}>
                    {post.content?.substring(0, 150)}...
                  </p>

                  {/* Post Meta */}
                  <div style={fbStyles.postMeta}>
                    <div style={fbStyles.authorInfo}>
                      <img
                        src={post.user?.avatar || `https://i.pravatar.cc/32?u=${post.user?.id || post.id}`}
                        alt={post.user?.name || 'Author'}
                        style={fbStyles.authorAvatar}
                      />
                      <span style={fbStyles.authorName}>
                        {post.user?.name || 'Anonymous'}
                      </span>
                    </div>

                    <div style={fbStyles.postDate}>
                      <FaClock />
                      {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Unknown'}
                    </div>
                  </div>

                  {/* Post Stats */}
                  <div style={fbStyles.postStats}>
                    <span style={fbStyles.statItem}>
                      <FaEye style={{ color: '#1877f2' }} />
                      {post.views || 0}
                    </span>
                    <span style={fbStyles.statItem}>
                      <FaHeart style={{ color: '#e41e5f' }} />
                      {post.likes_count || 0}
                    </span>
                    <span style={fbStyles.statItem}>
                      <FaComment style={{ color: '#42b883' }} />
                      {post.comments_count || 0}
                    </span>
                  </div>

                  {/* Read More Button */}
                  <Link
                    to={`/blog/post/${post.id}`}
                    style={fbStyles.readMoreBtn}
                    onMouseEnter={(e) => e.target.style.color = '#166fe5'}
                    onMouseLeave={(e) => e.target.style.color = '#1877f2'}
                  >
                    Read Full Article
                    <FaArrowRight />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </FBLayout>
  );
};

export default Blog;
