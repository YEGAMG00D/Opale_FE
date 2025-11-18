import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styles from './MainPlacePage.module.css';
import RegionFilter from '../../components/place/RegionFilter';
import PlaceApiCard from '../../components/cards/PlaceApiCard';
import PlaceMapView from '../../components/place/PlaceMapView';
import { usePlaceList } from '../../hooks/usePlaceList';
import { useNearbyPlaces } from '../../hooks/useNearbyPlaces';
import { 
  setActiveTab, 
  setGpsLocation, 
  setSearchCenter, 
  setSearchRadius 
} from '../../store/placeSlice';

const MainPlacePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchRef = useRef(null);
  const activeTab = useSelector((state) => state.place.activeTab);
  const gpsLocation = useSelector((state) => state.place.gpsLocation);
  const searchCenter = useSelector((state) => state.place.searchCenter);
  const searchRadius = useSelector((state) => state.place.searchRadius);
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

  /** 현재 지도 중심 좌표로 검색 */
  const handleSearchAtCenter = (center) => {
    // center에 radius가 포함되어 있으면 반경도 업데이트
    if (center.radius) {
      dispatch(setSearchRadius(center.radius));
    }
    dispatch(setSearchCenter({ latitude: center.latitude, longitude: center.longitude }));
  };

  /** 지도 탭: 근처 공연장 조회 (GPS 기반 또는 검색 중심 좌표 기반) */
  // 처음 진입 시에는 API 호출하지 않음 (searchCenter가 있을 때만 호출)
  const [searchAttempts, setSearchAttempts] = useState(0); // 검색 시도 횟수 (반경 확장용)
  const [lastSearchCenter, setLastSearchCenter] = useState(null); // 마지막 검색 좌표
  
  const {
    places: nearbyPlaces,
    loading: nearbyLoading,
    error: nearbyError,
    userLocation: detectedLocation, // useNearbyPlaces에서 감지한 위치
  } = useNearbyPlaces({
    enabled: activeTab === 'map' && searchCenter !== null, // 지도 탭이고 검색 기준 좌표가 있을 때만 활성화
    latitude: searchCenter?.latitude, // 검색 중심 좌표가 있으면 사용
    longitude: searchCenter?.longitude, // 검색 중심 좌표가 있으면 사용
    radius: searchRadius, // 전역 상태의 반경 사용
    sortType: "거리순",
  });

  // 검색 결과가 없으면 반경을 늘려서 재검색 (에러가 아닌 경우만)
  useEffect(() => {
    // 에러가 있으면 재검색하지 않음
    if (nearbyError) {
      console.log('⚠️ 검색 중 에러 발생, 재검색 중단');
      return;
    }

    if (activeTab === 'map' && searchCenter && !nearbyLoading && nearbyPlaces.length === 0 && searchAttempts < 3) {
      // 검색 좌표가 변경되었으면 시도 횟수 리셋
      if (lastSearchCenter?.latitude !== searchCenter.latitude || 
          lastSearchCenter?.longitude !== searchCenter.longitude) {
        setSearchAttempts(0);
        setLastSearchCenter(searchCenter);
        return;
      }
      
      // 반경을 2배로 늘려서 재검색
      const newRadius = searchRadius * 2;
      console.log(`🔄 공연장이 없어서 반경을 ${searchRadius}m → ${newRadius}m로 확장하여 재검색`);
      dispatch(setSearchRadius(newRadius));
      setSearchAttempts(prev => prev + 1);
    } else if (nearbyPlaces.length > 0) {
      // 공연장을 찾았으면 시도 횟수 리셋
      setSearchAttempts(0);
    }
  }, [nearbyPlaces, nearbyLoading, nearbyError, searchCenter, searchRadius, searchAttempts, lastSearchCenter, activeTab, dispatch]);

  // GPS 위치를 전역 상태에 저장 (처음 감지했을 때만)
  // useNearbyPlaces가 비활성화되어 있어도 GPS 위치는 가져와야 함
  useEffect(() => {
    // GPS 위치가 없고 지도 탭일 때만 GPS 위치 가져오기
    if (activeTab === 'map' && !gpsLocation) {
      const getGpsLocation = async () => {
        try {
          const { getCurrentLocation, getDefaultLocation } = await import('../../utils/geolocation');
          try {
            const location = await getCurrentLocation();
            dispatch(setGpsLocation({ latitude: location.latitude, longitude: location.longitude }));
            console.log('💾 GPS 위치를 전역 상태에 저장:', location);
          } catch (gpsError) {
            // GPS 실패 시 기본 위치 사용
            const defaultLoc = getDefaultLocation();
            dispatch(setGpsLocation(defaultLoc));
            console.warn('⚠️ GPS 실패, 기본 위치 사용:', defaultLoc);
          }
        } catch (err) {
          console.error('❌ GPS 위치 가져오기 실패:', err);
        }
      };
      getGpsLocation();
    }
  }, [activeTab, gpsLocation, dispatch]);

  /** 지역목록 탭: 전체 공연장 목록 조회 */
  const {
    places: listPlaces,
    sentinelRef,
    loading: listLoading,
    totalCount,
  } = usePlaceList({
    area: null, // 전체 조회
    keyword: null,
    sortType: "이름순",
    enabled: activeTab === 'list', // 지역목록 탭일 때만 활성화
  });

  // 현재 탭에 따라 사용할 데이터 결정
  const places = activeTab === 'map' ? nearbyPlaces : listPlaces;
  const loading = activeTab === 'map' ? nearbyLoading : listLoading;

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
          {nearbyError && (
            <div className={styles.errorMessage}>
              {nearbyError}
            </div>
          )}
          {loading && (
            <div className={styles.loadingMessage}>
              위치를 확인하고 근처 공연장을 불러오는 중...
            </div>
          )}
          <PlaceMapView 
            places={places} 
            userLocation={gpsLocation} 
            searchCenter={searchCenter}
            searchRadius={searchRadius}
            onSearchAtCenter={handleSearchAtCenter}
          />
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
