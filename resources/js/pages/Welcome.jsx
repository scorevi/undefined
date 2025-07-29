import { Link } from "react-router-dom";
import './styles/welcome.css';

const Welcome = () => (
  <div className="welcome-page">
    <div className="welcome-container">
      <div className="welcome-header">
        <div className="welcome-logo">
          <i className="fas fa-blog"></i>
        </div>
        <h1 className="welcome-title">Erikanoelvi's Blog</h1>
        <p className="welcome-subtitle">A modern blog platform for the DWP Subject.</p>
        <p className="welcome-description">Sign in or register to get started and explore our community.</p>
      </div>

      <div className="welcome-actions">
        <Link to="/login" className="welcome-btn primary">
          <i className="fas fa-user"></i>
          User Login
        </Link>
        <Link to="/register" className="welcome-btn secondary">
          <i className="fas fa-user-plus"></i>
          User Register
        </Link>
      </div>

      <div className="admin-actions">
        <Link to="/admin/login" className="admin-btn login">
          <i className="fas fa-shield-alt"></i>
          Admin Login
        </Link>
        <Link to="/admin/signup" className="admin-btn register">
          <i className="fas fa-user-cog"></i>
          Admin Register
        </Link>
      </div>

      <div className="welcome-features">
        <div className="feature-item">
          <div className="feature-icon">
            <i className="fas fa-edit"></i>
          </div>
          <h3>Write & Share</h3>
          <p>Create and publish your thoughts</p>
        </div>
        <div className="feature-item">
          <div className="feature-icon">
            <i className="fas fa-users"></i>
          </div>
          <h3>Connect</h3>
          <p>Engage with our community</p>
        </div>
        <div className="feature-item">
          <div className="feature-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <h3>Analytics</h3>
          <p>Track your blog's performance</p>
        </div>
      </div>
    </div>
  </div>
);

export default Welcome;
