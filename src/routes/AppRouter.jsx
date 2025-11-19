import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ContentsLayout from '../layouts/ContentsLayout';

// 홈 페이지
import MainHomePage from '../pages/home/MainHomePage';

// 인증 관련 페이지 (레이아웃 없음)
import LoginPage from '../pages/user/auth/LoginPage';
import SignupPage from '../pages/user/auth/SignupPage';
import WelcomePage from '../pages/user/auth/WelcomePage';
import NewPasswordPage from '../pages/user/auth/NewPasswordPage';
import SuccessedNewPasswordPage from '../pages/user/auth/SuccessedNewPasswordPage';

// 마이페이지 관련
import MainMyPage from '../pages/user/mypage/MainMyPage';
import UpdateMyInfoPage from '../pages/user/mypage/UpdateMyInfoPage';
import ChangePasswordPage from '../pages/user/mypage/ChangePasswordPage';
import FavoriteCulturePerformancePage from '../pages/user/mypage/FavoriteCulturePerformancePage';
import FavoriteReviewPage from '../pages/user/mypage/FavoriteReviewPage';
import MyReviewPage from '../pages/user/mypage/MyReviewPage';
import BookingPerformancePage from '../pages/user/mypage/BookingPerformancePage';
import BookingPerformanceRegistrationPage from '../pages/user/mypage/BookingPerformanceRegistrationPage';
import MyPageTicketPage from '../pages/user/mypage/MyTicketPage';
import TicketRegisterPage from '../pages/user/mypage/TicketRegisterPage';

// 공연 관련
import MainCulturePage from '../pages/culture/MainCulturePage';
import SearchCulturePage from '../pages/culture/SearchCulturePage';
import DetailPerformancePage from '../pages/culture/DetailPerformancePage';
import PerformanceReviewWritingPage from '../pages/culture/PerformanceReviewWritingPage';

// 공연장 관련
import MainPlacePage from '../pages/place/MainPlacePage';
import SearchPlacePage from '../pages/place/SearchPlacePage';
import DetailPlacePage from '../pages/place/DetailPlacePage';

// 채팅 관련
import MainChatPage from '../pages/chat/MainChatPage';
import SearchChatPage from '../pages/chat/SearchChatPage';
import RoomPage from '../pages/chat/RoomPage';

// 추천
import MainRecommandPage from '../pages/recommand/MainRecommandPage';
import PerformanceSignalPage from '../pages/recommand/PerformanceSignalPage';
import TicketRegistrationPage from '../pages/recommand/TicketRegistrationPage';
import ReviewWritingPage from '../pages/recommand/ReviewWritingPage';
import MyTicketPage from '../pages/recommand/MyTicketPage';
import KeywordPerformancePage from '../pages/recommand/KeywordPerformancePage';

// 예외 페이지 (레이아웃 없음)
import LaunchingPage from '../pages/exception/LaunchingPage';
import ErrorPage from '../pages/exception/ErrorPage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 레이아웃이 없는 독립 페이지들 */}
        <Route path="/launching" element={<LaunchingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signup/welcome" element={<WelcomePage />} />
        <Route path="/new-password" element={<NewPasswordPage />} />
        <Route path="/new-password/success" element={<SuccessedNewPasswordPage />} />
        <Route path="*" element={<ErrorPage />} />

        {/* 메인 레이아웃이 적용되는 라우트들 */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<MainHomePage />} />
          
          {/* 마이페이지 관련 */}
          <Route path="my" element={<MainMyPage />} />
          <Route path="my/update-info" element={<UpdateMyInfoPage />} />
          <Route path="my/change-password" element={<ChangePasswordPage />} />
          <Route path="my/favorite-performances" element={<FavoriteCulturePerformancePage />} />
          <Route path="my/favorite-reviews" element={<FavoriteReviewPage />} />
          <Route path="my/my-reviews" element={<MyReviewPage />} />
          <Route path="my/booking-performances" element={<BookingPerformancePage />} />
          <Route path="my/booking-performances/register" element={<BookingPerformanceRegistrationPage />} />
          <Route path="my/tickets" element={<MyPageTicketPage />} />
          <Route path="my/tickets/register" element={<TicketRegisterPage />} />
          <Route path="my/tickets/edit" element={<TicketRegisterPage />} />

          {/* 공연 관련 */}
          <Route path="culture" element={<MainCulturePage />} />
          <Route path="culture/search" element={<SearchCulturePage />} />
          {/* <Route path="culture/:id" element={<DetailPerformancePage />} /> */}
          {/* <Route path="culture/review" element={<PerformanceReviewWritingPage />} /> */}

          {/* 공연장 관련 */}
          <Route path="place" element={<MainPlacePage />} />
          <Route path="place/search" element={<SearchPlacePage />} />
          {/* <Route path="place/:id" element={<DetailPlacePage />} /> */}

          {/* 채팅 관련 */}
          <Route path="chat" element={<MainChatPage />} />
          <Route path="chat/search" element={<SearchChatPage />} />
          {/* <Route path="chat/:id" element={<RoomPage />} /> */}

          {/* 추천 */}
          <Route path="recommend" element={<MainRecommandPage />} />
          <Route path="recommend/signal" element={<PerformanceSignalPage />} />
          <Route path="recommend/ticket" element={<TicketRegistrationPage />} />
          <Route path="recommend/review" element={<ReviewWritingPage />} />
          <Route path="recommend/my-ticket" element={<MyTicketPage />} />
          <Route path="recommend/keyword" element={<KeywordPerformancePage />} />
        </Route>

        {/* 콘텐츠 레이아웃이 적용되는 라우트들 (푸터 없음) */}
        <Route path="/culture/:id" element={<ContentsLayout><DetailPerformancePage /></ContentsLayout>} />
        <Route path="/culture/review" element={<ContentsLayout><PerformanceReviewWritingPage /></ContentsLayout>} />
        <Route path="/place/:id" element={<ContentsLayout><DetailPlacePage /></ContentsLayout>} />
        <Route path="/chat/:id" element={<ContentsLayout><RoomPage /></ContentsLayout>} />


      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
