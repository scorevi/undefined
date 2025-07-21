import { useState } from 'react';
import { FaHeart, FaComment, FaSort, FaChevronRight } from 'react-icons/fa';
import './posts.css'

const Posts = () => {

  
  const samplePosts = [
  {
    id: 1,
    title: "Recent Post 1",
    date: "7-20-25", // Published date hereee
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...",
    image: "https://picsum.photos/400?random=5",
    likes: 24,
    comments: 12,
  },
  {
    id: 2,
    title: "Recent Post 2",
    date: "7-19-25", // Published date hereee
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...",
    image: "https://picsum.photos/400?random=6",
    likes: 45,
    comments: 23,
  },
];

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

        {samplePosts.map((post) => (
          <div className="recent-post-card" key={post.id}>

            <img src={post.image} alt="post" className="post-img" />

            <div className="post-details">
              <h3>{post.title}</h3>
              <small>{post.date}</small>
              <p>{post.content}</p>

              <div className="engagement">
                <span className="likes"><FaHeart /> {post.likes}</span>
                <span><FaComment /> {post.comments}</span>
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
              <h4>{item.title}</h4>
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