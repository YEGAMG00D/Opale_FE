import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './MainPlacePage.module.css';
import RegionFilter from '../../components/place/RegionFilter';

// 간단한 더미 공연장 데이터. 실제 API 연결 시 대체합니다.
const DUMMY_PLACES = [
  { id: 1, name: '오팔 씨어터 강남', region: '서울', district: '강남' },
  { id: 2, name: '오팔 씨어터 대학로', region: '서울', district: '대학로' },
  { id: 3, name: '오팔 씨어터 수원', region: '경기', district: '수원' },
  { id: 4, name: '오팔 씨어터 부평', region: '인천', district: '부평' },
];

const MainPlacePage = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [selected, setSelected] = useState({ region: '서울', district: '전체' });

  const filteredPlaces = useMemo(() => {
    return DUMMY_PLACES.filter((p) => {
      const regionOk = p.region === selected.region;
      const districtOk = selected.district === '전체' ? true : p.district === selected.district;
      return regionOk && districtOk;
    });
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
              <li key={place.id} className={styles.placeItem}>
                <div className={styles.placeMeta}>
                  <span className={styles.placeName}>{place.name}</span>
                  <span className={styles.placeLoc}>{place.region} · {place.district}</span>
                </div>
                <Link className={styles.detailBtn} to={`/place/${place.id}`}>상세 보기</Link>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
};

export default MainPlacePage;
