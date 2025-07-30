import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useAuth } from '../authContext';
import { FaCamera, FaImage, FaHeart, FaComment, FaEye, FaShare, FaUser, FaTag, FaNewspaper } from 'react-icons/fa';
import FBLayout from '../components/FBLayout';

import 'swiper/css';
import 'swiper/css/navigation';

import './styles/main.css';
import Posts from '../components/Posts';

function getPostImageUrl(image) {
  if (!image) return 'https://picsum.photos/1000/400?random=1';
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  return `/storage/${image}`;
}

const Main = () => {
  document.title = "Blog Dashboard";
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState({ posts: 0, views: 0, likes: 0, comments: 0 });
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [refreshPosts, setRefreshPosts] = useState(0);

  // Helper function to get CSRF token
  const getCSRFToken = () => {
    // Try XSRF token first (for Laravel Sanctum)
    const xsrfToken = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='));
    if (xsrfToken) {
      return decodeURIComponent(xsrfToken.split('=')[1]);
    }

    // Fallback to meta tag
    const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    return metaToken || '';
  };

  useEffect(() => {
    // Initialize CSRF cookie first
    const initAndFetchData = async () => {
      try {
        // Initialize CSRF cookie
        await fetch('/sanctum/csrf-cookie', {
          method: 'GET',
          credentials: 'include',
        });

        // Then fetch data
        await fetchAllData();
      } catch (error) {
        console.error('Error initializing CSRF or fetching data:', error);
        // Try fetching data anyway
        fetchAllData();
      }
    };

    initAndFetchData();
  }, [refreshPosts]);

  const fetchAllData = async () => {
    try {
      const csrfToken = getCSRFToken();

      // Fetch featured posts
      const featuredResponse = await fetch('/api/posts/featured', {
        credentials: 'include',
        headers: {
          'X-XSRF-TOKEN': csrfToken,
          'Accept': 'application/json',
        }
      });
      if (featuredResponse.ok) {
        const featuredData = await featuredResponse.json();
        setFeaturedPosts(featuredData || []);
      }

      // Fetch stats
      const statsResponse = await fetch('/api/posts/stats', {
        credentials: 'include',
        headers: {
          'X-XSRF-TOKEN': csrfToken,
          'Accept': 'application/json',
        }
      });
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData || { posts: 0, views: 0, likes: 0, comments: 0 });
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setFeaturedPosts([]);
      setStats({ posts: 0, views: 0, likes: 0, comments: 0 });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setImage(null);
      setImagePreview(null);
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed.');
      setImage(null);
      setImagePreview(null);
      return;
    }
    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      setError('Image size must be less than 50MB.');
      setImage(null);
      setImagePreview(null);
      return;
    }
    setError('');
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    if (!content.trim()) {
      setError('Content cannot be empty.');
      setLoading(false);
      return;
    }
    if (image && !image.type.startsWith('image/')) {
      setError('Only image files are allowed.');
      setLoading(false);
      return;
    }
    if (image && image.size > 50 * 1024 * 1024) {
      setError('Image size must be less than 50MB.');
      setLoading(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', content.slice(0, 40) + (content.length > 40 ? '...' : ''));
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }

      const csrfToken = getCSRFToken();
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'X-XSRF-TOKEN': csrfToken,
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        let errorMessage = data.error || data.message || 'Failed to submit post';
        if (data.errors) {
          // If we have detailed validation errors, show the first one
          const firstError = Object.values(data.errors)[0];
          if (firstError) {
            errorMessage = firstError[0];
          }
        }
        setError(errorMessage);
      } else {
        setSuccess('Post submitted!');
        setContent('');
        setImage(null);
        setImagePreview(null);
        setRefreshPosts(r => r + 1); // trigger posts refresh
      }
    } catch (err) {
      setError('Error submitting post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fbStyles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
      gap: '20px',
      padding: '0 16px',
    },
    mainContent: {
      flex: '1',
      maxWidth: '590px',
    },
    sidebar: {
      width: '320px',
      position: 'sticky',
      top: '76px',
      height: 'fit-content',
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      border: '1px solid #e4e6ea',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    },
    postForm: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      padding: '12px 16px 10px',
      marginBottom: '16px',
      border: '1px solid #e4e6ea',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '12px',
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      marginRight: '12px',
      objectFit: 'cover',
    },
    userName: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#1c1e21',
      margin: '0',
    },
    textarea: {
      width: '100%',
      minHeight: '80px',
      border: 'none',
      outline: 'none',
      resize: 'none',
      fontSize: '16px',
      color: '#1c1e21',
      backgroundColor: 'transparent',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      lineHeight: '1.34',
      marginBottom: '8px',
    },
    imagePreview: {
      width: '100%',
      maxHeight: '300px',
      objectFit: 'cover',
      borderRadius: '8px',
      marginBottom: '12px',
      position: 'relative',
    },
    imagePreviewContainer: {
      position: 'relative',
      marginBottom: '12px',
    },
    removeImageBtn: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '30px',
      height: '30px',
      fontSize: '18px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    postActions: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: '8px',
      borderTop: '1px solid #e4e6ea',
    },
    imageUploadBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 12px',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '500',
      color: '#65676b',
      transition: 'background-color 0.2s',
    },
    submitBtn: {
      backgroundColor: '#1877f2',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '8px 20px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    featuredSection: {
      marginBottom: '16px',
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1c1e21',
      marginBottom: '16px',
      margin: '0 0 16px 0',
    },
    featuredPost: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid #e4e6ea',
    },
    featuredPostImage: {
      width: '100%',
      height: '300px',
      overflow: 'hidden',
    },
    featuredPostContent: {
      padding: '16px',
    },
    featuredPostTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1c1e21',
      marginBottom: '8px',
      margin: '0 0 8px 0',
    },
    featuredPostExcerpt: {
      fontSize: '15px',
      color: '#65676b',
      lineHeight: '1.33',
      marginBottom: '12px',
      margin: '0 0 12px 0',
    },
    featuredPostMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px',
    },
    postAuthor: {
      fontSize: '13px',
      color: '#65676b',
    },
    postStats: {
      display: 'flex',
      gap: '16px',
      fontSize: '13px',
      color: '#65676b',
    },
    readMoreBtn: {
      backgroundColor: '#1877f2',
      color: 'white',
      textDecoration: 'none',
      padding: '8px 16px',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '600',
      display: 'inline-block',
    },
    sidebarCard: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      border: '1px solid #e4e6ea',
    },
    sidebarTitle: {
      fontSize: '17px',
      fontWeight: '600',
      color: '#1c1e21',
      marginBottom: '12px',
      margin: '0 0 12px 0',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
    },
    statItem: {
      textAlign: 'center',
      padding: '12px',
      backgroundColor: '#f0f2f5',
      borderRadius: '8px',
    },
    statNumber: {
      display: 'block',
      fontSize: '20px',
      fontWeight: '700',
      color: '#1877f2',
      marginBottom: '4px',
    },
    statLabel: {
      fontSize: '13px',
      color: '#65676b',
    },
    categoryList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    categoryItem: {
      color: '#1877f2',
      textDecoration: 'none',
      fontSize: '15px',
      fontWeight: '500',
      padding: '8px 12px',
      borderRadius: '6px',
      transition: 'background-color 0.2s',
    },
    tagsCloud: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
    },
    tag: {
      backgroundColor: '#e4e6ea',
      color: '#1c1e21',
      padding: '6px 12px',
      borderRadius: '16px',
      fontSize: '13px',
      fontWeight: '500',
    },
    errorMessage: {
      backgroundColor: '#ffebee',
      color: '#c62828',
      padding: '12px',
      borderRadius: '6px',
      fontSize: '14px',
      marginTop: '8px',
    },
    successMessage: {
      backgroundColor: '#e8f5e8',
      color: '#2e7d32',
      padding: '12px',
      borderRadius: '6px',
      fontSize: '14px',
      marginTop: '8px',
    },
  };

  return (
    <FBLayout>
      <div style={fbStyles.container}>
        {/* Left Sidebar (empty for now, could add navigation) */}
        <div style={{ width: '280px' }}></div>

        {/* Main Content */}
        <div style={fbStyles.mainContent}>
          {/* Post Creation Form */}
          <div style={fbStyles.postForm}>
            <div style={fbStyles.userInfo}>
              <img
                src={user?.avatar || 'https://i.pravatar.cc/150'}
                alt="Avatar"
                style={fbStyles.avatar}
              />
              <p style={fbStyles.userName}>{user?.name || user?.email || 'User'}</p>
            </div>

            <form onSubmit={handleSubmit}>
              <textarea
                style={fbStyles.textarea}
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={loading}
                required
              />

              {imagePreview && (
                <div style={fbStyles.imagePreviewContainer}>
                  <img src={imagePreview} alt="Preview" style={fbStyles.imagePreview} />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                    style={fbStyles.removeImageBtn}
                  >
                    ×
                  </button>
                </div>
              )}

              <div style={fbStyles.postActions}>
                <label
                  htmlFor="image-upload"
                  style={fbStyles.imageUploadBtn}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f2f5'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <FaImage />
                  Photo
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                  disabled={loading}
                />

                <button
                  type="submit"
                  style={{
                    ...fbStyles.submitBtn,
                    opacity: loading || !content.trim() ? 0.6 : 1,
                    cursor: loading || !content.trim() ? 'not-allowed' : 'pointer'
                  }}
                  disabled={loading || !content.trim()}
                  onMouseEnter={(e) => {
                    if (!loading && content.trim()) {
                      e.target.style.backgroundColor = '#166fe5';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading && content.trim()) {
                      e.target.style.backgroundColor = '#1877f2';
                    }
                  }}
                >
                  {loading ? 'Posting...' : 'Post'}
                </button>
              </div>

              {error && <div style={fbStyles.errorMessage}>{error}</div>}
              {success && <div style={fbStyles.successMessage}>{success}</div>}
            </form>
          </div>

          {/* Featured Posts Carousel */}
          {featuredPosts.length > 0 && (
            <div style={fbStyles.featuredSection}>
              <h2 style={fbStyles.sectionTitle}>Featured Posts</h2>
              <Swiper
                modules={[Navigation]}
                navigation={true}
                spaceBetween={20}
                slidesPerView={1}
                className="featured-carousel"
              >
                {featuredPosts.map((post) => (
                  <SwiperSlide key={post.id}>
                    <div style={fbStyles.featuredPost}>
                      <div style={fbStyles.featuredPostImage}>
                        <img
                          src={getPostImageUrl(post.image)}
                          alt={post.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = 'https://picsum.photos/800/400?random=' + post.id;
                          }}
                        />
                      </div>
                      <div style={fbStyles.featuredPostContent}>
                        <h3 style={fbStyles.featuredPostTitle}>{post.title}</h3>
                        <p style={fbStyles.featuredPostExcerpt}>
                          {post.content?.substring(0, 150)}...
                        </p>
                        <div style={fbStyles.featuredPostMeta}>
                          <span style={fbStyles.postAuthor}>By {post.user?.name || 'Anonymous'}</span>
                          <div style={fbStyles.postStats}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <FaEye /> {post.views || 0}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <FaHeart /> {post.likes_count || 0}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <FaComment /> {post.comments_count || 0}
                            </span>
                          </div>
                        </div>
                        <Link
                          to={`/blog/post/${post.id}`}
                          style={fbStyles.readMoreBtn}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#166fe5'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#1877f2'}
                        >
                          Read More
                        </Link>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

          {/* Posts Section */}
          <Posts key={refreshPosts} />
        </div>

        {/* Right Sidebar */}
        <div style={fbStyles.sidebar}>
          <div style={fbStyles.sidebarCard}>
            <h3 style={fbStyles.sidebarTitle}>
              <FaNewspaper style={{ marginRight: '8px', color: '#1877f2' }} />
              Quick Stats
            </h3>
            <div style={fbStyles.statsGrid}>
              <div style={fbStyles.statItem}>
                <span style={fbStyles.statNumber}>{stats.posts || 0}</span>
                <span style={fbStyles.statLabel}>Posts</span>
              </div>
              <div style={fbStyles.statItem}>
                <span style={fbStyles.statNumber}>{stats.likes || 0}</span>
                <span style={fbStyles.statLabel}>Likes</span>
              </div>
              <div style={fbStyles.statItem}>
                <span style={fbStyles.statNumber}>{stats.comments || 0}</span>
                <span style={fbStyles.statLabel}>Comments</span>
              </div>
              <div style={fbStyles.statItem}>
                <span style={fbStyles.statNumber}>
                  {stats.views > 1000 ? `${(stats.views / 1000).toFixed(1)}k` : stats.views || 0}
                </span>
                <span style={fbStyles.statLabel}>Views</span>
              </div>
            </div>
          </div>

          <div style={fbStyles.sidebarCard}>
            <h3 style={fbStyles.sidebarTitle}>
              <FaUser style={{ marginRight: '8px', color: '#1877f2' }} />
              Categories
            </h3>
            <div style={fbStyles.categoryList}>
              <a
                href="#"
                style={fbStyles.categoryItem}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f2f5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Technology
              </a>
              <a
                href="#"
                style={fbStyles.categoryItem}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f2f5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Lifestyle
              </a>
              <a
                href="#"
                style={fbStyles.categoryItem}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f2f5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Travel
              </a>
              <a
                href="#"
                style={fbStyles.categoryItem}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f2f5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Food
              </a>
              <a
                href="#"
                style={fbStyles.categoryItem}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f2f5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Sports
              </a>
            </div>
          </div>

          <div style={fbStyles.sidebarCard}>
            <h3 style={fbStyles.sidebarTitle}>
              <FaTag style={{ marginRight: '8px', color: '#1877f2' }} />
              Popular Tags
            </h3>
            <div style={fbStyles.tagsCloud}>
              <span style={fbStyles.tag}>#javascript</span>
              <span style={fbStyles.tag}>#react</span>
              <span style={fbStyles.tag}>#php</span>
              <span style={fbStyles.tag}>#laravel</span>
              <span style={fbStyles.tag}>#webdev</span>
              <span style={fbStyles.tag}>#coding</span>
            </div>
          </div>
        </div>
      </div>
    </FBLayout>
  );
};

export default Main;
