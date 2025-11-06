import React, { useMemo, useState } from 'react';
import styles from './MainPlacePage.module.css';
import RegionFilter from '../../components/place/RegionFilter';
import PlaceCard from '../../components/place/PlaceCard';
import { PLACE_DATA, getPlacesByDistrict } from '../../data/placeData';

const MainPlacePage = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [selected, setSelected] = useState({ region: '서울', district: '전체' });

  const filteredPlaces = useMemo(() => {
    // 서울시가 선택된 경우 관할구역 필터링
    if (selected.region === '서울') {
      if (selected.district === '전체') {
        // 서울 전체 공연장 반환
        return Object.values(PLACE_DATA).filter(p => p.district.includes('구'));
      } else {
        // 선택된 관할구역의 공연장만 반환
        return getPlacesByDistrict(selected.district);
      }
    }
    
    // 다른 지역 선택 시 (향후 확장용)
    // 실제 API 연동 시 여기에 다른 지역 데이터 필터링 로직 추가
    return [];
  }, [selected]);

  return (
    <div className={styles.container}>
      <h1>공연장</h1>
      
      {/* 탭 네비게이션 */}
      <div className={styles.tabContainer}>
        <button 
          className={`${styles.tab} ${activeTab === 'map' ? styles.active : ''}`}
          onClick={() => setActiveTab('map')}
        >
          지도
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'list' ? styles.active : ''}`}
          onClick={() => setActiveTab('list')}
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
              {selected.region} {selected.district !== '전체' ? `> ${selected.district}` : ''}
            </span>
            <span className={styles.resultCount}>총 {filteredPlaces.length}곳</span>
          </div>

          <ul className={styles.placeList}>
            {filteredPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                id={place.id}
                name={place.name}
                region="서울"
                district={place.district}
              />
            ))}
          </ul>
        </div>
      )}

    </div>
  );
};

export default MainPlacePage;
