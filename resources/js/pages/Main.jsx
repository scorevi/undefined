import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useAuth } from '../authContext';
import { FaCamera } from 'react-icons/fa';

import 'swiper/css';
import 'swiper/css/navigation';

import './main.css';
import './featured.css';
import Posts from '../components/Posts';
import Navbar from '../components/NavBar';

function getPostImageUrl(image) {
  if (!image) return 'https://picsum.photos/1000/400?random=1';
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  return `/storage/${image}`;
}

const Main = () => {
  document.title = "Home";
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [refreshPosts, setRefreshPosts] = useState(0);

  useEffect(() => {
    // Fetch top 3 most recent posts for the featured carousel
    const fetchFeatured = async () => {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setFeaturedPosts((data.data || []).slice(0, 3));
      } catch (err) {
        setFeaturedPosts([]);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    // Fetch top 3 most recent posts for the featured carousel
    const fetchFeatured = async () => {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setFeaturedPosts((data.data || []).slice(0, 3));
      } catch (err) {
        setFeaturedPosts([]);
      }
    };
    fetchFeatured();
  }, [refreshPosts]); // depend on refreshPosts

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
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': csrfToken,
        },
        credentials: 'include',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.error || data.message || 'Failed to submit post');
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
    <Navbar name={user?.name || user?.email || 'John'}/> 
    <div className="container">
      
      {/* Post something, text field, or something to be able to post */}
      <form className="post-form" onSubmit={handleSubmit}>

        <img
          src={user?.avatar || 'https://i.pravatar.cc/300'}
          alt="Avatar"
          className="avatar" />

        <div className="post-input-section">
          <textarea
            placeholder="Share your thoughts!"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
          />
          
          <div className="post-actions">
            <label htmlFor="image-upload" className="custom-upload-btn">
              <FaCamera /> Upload Image
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
              disabled={loading}
            />
            <span className="file-name">
              {image ? image.name : ""}
            </span>
            <button type="submit" disabled={loading}>{loading ? 'Posting...' : 'Post'}</button>
          </div>

          {imagePreview && (
            <div style={{marginTop:8}}>
              <img src={imagePreview} alt="Preview" style={{maxWidth:200, maxHeight:200, borderRadius:8, boxShadow:'0 2px 8px #ccc'}} />
            </div>
          )}
          {error && <div className="user-error-message">{error}</div>}
          {success && <div className="user-success-message" style={{color:'#22c55e',marginTop:8}}>{success}</div>}
        </div>
      </form>

    <hr />

      {/* Carousel  */}
      <div className="featured-posts">

        <h1>Featured Posts</h1>

        <Swiper
          modules={[Navigation]}
          navigation={true}
          spaceBetween={30}
          slidesPerView={1}
          className="mySwiper"
        >
          
          {featuredPosts.map((post) => (
            <SwiperSlide key={post.id}>
              <Link to={`/blog/post/${post.id}`}>
                <div className="slide-card">
                  <img src={getPostImageUrl(post.image)} alt={post.title} className="slide-image" />
                  <div className="slide-overlay">
                    <h3 className="slide-title">{post.title}</h3>
                    <p>{post.content.length > 120 ? post.content.slice(0, 120) + '...' : post.content}</p>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}

        </Swiper>

      </div>
      <hr />
      <Posts refresh={refreshPosts} />
      

    </div>
    </>
  );
};

export default Main;
