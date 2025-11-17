import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './MainPlacePage.module.css';
import RegionFilter from '../../components/place/RegionFilter';
import PlaceApiCard from '../../components/cards/PlaceApiCard';
import { usePlaceList } from '../../hooks/usePlaceList';
import { setActiveTab } from '../../store/placeSlice';

const MainPlacePage = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.place.activeTab);
  const [selected, setSelected] = useState({ region: '서울', district: '전체' });

  const handleTabChange = (tab) => {
    dispatch(setActiveTab(tab));
  };

  /** API 연동 */
  const { places, sentinelRef, loading, totalCount } = usePlaceList({
    area: null, // 전체 조회
    keyword: null,
    sortType: "이름순",
  });

  return (
    <div className={styles.container}>
      <h1>공연장</h1>
      
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
