import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/userSlice";
import { fetchFavoritePerformances, togglePerformanceFavorite } from "../../../api/favoriteApi";
import { fetchMyInfo } from "../../../api/userApi";
import PerformanceApiCard from "../../../components/cards/PerformanceApiCard";
import styles from "./MainMyPage.module.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// 이미지 URL 처리 헬퍼 함수
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // 이미 절대 URL인 경우 그대로 반환
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // 상대 경로인 경우 API base URL과 결합
  if (imageUrl.startsWith('/')) {
    return `${API_BASE_URL}${imageUrl}`;
  }
  
  // 그 외의 경우 그대로 반환 (이미지 이름 등)
  return imageUrl;
};

const MainMyPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [favoritePerformances, setFavoritePerformances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  // 사용자 정보 및 관심 공연 목록 가져오기
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // 사용자 정보 가져오기
        try {
          const info = await fetchMyInfo();
          setUserInfo(info);
        } catch (err) {
          console.error("사용자 정보 조회 실패:", err);
        }
        // 관심 공연 목록 가져오기
        const performances = await fetchFavoritePerformances();
        setFavoritePerformances(performances || []);
      } catch (err) {
        console.error("데이터 조회 실패:", err);
        setFavoritePerformances([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /** ✅ 로그아웃 */
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    
    dispatch(logout());
    navigate("/");
  };

  /** 관심 공연 토글 핸들러 */
  const handleFavoriteToggle = async (performanceId) => {
    try {
      const result = await togglePerformanceFavorite(performanceId);
      
      // API 결과에 따라 목록에서 제거 (false면 관심 해제)
      if (result === false) {
        setFavoritePerformances((prev) =>
          prev.filter(
            (p) => (p.id || p.performanceId) !== performanceId
          )
        );
      } else {
        // 관심 추가된 경우 목록 새로고침
        const updatedPerformances = await fetchFavoritePerformances();
        setFavoritePerformances(updatedPerformances || []);
      }
    } catch (err) {
      console.error("관심 공연 토글 실패:", err);
      alert("관심 공연 변경에 실패했습니다.");
    }
  };

  // 최근 3개만 표시
  const recentFavorites = favoritePerformances.slice(0, 3);

  return (
    <div className={styles.container}>
      {/* 프로필 섹션 */}
      <div className={styles.profileSection}>
        <div className={styles.profileImage}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ffb6c1" strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div className={styles.profileName}>
          {userInfo?.nickname || '사용자'}
        </div>
      </div>

      {/* 메뉴 리스트 */}
      <div className={styles.menuList}>
        <Link to="/my/update-info" className={styles.menuItem}>
          <div className={styles.menuIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
          </div>
          <span className={styles.menuText}>정보 변경</span>
          <div className={styles.menuArrow}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </Link>

        <Link to="/my/favorite-performances" className={styles.menuItem}>
          <div className={styles.menuIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <span className={styles.menuText}>관심 공연</span>
          <div className={styles.menuArrow}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </Link>

        <Link to="/my/tickets" className={styles.menuItem}>
          <div className={styles.menuIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <span className={styles.menuText}>티켓 등록</span>
          <div className={styles.menuArrow}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </Link>

        <button onClick={handleLogout} className={styles.menuItem}>
          <div className={styles.menuIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </div>
          <span className={styles.menuText}>로그아웃</span>
          <div className={styles.menuArrow}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </button>
      </div>

      {/* 관심 공연 미리보기 섹션 */}
      {favoritePerformances.length > 0 && (
        <div className={styles.favoritePreviewSection}>
          <div className={styles.previewHeader}>
            <h2 className={styles.previewTitle}>관심 공연</h2>
            {favoritePerformances.length > 3 && (
              <button
                className={styles.moreButton}
                onClick={() => navigate("/my/favorite-performances")}
              >
                더보기
              </button>
            )}
          </div>
          {loading ? (
            <div className={styles.loading}>로딩 중...</div>
          ) : (
            <div className={styles.performanceGrid}>
              {recentFavorites.map((performance) => {
                // 이미지 URL 처리
                const imageUrl = getImageUrl(
                  performance.posterImage || 
                  performance.poster || 
                  performance.image
                );
                
                return (
                  <PerformanceApiCard
                    key={performance.id || performance.performanceId}
                    id={performance.id || performance.performanceId}
                    image={imageUrl}
                    title={performance.title || performance.performanceName}
                    venue={performance.venue || performance.venueName}
                    startDate={performance.startDate || performance.startDateStr}
                    endDate={performance.endDate || performance.endDateStr}
                    rating={performance.rating || performance.averageRating}
                    reviewCount={performance.reviewCount || performance.reviewCount}
                    keywords={performance.keywords || []}
                    genre={performance.genre || performance.category}
                    isFavorite={true}
                    onFavoriteToggle={handleFavoriteToggle}
                    onClick={(id) => navigate(`/culture/${id}`)}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MainMyPage;
