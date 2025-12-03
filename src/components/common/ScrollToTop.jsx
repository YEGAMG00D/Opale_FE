import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 페이지 이동 시 스크롤을 맨 위로 리셋하는 컴포넌트
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 경로가 변경될 때마다 스크롤을 맨 위로 이동
    // window와 main-content 모두 리셋
    window.scrollTo(0, 0);
    
    // main-content 요소 찾아서 스크롤 리셋
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
    
    // ContentsLayout의 main-content도 확인
    const contentsMainContent = document.querySelector('[class*="main-content"]');
    if (contentsMainContent) {
      contentsMainContent.scrollTop = 0;
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;

