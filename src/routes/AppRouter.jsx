import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import MainHomePage from '../pages/home/MainHomePage';
import LaunchingPage from '../pages/exception/LaunchingPage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 메인 레이아웃이 적용되는 라우트들 */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<MainHomePage />} />
        </Route>
        
        {/* 레이아웃이 없는 독립 페이지들 */}
        <Route path="/launching" element={<LaunchingPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
