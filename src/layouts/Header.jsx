import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import opaleLogo from '../assets/opale_logo_crop.png';
import settingsIcon from '../assets/settings.png';
import './Header.css';

const Header = ({ showBackButton = false, title = null }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const user = useSelector((state) => state.user.user);
  const isAdmin = user?.role === 'ADMIN';

  const handleBackClick = () => {
    // 채팅방 페이지에서 뒤로 가기 시 항상 채팅방 목록으로 이동
    if (location.pathname.match(/^\/chat\/([^/]+)$/)) {
      navigate('/chat');
    } 
    // 공연장 상세 페이지에서 뒤로 가기 시 MainPlacePage로 이동 (상태 유지)
    else if (location.pathname.match(/^\/place\/([^/]+)$/)) {
      navigate('/place', { state: { fromDetailPlace: true } });
    } 
    else {
      navigate(-1);
    }
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
            <>
              {isAdmin && (
                <Link to="/admin" className="admin-icon-btn" title="운영자 페이지">
                  <img src={settingsIcon} alt="설정" className="admin-icon-image" />
                </Link>
              )}
              <Link to="/my" className="login-btn">MY</Link>
            </>
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
