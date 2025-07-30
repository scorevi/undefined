import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaComment, FaEye, FaChevronRight } from 'react-icons/fa';

function getPostImageUrl(image) {
  if (!image) return 'https://picsum.photos/400/200?random=5';
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  return `/storage/${image}`;
}

const Posts = ({ refresh }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/posts?per_page=10', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPosts(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Could not load posts.');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [refresh]);

  // Simple inline styles for embedded component
  const styles = {
    container: {
      width: '100%',
      maxWidth: '100%',
    },
    postCard: {
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
    },
    postMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '16px',
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      objectFit: 'cover',
    },
    userInfo: {
      display: 'flex',
      flexDirection: 'column',
    },
    userName: {
      fontWeight: '600',
      fontSize: '14px',
      color: '#111827',
      margin: '0',
    },
    postDate: {
      fontSize: '12px',
      color: '#6b7280',
      margin: '0',
    },
    postContent: {
      marginBottom: '16px',
    },
    postTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#111827',
      marginBottom: '12px',
      textDecoration: 'none',
      lineHeight: '1.3',
    },
    postExcerpt: {
      color: '#6b7280',
      lineHeight: '1.5',
      margin: '0',
    },
    postImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
      borderRadius: '8px',
      marginBottom: '16px',
    },
    postStats: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: '16px',
      borderTop: '1px solid #f3f4f6',
    },
    statsLeft: {
      display: 'flex',
      gap: '16px',
    },
    stat: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      color: '#6b7280',
      fontSize: '14px',
    },
    readMore: {
      color: '#3b82f6',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    loadingState: {
      textAlign: 'center',
      padding: '40px',
      color: '#6b7280',
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '3px solid #e5e7eb',
      borderTop: '3px solid #3b82f6',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 16px',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingState}>
          <div style={styles.spinner}></div>
          <p>Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingState}>
          <p style={{ color: '#dc2626' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              marginTop: '8px',
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingState}>
          <h3>No posts yet</h3>
          <p>Be the first to share something!</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {posts.map((post) => (
        <article key={post.id} style={styles.postCard}>
          <div style={styles.postMeta}>
            <img
              src={post.user?.avatar || `https://i.pravatar.cc/40?u=${post.user?.id || post.id}`}
              alt={post.user?.name || 'User'}
              style={styles.avatar}
            />
            <div style={styles.userInfo}>
              <p style={styles.userName}>{post.user?.name || 'Anonymous'}</p>
              <p style={styles.postDate}>
                {post.created_at
                  ? new Date(post.created_at).toLocaleDateString()
                  : 'Unknown date'}
              </p>
            </div>
          </div>

          {post.image && (
            <img
              src={getPostImageUrl(post.image)}
              alt={post.title}
              style={styles.postImage}
              onError={(e) => {
                e.target.src = `https://picsum.photos/400/200?random=${post.id}`;
              }}
            />
          )}

          <div style={styles.postContent}>
            <Link to={`/blog/post/${post.id}`} style={styles.postTitle}>
              <h3 style={styles.postTitle}>{post.title}</h3>
            </Link>
            <p style={styles.postExcerpt}>
              {post.content?.substring(0, 150)}
              {post.content?.length > 150 ? '...' : ''}
            </p>
          </div>

          <div style={styles.postStats}>
            <div style={styles.statsLeft}>
              <span style={styles.stat}>
                <FaHeart /> {post.likes_count || 0}
              </span>
              <span style={styles.stat}>
                <FaComment /> {post.comments_count || 0}
              </span>
              <span style={styles.stat}>
                <FaEye /> {post.views || 0}
              </span>
            </div>
            <Link to={`/blog/post/${post.id}`} style={styles.readMore}>
              Read More <FaChevronRight />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
};

export default Posts;
