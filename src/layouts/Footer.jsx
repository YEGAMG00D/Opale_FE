import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-divider"></div>
      <nav className="footer-nav">
        <button className="nav-item">공연장</button>
        <button className="nav-item">공연</button>
        <button className="nav-item active">홈</button>
        <button className="nav-item">채팅</button>
        <button className="nav-item">추천</button>
      </nav>
    </footer>
  );
};

export default Footer;
