import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaComment, FaSort, FaChevronRight } from 'react-icons/fa';
import './posts.css';
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
    <div className="posts-section">
      <div className="recent-posts">
        <div className="section-header">
          <h2>Recent Posts ({postsTotal})</h2>
          <button className="sort-btn">
            <FaSort /> Sort
          </button>
        </div>
        {loading && <div className="user-loading">Loading posts...</div>}
        {error && <div className="user-error-message">{error}</div>}
        {!loading && !error && posts.length === 0 && (
          <div style={{margin:'1rem 0', color:'#888'}}>No posts yet.</div>
        )}
        {Array.isArray(posts) && posts.map((post) => (
          <div className="recent-post-card" key={post.id} style={{alignItems:'center',padding:'0.7rem 1rem',minHeight:0}}>
            {post.image && (
              <img src={getPostImageUrl(post.image)} alt="post" className="post-img" style={{width:70,height:70,marginRight:16}} 
              onError={e => { e.target.onerror = null; e.target.src = 'https://picsum.photos/400?random=5'; }}
            />
            )}
            <div className="post-details" style={{flex:1,minWidth:0}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:2}}>
                <Link to={`/blog/post/${post.id}`} style={{fontWeight:600,fontSize:'1.05rem',color:'#222',textDecoration:'none',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',maxWidth:'60%'}}>{post.title}</Link>
                <span style={{color:'#888',fontSize:'0.92rem'}}>| {post.user?.name || 'Unknown'}</span>
                <span style={{color:'#bbb',fontSize:'0.9rem'}}>| {new Date(post.created_at).toLocaleDateString()}</span>
                {post.views !== undefined && (
                  <span style={{color:'#bbb',fontSize:'0.9rem'}}>| {post.views} views</span>
                )}
              </div>
              <p style={{margin:'2px 0 0 0',fontSize:'0.97rem',color:'#444',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',maxWidth:'100%'}}>{post.content.length > 80 ? post.content.slice(0, 80) + '...' : post.content}</p>
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
                <span style={{marginLeft:8}}><FaComment />0</span>
                <span style={{marginLeft:8, color:'#bbb', fontSize:'0.95rem'}}>{item.views} views</span>
              </div>
            </div>
            <FaChevronRight className="chevron" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;