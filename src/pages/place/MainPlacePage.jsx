import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styles from './MainPlacePage.module.css';
import RegionFilter from '../../components/place/RegionFilter';
import PlaceApiCard from '../../components/cards/PlaceApiCard';
import PlaceMapView from '../../components/place/PlaceMapView';
import { usePlaceList } from '../../hooks/usePlaceList';
import { setActiveTab } from '../../store/placeSlice';

const MainPlacePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchRef = useRef(null);
  const activeTab = useSelector((state) => state.place.activeTab);
  const [selected, setSelected] = useState({ region: '서울', district: '전체' });
  const [searchQuery, setSearchQuery] = useState('');

  const handleTabChange = (tab) => {
    dispatch(setActiveTab(tab));
  };

  /** 검색 제출 */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/place/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  /** API 연동 */
  const { places, sentinelRef, loading, totalCount } = usePlaceList({
    area: null, // 전체 조회
    keyword: null,
    sortType: "이름순",
  });

  return (
    <div className={`${styles.container} ${activeTab === 'map' ? styles.mapMode : ''}`}>
      {activeTab === 'list' && <h1>공연장</h1>}
      
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
        <div className={styles.mapWrapper}>
          <PlaceMapView places={places} />
        </div>
      )}

      {/* 지역목록 탭 내용 */}
      {activeTab === 'list' && (
        <div className={styles.listContainer}>
          {/* 검색창 */}
          <div className={styles.searchSection} ref={searchRef}>
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

export default MainPlacePage;
