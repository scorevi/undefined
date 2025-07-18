import React from 'react';
import { FaBookOpen, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './navbar.css';

export default function Navbar(props) {
  return (
    <nav className="navbar">

      <div className="nav-left">
        <FaBookOpen className="icon" />
        <span className="title">Blog Site</span>
      </div>

      <div className="nav-center">
        Welcome, {props.name}!
      </div>

      <div className="nav-right">
        <div className="avatar">J</div>

        <button className="logout-btn">
            <FaSignOutAlt className="logout-icon" />
        </button>

    </div>

    </nav>
  );
};