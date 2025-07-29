import React from "react";
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaBookOpen } from 'react-icons/fa';
import './styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <FaBookOpen className="footer-icon" />
          <span className="brand-name">Blog Site</span>
        </div>

        <div className="footer-content">
          <ul className="footer-links">
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/privacy">Privacy</a></li>
          </ul>
        </div>

        <div className="social-links">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebookF />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedinIn />
          </a>
        </div>
      </div>

      <div className="footer-copyright">
        <p>&copy; 2025 Blog Site. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer;
