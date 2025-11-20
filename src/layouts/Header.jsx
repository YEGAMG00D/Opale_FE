import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import opaleLogo from '../assets/opale_logo_crop.png';
import './Header.css';

const Header = ({ showBackButton = false, title = null }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const handleBackClick = () => {
    navigate(-1);
  };

  // 뒤로가기 버튼이 없을 때는 항상 로고 표시
  const showLogo = !showBackButton;

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          {showBackButton ? (
            <button onClick={handleBackClick} className="back-button">←</button>
          ) : (
            <Link to="/" className="logo-link">
              <img src={opaleLogo} alt="Opale" className="logo-image" />
            </Link>
          )}
        </div>
        <div className="header-right">
          {isLoggedIn ? (
            <Link to="/my" className="login-btn">MY</Link>
          ) : (
            <Link to="/login" className="login-btn">로그인</Link>
          )}
        </div>
      </div>
      <div className="header-divider"></div>
    </header>
  );
};

export default Header;
