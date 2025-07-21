import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

import './main.css';
import './featured.css';
import Posts from '../components/Posts';
import Navbar from '../components/NavBar';

const Main = () => {
  document.title = "Home";
  // Post form ============================
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  // Mostly copied from one of my old projects :sob: Feel free to change/remove it bcs it does nothing
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }}

  //   try {
  //     const response = await fetch('/api/posts', {
  //       method: 'POST',
  //       body: formData,
  //     });

  //     if (response.ok) {
  //       alert('Post submitted!');
  //       setContent('');
  //       setImage(null);
  //     } else {
  //       alert('Failed to submit post');
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     alert('Error submitting post');
  //   }
  // };

  // Placeholder value for carousel images ====================================
  const posts = [
    { 
      id: 1, 
      title: "Post 1", 
      descriptionOverview: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
      image: "https://picsum.photos/1000/400?random=1" // Why is picsum not working sometimes :c
    },
    { 
      id: 2, 
      title: "Post 2", 
      descriptionOverview: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
      image: "https://picsum.photos/1000/400?random=2" 
    },
    { 
      id: 3, 
      title: "Post 3",
      descriptionOverview: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
      image: "https://picsum.photos/1000/400?random=3" 
    },
  ];

  return (
    <> 
    <Navbar name="John"/> 
    <div className="container">
      
      {/* Post something, text field, or something to be able to post */}
      <form className="post-form" onSubmit={handleSubmit}>

        <img
          src="https://i.pravatar.cc/300"
          alt="Avatar"
          className="avatar" />

        <div className="post-input-section">
          <textarea
            placeholder="Share your thoughts!"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="post-actions">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <button type="submit">Post</button>
          </div>
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
          
          {posts.map((post) => (
            <SwiperSlide key={post.id}>
              <Link to="userpost">
              <div className="slide-card">
                <img src={post.image} alt={post.title} className="slide-image" />

                <div className="slide-overlay">
                  <h3 className="slide-title">{post.title}</h3>
                  <p>{post.descriptionOverview}</p>
                </div>

              </div>
              </Link>
            </SwiperSlide>
          ))}

        </Swiper>

      </div>
      <hr />
      <Posts />
      

    </div>
    </>
  );
};

export default Main;
