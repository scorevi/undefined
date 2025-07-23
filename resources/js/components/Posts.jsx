import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaComment, FaSort, FaChevronRight } from 'react-icons/fa';
import './posts.css';
// import UserPost from '../pages/UserPost';

const Posts = ({ refresh }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError('Could not load posts.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [refresh]);

  // Trending section is still static for now
  const trending = [
    {
      id: 1,
      title: 'Post 1',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      likes: 675,
      commentCount: 459,
    },
    {
      id: 2,
      title: 'Post 2',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      likes: 345,
      commentCount: 243,
    },
    {
      id: 3,
      title: 'Post 3',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      likes: 238,
      commentCount: 185,
    },
  ];

  return (
    <div className="posts-section">
      <div className="recent-posts">
        <div className="section-header">
          <h2>Recent Posts</h2>
          <button className="sort-btn">
            <FaSort /> Sort
          </button>
        </div>
        {loading && <div className="user-loading">Loading posts...</div>}
        {error && <div className="user-error-message">{error}</div>}
        {!loading && !error && posts.length === 0 && (
          <div style={{margin:'1rem 0', color:'#888'}}>No posts yet.</div>
        )}
        {posts.map((post) => (
          <div className="recent-post-card" key={post.id} style={{alignItems:'center',padding:'0.7rem 1rem',minHeight:0}}>
            <img src={post.image ? `/storage/${post.image}` : 'https://picsum.photos/400?random=5'} alt="post" className="post-img" style={{width:70,height:70,marginRight:16}} />
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
              <div className="engagement" style={{marginTop:4}}>
                <span className="likes"><FaHeart /> 0</span>
                <span><FaComment /> 0</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="trending-posts">
        <h2>Trending</h2>
        {trending.map((item) => (
          <div className="trending-card" key={item.id}>
            <div className="trend-content">
              <Link to={`/blog/post/${item.id}`}><h4>{item.title}</h4></Link>
              <p>{item.text}</p>
              <div className="trend-engagement">
                <span className="likes"><FaHeart />{item.likes}</span>
                <span><FaComment />{item.commentCount}</span>
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