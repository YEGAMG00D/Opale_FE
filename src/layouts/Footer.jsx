import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <footer className="footer">
      <nav className="footer-nav">
        <Link 
          to="/place" 
          className={`nav-item ${isActive('/place') ? 'active' : ''}`}
        >
          공연장
        </Link>
        <Link 
          to="/culture" 
          className={`nav-item ${isActive('/culture') ? 'active' : ''}`}
        >
          공연
        </Link>
        <Link 
          to="/" 
          className={`nav-item ${isActive('/') ? 'active' : ''}`}
        >
          홈
        </Link>
        <Link 
          to="/chat" 
          className={`nav-item ${isActive('/chat') ? 'active' : ''}`}
        >
          채팅
        </Link>
        <Link 
          to="/recommend" 
          className={`nav-item ${isActive('/recommend') ? 'active' : ''}`}
        >
          추천
        </Link>
      </nav>
    </footer>
  );
};

export default Footer;
