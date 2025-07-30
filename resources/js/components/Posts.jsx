import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaComment, FaSort, FaChevronRight } from 'react-icons/fa';
import RoleBadge from './RoleBadge';
import './styles/posts.css';

function getPostImageUrl(image) {
  if (!image) return null;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  return `/storage/${image}`;
}

const Posts = ({ refresh }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trending, setTrending] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [postsPage, setPostsPage] = useState(1);
  const [postsLastPage, setPostsLastPage] = useState(1);
  const [postsTotal, setPostsTotal] = useState(0);
  const [postsLoadingMore, setPostsLoadingMore] = useState(false);

  // Image viewer state
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [viewerImageSrc, setViewerImageSrc] = useState('');
  const [viewerImageAlt, setViewerImageAlt] = useState('');

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

  // Fetch posts (paginated)
  useEffect(() => {
    const fetchPosts = async (page = 1, append = false) => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams({
          page: page,
          per_page: 10,
          sort_by: sortBy,
          sort_order: sortOrder
        });

        if (selectedCategory && selectedCategory !== 'all') {
          params.append('category', selectedCategory);
        }

        const response = await fetch(`/api/posts?${params}`);
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        if (append) {
          setPosts((prev) => [...prev, ...(Array.isArray(data.data) ? data.data : [])]);
        } else {
          setPosts(Array.isArray(data.data) ? data.data : []);
        }
        setPostsPage(data.current_page);
        setPostsLastPage(data.last_page);
        setPostsTotal(data.total);
      } catch (err) {
        setError('Could not load posts.');
        if (!append) setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts(1, false);
  }, [refresh, sortBy, sortOrder, selectedCategory]);

  // Load more posts
  const loadMorePosts = async () => {
    if (postsPage >= postsLastPage) return;
    setPostsLoadingMore(true);
    try {
      const nextPage = postsPage + 1;
      const params = new URLSearchParams({
        page: nextPage,
        per_page: 10,
        sort_by: sortBy,
        sort_order: sortOrder
      });

      if (selectedCategory && selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }

      const response = await fetch(`/api/posts?${params}`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts((prev) => [...prev, ...data.data]);
      setPostsPage(data.current_page);
      setPostsLastPage(data.last_page);
      setPostsTotal(data.total);
    } catch (err) {}
    setPostsLoadingMore(false);
  };

  // Infinite scroll for posts
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
        !postsLoadingMore &&
        postsPage < postsLastPage
      ) {
        loadMorePosts();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [postsLoadingMore, postsPage, postsLastPage]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch('/api/posts/trending');
        if (!response.ok) throw new Error('Failed to fetch trending posts');
        const data = await response.json();
        setTrending(data);
      } catch (err) {
        setTrending([]);
      }
    };
    fetchTrending();
  }, [refresh]);

  // Fetch featured posts
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch('/api/posts/featured');
        if (!response.ok) throw new Error('Failed to fetch featured posts');
        const data = await response.json();
        setFeaturedPosts(data);
      } catch (err) {
        setFeaturedPosts([]);
      }
    };
    fetchFeatured();
  }, [refresh]);

  return (
    <>
      <div className="posts-section">
        {/* Featured Posts Section */}
        <div className="featured-posts">
          <div className="featured-header">
            <h2>Featured Posts</h2>
            <p className="featured-subtitle">Hand-picked posts highlighted by our editorial team</p>
          </div>
          {featuredPosts.length > 0 ? (
            <div className="featured-posts-grid">
              {featuredPosts.map((post) => (
                <div className="featured-post-card" key={post.id}>
                  {post.image && getPostImageUrl(post.image) ? (
                    <img
                      src={getPostImageUrl(post.image)}
                      alt="featured post"
                      className="featured-post-img"
                      style={{ cursor: 'pointer' }}
                      onClick={() => openImageViewer(getPostImageUrl(post.image), `Featured: ${post.title}`)}
                      onError={e => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="featured-post-no-image">
                      <div className="no-image-placeholder">
                        <span>📝</span>
                      </div>
                    </div>
                  )}
                  <div className="featured-post-details">
                    <div className="featured-post-header">
                      <Link to={`/blog/post/${post.id}`} className="featured-post-title">{post.title}</Link>
                      <div className="featured-badges">
                        <span className="featured-post-category">{post.category}</span>
                        <span className="featured-badge">⭐ Featured</span>
                      </div>
                    </div>
                    <p className="featured-post-content">{post.content.length > 120 ? post.content.slice(0, 120) + '...' : post.content}</p>
                    <div className="featured-post-meta">
                      <div className="meta-left">
                        <div style={{display: 'flex', alignItems: 'center'}}>
                          <span className="author">👤 {post.user?.name || 'Unknown'}</span>
                          <RoleBadge role={post.user?.role} className="role-badge-small" />
                        </div>
                        <span className="date">📅 {new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="meta-right">
                        <span className="views">👁️ {post.views} views</span>
                        <span className="likes">❤️ {post.likes_count || 0} likes</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="featured-empty">
              <div className="empty-icon">⭐</div>
              <h3>No Featured Posts Yet</h3>
              <p>Our editorial team hasn't selected any featured posts at the moment. Check back soon for hand-picked content that stands out from the crowd!</p>
              <div className="empty-actions">
                <span className="empty-hint">💡 Featured posts are selected by administrators to highlight exceptional content</span>
              </div>
            </div>
          )}
        </div>

        <div className="posts-main-content">
          <div className="category-cont">
            <h2>Post Categories</h2>
            <div className="post-categories">
              <ul className='categories'>
                <li
                  className={selectedCategory === 'all' ? 'active' : ''}
                  onClick={() => setSelectedCategory('all')}
                >
                  All
                </li>
                <li
                  className={selectedCategory === 'news' ? 'active' : ''}
                  onClick={() => setSelectedCategory('news')}
                >
                  News
                </li>
                <li
                  className={selectedCategory === 'review' ? 'active' : ''}
                  onClick={() => setSelectedCategory('review')}
                >
                  Review
                </li>
                <li
                  className={selectedCategory === 'podcast' ? 'active' : ''}
                  onClick={() => setSelectedCategory('podcast')}
                >
                  Podcast
                </li>
                <li
                  className={selectedCategory === 'opinion' ? 'active' : ''}
                  onClick={() => setSelectedCategory('opinion')}
                >
                  Opinion
                </li>
                <li
                  className={selectedCategory === 'lifestyle' ? 'active' : ''}
                  onClick={() => setSelectedCategory('lifestyle')}
                >
                  Lifestyle
                </li>
              </ul>
            </div>
          </div>

          <div className="recent-posts">
            <div className="section-header">
              <h2>Recent Posts ({postsTotal})</h2>
              <div className="sort-section">
                <button className="sort-btn" onClick={() => {
                  const dropdown = document.querySelector('.dropdown');
                  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
                }}>
                  <FaSort /> Sort
                </button>

                <div className="dropdown" style={{display: 'none', position: 'absolute', background: 'white', border: '1px solid #ddd', borderRadius: '4px', padding: '8px', zIndex: 1000, minWidth: '120px'}}>
                  <span
                    className={`latest ${sortBy === 'created_at' && sortOrder === 'desc' ? 'active' : ''}`}
                    onClick={() => {setSortBy('created_at'); setSortOrder('desc'); document.querySelector('.dropdown').style.display = 'none';}}
                    style={{display: 'block', padding: '4px 8px', cursor: 'pointer', borderBottom: '1px solid #eee'}}
                  >
                    Latest
                  </span>
                  <span
                    className={`oldest ${sortBy === 'created_at' && sortOrder === 'asc' ? 'active' : ''}`}
                    onClick={() => {setSortBy('created_at'); setSortOrder('asc'); document.querySelector('.dropdown').style.display = 'none';}}
                    style={{display: 'block', padding: '4px 8px', cursor: 'pointer', borderBottom: '1px solid #eee'}}
                  >
                    Oldest
                  </span>
                  <span
                    className={`most-views ${sortBy === 'views' ? 'active' : ''}`}
                    onClick={() => {setSortBy('views'); setSortOrder('desc'); document.querySelector('.dropdown').style.display = 'none';}}
                    style={{display: 'block', padding: '4px 8px', cursor: 'pointer', borderBottom: '1px solid #eee'}}
                  >
                    Most viewed
                  </span>
                  <span
                    className={`most-liked ${sortBy === 'likes' ? 'active' : ''}`}
                    onClick={() => {setSortBy('likes'); setSortOrder('desc'); document.querySelector('.dropdown').style.display = 'none';}}
                    style={{display: 'block', padding: '4px 8px', cursor: 'pointer'}}
                  >
                    Most liked
                  </span>
                </div>
              </div>
            </div>
            {loading && <div className="user-loading">Loading posts...</div>}
            {error && <div className="user-error-message">{error}</div>}
            {!loading && !error && posts.length === 0 && (
              <div style={{margin:'1rem 0', color:'#888'}}>No posts yet.</div>
            )}
            {Array.isArray(posts) && posts.map((post) => (
              <div className="recent-post-card" key={post.id}>
                {post.image && getPostImageUrl(post.image) && (
                  <img
                    src={getPostImageUrl(post.image)}
                    alt="post"
                    className="post-img"
                    style={{ cursor: 'pointer' }}
                    onClick={() => openImageViewer(getPostImageUrl(post.image), post.title)}
                    onError={e => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <div className="post-details" style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'flex-start',gap:8,marginBottom:2,flexWrap:'wrap'}}>
                    <Link
                      to={`/blog/post/${post.id}`}
                      style={{
                        fontWeight:600,
                        fontSize:'1.05rem',
                        color:'#222',
                        textDecoration:'none',
                        flexShrink:0,
                        cursor:'pointer',
                        zIndex:10
                      }}
                    >
                      {post.title}
                    </Link>
                    {post.category && (
                      <span style={{background:'#f0f9ff',color:'#0369a1',padding:'2px 8px',borderRadius:'12px',fontSize:'0.8rem',fontWeight:500,flexShrink:0}}>{post.category}</span>
                    )}

                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4,flexWrap:'wrap'}}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      <span style={{color:'#888',fontSize:'0.92rem'}}>👤 {post.user?.name || 'Unknown'}</span>
                      <RoleBadge role={post.user?.role} className="role-badge-small" />
                    </div>
                    <span style={{color:'#bbb',fontSize:'0.9rem'}}>📅 {new Date(post.created_at).toLocaleDateString()}</span>
                    {post.views !== undefined && (
                      <span style={{color:'#bbb',fontSize:'0.9rem'}}>👁️ {post.views} views</span>
                    )}
                  </div>
                  <p style={{margin:'2px 0 0 0',fontSize:'0.97rem',color:'#444',lineHeight:'1.4'}}>{post.content.length > 80 ? post.content.slice(0, 80) + '...' : post.content}</p>
                  <div className="engagement">
                    <span className="likes"><FaHeart /> {post.likes_count ?? 0}</span>
                    <span className="comments"><FaComment /> {post.comments_count ?? 0}</span>
                  </div>
                </div>
              </div>
            ))}
            {postsPage < postsLastPage && (
              <button onClick={loadMorePosts} disabled={postsLoadingMore} style={{margin:'16px auto',display:'block',background:'#f3f4f6',color:'#222',border:'none',borderRadius:6,padding:'10px 24px',fontWeight:500,cursor:'pointer'}}>
                {postsLoadingMore ? 'Loading...' : 'Load more posts'}
              </button>
            )}
          </div>

          <div className="trending-posts">
            <h2>Trending</h2>
            {trending.length === 0 && <div style={{color:'#888'}}>No trending posts yet.</div>}
            {Array.isArray(trending) && trending.map((item) => (
              <div className="trending-card" key={item.id}>
                <div className="trend-content">
                  <Link to={`/blog/post/${item.id}`}><h4>{item.title}</h4></Link>
                  <p>{item.content.length > 80 ? item.content.slice(0, 80) + '...' : item.content}</p>
                  <div className="trend-engagement">
                    <span className="likes"><FaHeart />{item.likes_count}</span>
                    <span style={{marginLeft:8}}><FaComment />{item.comments_count ?? 0}</span>
                    <span style={{marginLeft:8, color:'#bbb', fontSize:'0.95rem'}}>{item.views} views</span>
                  </div>
                </div>
                <FaChevronRight className="chevron" />
              </div>
            ))}
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

export default Posts;
