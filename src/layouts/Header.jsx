import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header = ({ showBackButton = false, title = null }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackClick = () => {
    navigate(-1);
  };

  // title이 있으면 좌측에 표시, 없으면 홈일 때만 opale 표시
  const showLogo = !showBackButton && !title;

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          {showBackButton ? (
            <button onClick={handleBackClick} className="back-button">←</button>
          ) : showLogo ? (
            <Link to="/" className="logo">opale</Link>
          ) : title ? (
            <div className="header-title">{title}</div>
          ) : (
            <div></div>
          )}
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
