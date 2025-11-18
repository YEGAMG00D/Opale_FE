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
          <div className="nav-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* 무대 커튼 - 상단 장식 */}
              <path d="M2 3C2 2.44772 2.44772 2 3 2H21C21.5523 2 22 2.44772 22 3V7H2V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 3L2 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 3L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 7H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              {/* 무대 */}
              <rect x="2" y="7" width="20" height="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              {/* 관객석 - 첫 번째 줄 */}
              <rect x="3" y="17" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="8" y="17" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="13" y="17" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="18" y="17" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              {/* 관객석 - 두 번째 줄 */}
              <rect x="5" y="13" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="11" y="13" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="17" y="13" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="nav-text">공연장</span>
        </Link>
        <Link 
          to="/culture" 
          className={`nav-item ${isActive('/culture') ? 'active' : ''}`}
        >
          <div className="nav-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* 티켓 본체 */}
              <rect x="4" y="5" width="16" height="14" rx="1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              {/* 티켓 좌측 구멍 (반원) */}
              <path d="M4 12C4 11.4477 4.44772 11 5 11C5.55228 11 6 11.4477 6 12C6 12.5523 5.55228 13 5 13C4.44772 13 4 12.5523 4 12Z" fill="white"/>
              <path d="M4 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              {/* 티켓 우측 구멍 (반원) */}
              <path d="M18 12C18 11.4477 18.4477 11 19 11C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13C18.4477 13 18 12.5523 18 12Z" fill="white"/>
              <path d="M18 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              {/* 티켓 상단 점선 구분선 */}
              <path d="M6 9H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2"/>
              {/* 티켓 하단 점선 구분선 */}
              <path d="M6 15H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2"/>
            </svg>
          </div>
          <span className="nav-text">공연</span>
        </Link>
        <Link 
          to="/" 
          className={`nav-item ${isActive('/') ? 'active' : ''}`}
        >
          <div className="nav-icon nav-icon-home">
            <svg width="29" height="29" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="nav-text">홈</span>
        </Link>
        <Link 
          to="/chat" 
          className={`nav-item ${isActive('/chat') ? 'active' : ''}`}
        >
          <div className="nav-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="nav-text">채팅</span>
        </Link>
        <Link 
          to="/recommend" 
          className={`nav-item ${isActive('/recommend') ? 'active' : ''}`}
        >
          <div className="nav-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="nav-text">추천</span>
        </Link>
      </nav>
    </footer>
  );
};

export default Footer;
