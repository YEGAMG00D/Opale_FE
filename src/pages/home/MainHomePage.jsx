import React from 'react';

const MainHomePage = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff'
    }}>
      <h1>홈 페이지</h1>
      <p>여기에 홈 페이지 내용이 들어갑니다.</p>
      <div style={{ height: '200vh' }}>
        <p>스크롤 테스트용 긴 콘텐츠입니다.</p>
        <p>본문 영역만 스크롤되어야 합니다.</p>
        <p>Header와 Footer는 고정되어 있어야 합니다.</p>
      </div>
    </div>
  );
};

export default MainHomePage;
