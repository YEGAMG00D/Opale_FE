import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './MainLayout.css';

const MainLayout = () => {
  const location = useLocation();

  // 경로에 따라 Header props 결정
  const getHeaderProps = () => {
    const pathname = location.pathname;
    
    // 공연 상세 페이지 - 숫자 ID 패턴
    const cultureDetailMatch = pathname.match(/^\/culture\/(\d+)/);
    if (cultureDetailMatch && !pathname.includes('/culture/search') && pathname !== '/culture/review') {
      return { showBackButton: true, title: '공연' };
    }
    
    // 공연장 상세 페이지
    const placeDetailMatch = pathname.match(/^\/place\/(\d+)/);
    if (placeDetailMatch && !pathname.includes('/place/search')) {
      return { showBackButton: true, title: '공연장' };
    }
    
    // 채팅방 페이지
    const chatDetailMatch = pathname.match(/^\/chat\/(\d+)/);
    if (chatDetailMatch && !pathname.includes('/chat/search')) {
      return { showBackButton: true, title: '채팅' };
    }
    
    // 기타 상세 페이지들 (마이페이지, 검색 페이지 등)
    if (pathname.startsWith('/my/') || 
        pathname === '/culture/review' ||
        pathname.startsWith('/culture/search') ||
        pathname.startsWith('/place/search') ||
        pathname.startsWith('/chat/search')) {
      return { showBackButton: true, title: null };
    }
    
    // 목록 페이지들 - 헤더에 페이지명 표시 (정확히 일치하는 경우만)
    if (pathname === '/culture') {
      return { showBackButton: false, title: '공연' };
    }
    if (pathname === '/place') {
      return { showBackButton: false, title: '공연장' };
    }
    if (pathname === '/chat') {
      return { showBackButton: false, title: '채팅' };
    }
    if (pathname === '/recommend') {
      return { showBackButton: false, title: '추천' };
    }
    
    // 홈 페이지 - opale 표시
    return { showBackButton: false, title: null };
  };

  const headerProps = getHeaderProps();

  return (
    <div className="main-layout">
      <Header {...headerProps} />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
