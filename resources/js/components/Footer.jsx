import React from "react";
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaBookOpen } from 'react-icons/fa';
import './Styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-name">
        <FaBookOpen className="footer-icon" />
        <span className="brand-name">Blog Site</span>
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
    </footer>
  )
}

export default Footer;
