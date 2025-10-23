import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <Link to="/" className="logo">opale</Link>
        </div>
        <div className="header-right">
          <Link to="/login" className="login-btn">로그인</Link>
        </div>
      </div>
      <div className="header-divider"></div>
    </header>
  );
};

export default Header;
