import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useAuth } from '../authContext';
import { FaCamera, FaImage, FaHeart, FaComment, FaEye, FaShare } from 'react-icons/fa';

import 'swiper/css';
import 'swiper/css/navigation';

import './styles/main.css';
import Posts from '../components/Posts';
import Navbar from '../components/NavBar';

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

  return (
    <>
      <Navbar />
      <div className="main-page">
        {/* Page Header */}
        <div className="main-header">
          <h1>Welcome to Your Blog Dashboard</h1>
          <p>Share your thoughts and connect with the community</p>
        </div>

        <div className="main-container">
          <div className="main-content">

            {/* Post Creation Form */}
            <div className="post-form">
              <div className="post-form-header">
                <img
                  src={user?.avatar || 'https://i.pravatar.cc/150'}
                  alt="Avatar"
                  className="avatar"
                />
                <div className="user-info">
                  <p className="user-name">{user?.name || user?.email || 'User'}</p>
                  <p className="user-subtitle">What's on your mind?</p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <textarea
                  className="post-textarea"
                  placeholder="Share your thoughts with the community..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={loading}
                  required
                />

                {imagePreview && (
                  <div className="image-preview-container">
                    <img src={imagePreview} alt="Preview" className="image-preview" />
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                      }}
                      className="remove-image-btn"
                    >
                      ×
                    </button>
                  </div>
                )}

                <div className="post-actions">
                  <div className="post-tools">
                    <label htmlFor="image-upload" className="image-upload-btn">
                      <FaImage />
                      Add Photo
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleImageChange}
                      disabled={loading}
                    />
                  </div>
                  <button type="submit" className="post-submit-btn" disabled={loading || !content.trim()}>
                    {loading ? 'Posting...' : 'Share Post'}
                  </button>
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
              </form>
            </div>

            {/* Featured Posts Carousel */}
            {featuredPosts.length > 0 && (
              <div className="featured-section">
                <h2 className="section-title">Featured Posts</h2>
                <Swiper
                  modules={[Navigation]}
                  navigation={true}
                  spaceBetween={30}
                  slidesPerView={1}
                  className="featured-carousel"
                >
                  {featuredPosts.map((post) => (
                    <SwiperSlide key={post.id}>
                      <div className="featured-post">
                        <div className="featured-post-image">
                          <img
                            src={getPostImageUrl(post.image)}
                            alt={post.title}
                            onError={(e) => {
                              e.target.src = 'https://picsum.photos/800/400?random=' + post.id;
                            }}
                          />
                        </div>
                        <div className="featured-post-content">
                          <h3 className="featured-post-title">{post.title}</h3>
                          <p className="featured-post-excerpt">
                            {post.content?.substring(0, 150)}...
                          </p>
                          <div className="featured-post-meta">
                            <span className="post-author">By {post.user?.name || 'Anonymous'}</span>
                            <div className="post-stats">
                              <span><FaEye /> {post.views || 0}</span>
                              <span><FaHeart /> {post.likes_count || 0}</span>
                              <span><FaComment /> {post.comments_count || 0}</span>
                            </div>
                          </div>
                          <Link to={`/blog/post/${post.id}`} className="read-more-btn">
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
            <div className="posts-section">
              <div className="posts-header">
                <h2 className="posts-title">Recent Posts</h2>
                <p className="posts-subtitle">Discover what's trending in our community</p>
              </div>
              <Posts key={refreshPosts} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="sidebar">
            <div className="sidebar-card">
              <h3>Quick Stats</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-number">{stats.posts || 0}</span>
                  <span className="stat-label">Posts</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{stats.likes || 0}</span>
                  <span className="stat-label">Likes</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{stats.comments || 0}</span>
                  <span className="stat-label">Comments</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{stats.views > 1000 ? `${(stats.views / 1000).toFixed(1)}k` : stats.views || 0}</span>
                  <span className="stat-label">Views</span>
                </div>
              </div>
            </div>

            <div className="sidebar-card">
              <h3>Categories</h3>
              <div className="category-list">
                <a href="#" className="category-item">Technology</a>
                <a href="#" className="category-item">Lifestyle</a>
                <a href="#" className="category-item">Travel</a>
                <a href="#" className="category-item">Food</a>
                <a href="#" className="category-item">Sports</a>
              </div>
            </div>

            <div className="sidebar-card">
              <h3>Popular Tags</h3>
              <div className="tags-cloud">
                <span className="tag">#javascript</span>
                <span className="tag">#react</span>
                <span className="tag">#php</span>
                <span className="tag">#laravel</span>
                <span className="tag">#webdev</span>
                <span className="tag">#coding</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
