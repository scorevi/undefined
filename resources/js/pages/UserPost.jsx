import { FaHeart, FaComment } from 'react-icons/fa';
import './userpost.css';

const UserPost = () => {
  const post = [{
    id: 1,
    title: "Title",
    authorName: "John Doe",
    authorImg: "https://i.pravatar.cc/300",
    postImg: "https://picsum.photos/400?random=5",
    postDate: "7-20-25",
    postBody: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    likeCount: 10,
    commentCount: 2,
  }]
  return (
    <>
      {post.map((content) => (
      <div className="blog-container" key={content.id}>
        <img
          src={content.postImg}
          alt="Post cover"
          className="blog-image" /><div className="blog-content">
            <h1 className="post-title">{content.title}</h1>

            <div className="author-section">
              <img
                src={content.authorImg}
                alt="Author"
                className="author-img" />
              <div>
                <p className="author-name">{content.authorName}</p>
                <p className="post-date">{content.postDate}</p>
              </div>
            </div>

            <hr />

            <p className="post-body">{content.postBody}</p>

            <div className="engagement-footer">
              <span><FaHeart />{content.likeCount}</span>
              <span><FaComment />{content.commentCount}</span>
            </div>
          </div>
      </div>
      ))}

    </>
  );
};

export default UserPost;