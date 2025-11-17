import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styles from './MainPlacePage.module.css';
import RegionFilter from '../../components/place/RegionFilter';
import PlaceApiCard from '../../components/cards/PlaceApiCard';
import { usePlaceList } from '../../hooks/usePlaceList';
import { setActiveTab } from '../../store/placeSlice';

const SearchPlacePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  
  // URL에서 검색어 가져오기 (공백 제거)
  const keywordFromUrl = (searchParams.get("q") || "").trim();

  const activeTab = useSelector((state) => state.place.activeTab);
  const [selected, setSelected] = useState({ region: '서울', district: '전체' });
  const [searchQuery, setSearchQuery] = useState(keywordFromUrl);

  /** URL 검색어 변경 시 검색창 업데이트 */
  useEffect(() => {
    const keyword = (searchParams.get("q") || "").trim();
    setSearchQuery(keyword);
  }, [searchParams]);

  const handleTabChange = (tab) => {
    dispatch(setActiveTab(tab));
  };

  /** 검색 제출 */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    navigate(`/place/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  /** API 연동 - keyword 포함 */
  const { places, sentinelRef, loading, totalCount } = usePlaceList({
    area: null, // 전체 조회
    keyword: keywordFromUrl && keywordFromUrl.length > 0 ? keywordFromUrl : null,
    sortType: "이름순",
  });

  return (
    <div className={styles.container}>
      {/* 검색 결과 헤더 */}
      <div style={{ padding: "16px 24px 0", marginTop: "0" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#000000", margin: "0 0 8px 0" }}>
          공연장 검색 결과
        </h2>
      </div>

      {/* 탭 네비게이션 */}
      <div className={styles.tabContainer}>
        <button 
          className={`${styles.tab} ${activeTab === 'map' ? styles.active : ''}`}
          onClick={() => handleTabChange('map')}
        >
          지도
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'list' ? styles.active : ''}`}
          onClick={() => handleTabChange('list')}
        >
          지역목록
        </button>
      </div>

      {/* 지도 탭 내용 */}
      {activeTab === 'map' && (
        <div className={styles.mapContainer}>
          <div className={styles.mapPlaceholder}>
            <div className={styles.mapIcon}>🗺️</div>
            <p className={styles.mapText}>지도 서비스 준비 중</p>
            <p className={styles.mapSubText}>곧 공연장 위치를 확인할 수 있습니다</p>
          </div>
        </div>
      )}

      {/* 지역목록 탭 내용 */}
      {activeTab === 'list' && (
        <div className={styles.listContainer}>
          {/* 검색창 */}
          <div className={styles.searchSection}>
            <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
              <input
                type="text"
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="극장명을 입력해주세요"
              />
              <button type="submit" className={styles.searchIcon}>
                🔍
              </button>
            </form>
          </div>

          <RegionFilter onChange={setSelected} />

          <div className={styles.resultHeader}>
            <span className={styles.resultFilter}>
              전체
            </span>
            <span className={styles.resultCount}>총 {totalCount}곳</span>
          </div>

          <ul className={styles.placeList}>
            {places.map((place, index) => (
              <PlaceApiCard
                key={place.id + "_" + index}
                {...place}
              />
            ))}
          </ul>

          <div ref={sentinelRef} style={{ height: 40 }} />
          {loading && <p style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>불러오는 중...</p>}
        </div>
      )}

    </div>
  );
};

export default SearchPlacePage;
