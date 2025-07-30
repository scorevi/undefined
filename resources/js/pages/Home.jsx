import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FBLayout from '../components/FBLayout';
import {
  FaNewspaper,
  FaUsers,
  FaEye,
  FaHeart,
  FaComment,
  FaArrowRight,
  FaBookOpen,
  FaChartLine,
  FaStar,
  FaClock
} from 'react-icons/fa';

const Home = () => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalUsers: 0,
    totalViews: 0,
    totalComments: 0
  });
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Fetch featured posts
        const featuredResponse = await fetch('/api/posts/featured', {
          credentials: 'include',
        });
        if (featuredResponse.ok) {
          const featuredData = await featuredResponse.json();
          setFeaturedPosts(featuredData.slice(0, 3) || []);
        }

        // Fetch recent posts
        const recentResponse = await fetch('/api/posts?per_page=4', {
          credentials: 'include',
        });
        if (recentResponse.ok) {
          const recentData = await recentResponse.json();
          setRecentPosts(recentData.data || []);
        }

        // Fetch stats
        const statsResponse = await fetch('/api/posts/stats', {
          credentials: 'include',
        });
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData || {});
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const fbStyles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    hero: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '40px',
      marginBottom: '24px',
      border: '1px solid #e4e6ea',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #1877f2 0%, #42a5f5 100%)',
      color: 'white',
    },
    heroTitle: {
      fontSize: '36px',
      fontWeight: '700',
      margin: '0 0 16px 0',
    },
    heroSubtitle: {
      fontSize: '18px',
      margin: '0 0 24px 0',
      opacity: 0.9,
    },
    heroButtons: {
      display: 'flex',
      gap: '16px',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    primaryButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 24px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '8px',
      textDecoration: 'none',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'all 0.2s',
      backdropFilter: 'blur(10px)',
    },
    secondaryButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 24px',
      backgroundColor: 'transparent',
      color: 'white',
      border: '2px solid rgba(255, 255, 255, 0.5)',
      borderRadius: '8px',
      textDecoration: 'none',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'all 0.2s',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '24px',
    },
    statCard: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      padding: '24px',
      border: '1px solid #e4e6ea',
      textAlign: 'center',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    statIcon: {
      fontSize: '32px',
      marginBottom: '12px',
    },
    statNumber: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1c1e21',
      margin: '0 0 4px 0',
    },
    statLabel: {
      fontSize: '14px',
      color: '#65676b',
      margin: '0',
    },
    sectionGrid: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '24px',
      marginBottom: '24px',
    },
    section: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      padding: '24px',
      border: '1px solid #e4e6ea',
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1c1e21',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    postCard: {
      display: 'flex',
      gap: '16px',
      padding: '16px 0',
      borderBottom: '1px solid #f0f2f5',
    },
    postImage: {
      width: '80px',
      height: '80px',
      borderRadius: '8px',
      objectFit: 'cover',
      flexShrink: 0,
    },
    postContent: {
      flex: 1,
    },
    postTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1c1e21',
      margin: '0 0 8px 0',
      textDecoration: 'none',
      display: 'block',
    },
    postMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '13px',
      color: '#65676b',
    },
    featuredPostCard: {
      marginBottom: '16px',
      padding: '16px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #e4e6ea',
    },
    featuredPostTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1c1e21',
      margin: '0 0 8px 0',
      textDecoration: 'none',
      display: 'block',
    },
    featuredPostExcerpt: {
      fontSize: '14px',
      color: '#65676b',
      margin: '0 0 8px 0',
      lineHeight: '1.4',
    },
    viewAllButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#1877f2',
      textDecoration: 'none',
      fontSize: '15px',
      fontWeight: '600',
      marginTop: '16px',
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
            <p style={{ color: '#65676b', fontSize: '16px' }}>Loading...</p>
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
        {/* Hero Section */}
        <div style={fbStyles.hero}>
          <h1 style={fbStyles.heroTitle}>Welcome to Our Blog</h1>
          <p style={fbStyles.heroSubtitle}>
            Discover amazing stories, insights, and ideas from our community of writers
          </p>
          <div style={fbStyles.heroButtons}>
            <Link
              to="/blog"
              style={fbStyles.primaryButton}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <FaNewspaper />
              Explore Blog
            </Link>
            <Link
              to="/users"
              style={fbStyles.secondaryButton}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <FaUsers />
              Meet Writers
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={fbStyles.statsGrid}>
          <div
            style={fbStyles.statCard}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px)';
              e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <FaNewspaper style={{ ...fbStyles.statIcon, color: '#1877f2' }} />
            <h3 style={fbStyles.statNumber}>{stats.posts || 0}</h3>
            <p style={fbStyles.statLabel}>Blog Posts</p>
          </div>

          <div
            style={fbStyles.statCard}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px)';
              e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <FaUsers style={{ ...fbStyles.statIcon, color: '#42b883' }} />
            <h3 style={fbStyles.statNumber}>{stats.users || 0}</h3>
            <p style={fbStyles.statLabel}>Active Writers</p>
          </div>

          <div
            style={fbStyles.statCard}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px)';
              e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <FaEye style={{ ...fbStyles.statIcon, color: '#fd7e14' }} />
            <h3 style={fbStyles.statNumber}>{stats.views > 1000 ? `${(stats.views/1000).toFixed(1)}k` : stats.views || 0}</h3>
            <p style={fbStyles.statLabel}>Total Views</p>
          </div>

          <div
            style={fbStyles.statCard}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px)';
              e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <FaComment style={{ ...fbStyles.statIcon, color: '#6f42c1' }} />
            <h3 style={fbStyles.statNumber}>{stats.comments || 0}</h3>
            <p style={fbStyles.statLabel}>Comments</p>
          </div>
        </div>

        {/* Content Grid */}
        <div style={fbStyles.sectionGrid}>
          {/* Recent Posts */}
          <div style={fbStyles.section}>
            <h2 style={fbStyles.sectionTitle}>
              <FaClock style={{ color: '#1877f2' }} />
              Latest Posts
            </h2>
            {recentPosts.map(post => (
              <div key={post.id} style={fbStyles.postCard}>
                <img
                  src={post.image ? `/storage/${post.image}` : 'https://picsum.photos/80/80?random=' + post.id}
                  alt={post.title}
                  style={fbStyles.postImage}
                  onError={(e) => {
                    e.target.src = 'https://picsum.photos/80/80?random=' + post.id;
                  }}
                />
                <div style={fbStyles.postContent}>
                  <Link to={`/blog/post/${post.id}`} style={fbStyles.postTitle}>
                    {post.title}
                  </Link>
                  <div style={fbStyles.postMeta}>
                    <span>By {post.user?.name || 'Anonymous'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FaEye /> {post.views || 0}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FaHeart /> {post.likes_count || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <Link to="/blog" style={fbStyles.viewAllButton}>
              View All Posts <FaArrowRight />
            </Link>
          </div>

          {/* Featured Posts */}
          <div style={fbStyles.section}>
            <h2 style={fbStyles.sectionTitle}>
              <FaStar style={{ color: '#fd7e14' }} />
              Featured
            </h2>
            {featuredPosts.map(post => (
              <div key={post.id} style={fbStyles.featuredPostCard}>
                <Link to={`/blog/post/${post.id}`} style={fbStyles.featuredPostTitle}>
                  {post.title}
                </Link>
                <p style={fbStyles.featuredPostExcerpt}>
                  {post.content?.substring(0, 120)}...
                </p>
                <div style={fbStyles.postMeta}>
                  <span>By {post.user?.name || 'Anonymous'}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FaChartLine /> Popular
                  </span>
                </div>
              </div>
            ))}
            <Link to="/blog" style={fbStyles.viewAllButton}>
              Explore More <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </FBLayout>
  );
};

export default Home;
