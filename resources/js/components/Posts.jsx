import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaComment, FaSort, FaChevronRight } from 'react-icons/fa';
import './styles/posts.css';
// import UserPost from '../pages/UserPost';

function getPostImageUrl(image) {
  if (!image) return 'https://picsum.photos/400?random=5';
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  return `/storage/${image}`;
}

const Posts = ({ refresh }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trending, setTrending] = useState([]);
  const [postsPage, setPostsPage] = useState(1);
  const [postsLastPage, setPostsLastPage] = useState(1);
  const [postsTotal, setPostsTotal] = useState(0);
  const [postsLoadingMore, setPostsLoadingMore] = useState(false);

  // Fetch posts (paginated)
  useEffect(() => {
    const fetchPosts = async (page = 1, append = false) => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/posts?page=${page}&per_page=10`);
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
  }, [refresh]);

  // Load more posts
  const loadMorePosts = async () => {
    if (postsPage >= postsLastPage) return;
    setPostsLoadingMore(true);
    try {
      const nextPage = postsPage + 1;
      const response = await fetch(`/api/posts?page=${nextPage}&per_page=10`);
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

  return (
    <div className="posts-page">
      <div className="posts-container">
        <div className="posts-section">
          {/* Categories Sidebar */}
          <div className="category-cont">
            <h3>Categories</h3>
            <div className="category-list">
              <a href="#" className="category-link active">
                <span className="category-name">All Posts</span>
                <span className="category-count">{postsTotal}</span>
              </a>
              <a href="#" className="category-link">
                <span className="category-name">Technology</span>
                <span className="category-count">12</span>
              </a>
              <a href="#" className="category-link">
                <span className="category-name">Lifestyle</span>
                <span className="category-count">8</span>
              </a>
              <a href="#" className="category-link">
                <span className="category-name">Travel</span>
                <span className="category-count">5</span>
              </a>
              <a href="#" className="category-link">
                <span className="category-name">Food</span>
                <span className="category-count">3</span>
              </a>
            </div>
          </div>

          {/* Main Posts Section */}
          <div className="recent-posts">
            <div className="section-header">
              <h2>Recent Posts</h2>
              <div className="sort-section">
                <button className="sort-btn">
                  <FaSort />
                  Latest
                </button>
              </div>
            </div>

            {loading && posts.length === 0 ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading posts...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>{error}</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-newspaper"></i>
                <h3>No posts yet</h3>
                <p>Be the first to share something!</p>
              </div>
            ) : (
              <div className="posts-list">
                {posts.map((post) => (
                  <article key={post.id} className="recent-post-card">
                    {post.image && (
                      <div className="post-image-container">
                        <img
                          src={getPostImageUrl(post.image)}
                          alt={post.title}
                          className="post-img"
                          onError={(e) => {
                            e.target.src = 'https://picsum.photos/400?random=' + post.id;
                          }}
                        />
                      </div>
                    )}
                    <div className="post-details">
                      <div className="post-header">
                        <div className="author-info">
                          <img
                            src={`https://i.pravatar.cc/40?u=${post.user?.email || 'default'}`}
                            alt="Author"
                            className="author-avatar"
                          />
                          <div>
                            <p className="author-name">{post.user?.name || 'Anonymous'}</p>
                            <p className="post-date">
                              {post.created_at
                                ? new Date(post.created_at).toLocaleDateString()
                                : 'Unknown date'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Link to={`/blog/post/${post.id}`} className="post-link">
                        <h3 className="post-title">{post.title}</h3>
                        <p className="post-content">
                          {post.content?.substring(0, 150)}
                          {post.content?.length > 150 ? '...' : ''}
                        </p>
                      </Link>

                      <div className="post-engagement">
                        <div className="engagement-stats">
                          <div className="engagement-item">
                            <FaHeart />
                            {post.likes_count || 0}
                          </div>
                          <div className="engagement-item">
                            <FaComment />
                            {post.comments_count || 0}
                          </div>
                          <div className="engagement-item">
                            <i className="fas fa-eye"></i>
                            {post.views || 0}
                          </div>
                        </div>
                        <Link to={`/blog/post/${post.id}`} className="read-more">
                          Read More <FaChevronRight />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}

                {postsLoadingMore && (
                  <div className="loading-more">
                    <div className="loading-spinner"></div>
                    <p>Loading more posts...</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Trending Sidebar */}
          <div className="trending-posts">
            <h3>Trending Posts</h3>
            {trending.length > 0 ? (
              <div className="trending-list">
                {trending.map((post, index) => (
                  <Link key={post.id} to={`/blog/post/${post.id}`} className="trending-item">
                    <div className="trending-rank">#{index + 1}</div>
                    <div className="trending-content">
                      <h4 className="trending-title">{post.title}</h4>
                      <div className="trending-stats">
                        <span><FaHeart /> {post.likes_count || 0}</span>
                        <span><i className="fas fa-eye"></i> {post.views || 0}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="empty-trending">
                <p>No trending posts yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts;
