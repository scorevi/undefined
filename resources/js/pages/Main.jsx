import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

import './main.css';
import './featured.css';

const Main = () => {
  // Placeholder value for carousel images
  const posts = [
    { id: 1, title: "Post 1", image: "https://picsum.photos/1000/400?random=1" },
    { id: 2, title: "Post 2", image: "https://picsum.photos/1000/400?random=2" },
    { id: 3, title: "Post 3", image: "https://picsum.photos/1000/400?random=3" },
  ];

  return (

    <div className="container">

      <div className="post-field-cont">

      </div>

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
              <div className="slide-card">
                <img src={post.image} alt={post.title} className="slide-image" />

                <div className="slide-overlay">
                  <h3 className="slide-title">{post.title}</h3>
                </div>

              </div>
            </SwiperSlide>
          ))}

        </Swiper>
      </div>
    </div>
  );
};

export default Main;
