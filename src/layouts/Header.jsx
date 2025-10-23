import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="logo">opale</h1>
        </div>
        <div className="header-right">
          <button className="login-btn">로그인</button>
        </div>
      </div>
      <div className="header-divider"></div>
    </header>
  );
};

export default Header;
