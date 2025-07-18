import React from 'react';
import { FaBookOpen } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './navbar.css';

export default function Navbar(props) {
    const firstLetter = props.name[0];
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
        <div className="avatar">{firstLetter}</div>

        <button className="logout-btn">
            Log out
        </button>

    </div>

    </nav>
  );
};