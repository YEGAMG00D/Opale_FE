import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styles from './MainPlacePage.module.css';
import RegionFilter from '../../components/place/RegionFilter';
import PlaceApiCard from '../../components/cards/PlaceApiCard';
import PlaceMapView from '../../components/place/PlaceMapView';
import { usePlaceList } from '../../hooks/usePlaceList';
import { useNearbyPlaces } from '../../hooks/useNearbyPlaces';
import opaleSearchIcon from '../../assets/opaleSearchIcon.svg';
import { 
  setActiveTab, 
  setGpsLocation, 
  setSearchCenter, 
  setSearchRadius,
  setMaxSearchRadius,
  setNearbyPlaces,
  clearNearbyPlaces,
  resetPlaceMapState
} from '../../store/placeSlice';

const MainPlacePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const searchRef = useRef(null);
  const activeTab = useSelector((state) => state.place.activeTab);
  const gpsLocation = useSelector((state) => state.place.gpsLocation);
  const searchCenter = useSelector((state) => state.place.searchCenter);
  const searchRadius = useSelector((state) => state.place.searchRadius);
  const maxSearchRadius = useSelector((state) => state.place.maxSearchRadius);
  const nearbyPlacesFromStore = useSelector((state) => state.place.nearbyPlaces);
  const [selected, setSelected] = useState({ region: '전체', district: '전체' });
  const [searchQuery, setSearchQuery] = useState('');
  const mapViewRef = useRef(null); // PlaceMapView의 마커 제거 함수를 저장할 ref
  const [isCreatingMarkers, setIsCreatingMarkers] = useState(false); // 마커 생성 중 상태

  // 페이지 진입 시 지도 상태 초기화 (완전 초기 상태로 리셋)
  // 단, DetailPlacePage에서 돌아온 경우는 초기화하지 않음
  useEffect(() => {
    const isFromDetailPlace = location.state?.fromDetailPlace;
    
    // DetailPlacePage에서 돌아온 경우가 아니면 초기화
    if (!isFromDetailPlace) {
      console.log('🔄 MainPlacePage 마운트 - 지도 상태 초기화');
      
      // 전역 상태 초기화 (GPS 위치는 유지)
      dispatch(resetPlaceMapState());
      
      // 지도에서 모든 마커 제거 (지도가 준비되면)
      const clearAllMarkers = async () => {
        // 약간의 지연을 두어 지도가 준비될 시간을 줌
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (mapViewRef.current && mapViewRef.current.clearMarkers) {
          console.log('🧹 [초기화] 지도에서 모든 마커 제거');
          await mapViewRef.current.clearMarkers();
          console.log('✅ [초기화] 지도 마커 제거 완료');
        }
      };
      
      clearAllMarkers();
    } else {
      console.log('📍 DetailPlacePage에서 돌아옴 - 지도 상태 유지');
    }
  }, [location.pathname, location.state, dispatch, navigate]); // 경로나 state가 변경될 때마다 실행



  const handleTabChange = (tab) => {
    dispatch(setActiveTab(tab));
  };

  /** 검색 제출 */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // 지역목록 탭에서는 검색어만 업데이트 (usePlaceList가 자동으로 재호출됨)
    if (activeTab === 'list') {
      // 검색어가 비어있어도 null로 전달되어 전체 조회됨
      return;
    }
    // 다른 탭에서는 기존 동작 (검색 페이지로 이동)
    if (!searchQuery.trim()) return;
    navigate(`/place/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  /** 현재 지도 중심 좌표로 검색 */
  const handleSearchAtCenter = async (center) => {
    console.log('🔍 [1단계] 공연장 버튼 클릭 - 검색 시작');
    
    // 1단계: 근처 공연장 목록을 전역 상태에서 비우기 (먼저 비워서 마커 생성 방지)
    dispatch(clearNearbyPlaces());
    console.log('📭 [1단계] 근처 공연장 목록 비우기 완료');
    
    // 2단계: 기존 근처 공연장 목록의 마커 제거
    if (mapViewRef.current && mapViewRef.current.clearMarkers) {
      console.log('🧹 [2단계] 기존 마커 제거 시작');
      await mapViewRef.current.clearMarkers();
      console.log('✅ [2단계] 기존 마커 제거 완료');
    }
    
    // 마커가 완전히 제거되도록 약간의 지연 추가
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // center에 radius가 포함되어 있으면 반경도 업데이트
    if (center.radius) {
      dispatch(setSearchRadius(center.radius));
      // 현재 줌 레벨 기반 반경에 500m를 더한 값을 최대 반경으로 설정
      const maxRadius = center.radius + 500; // 500m 추가
      dispatch(setMaxSearchRadius(maxRadius));
      console.log('📏 [디버깅] 최대 반경 설정:', {
        currentRadius: center.radius,
        maxRadius: maxRadius,
        maxRadiusKm: (maxRadius / 1000).toFixed(2) + 'km'
      });
    }
    
    // 3단계: searchCenter 업데이트 (이것이 useNearbyPlaces를 트리거함)
    dispatch(setSearchCenter({ latitude: center.latitude, longitude: center.longitude }));
    console.log('📍 [3단계] searchCenter 업데이트 완료 - API 호출 대기');
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

  // 4단계: API 결과를 전역 상태에 저장
  useEffect(() => {
    if (activeTab === 'map' && nearbyPlaces.length > 0) {
      console.log('💾 [4단계] API 결과를 전역 상태에 저장:', nearbyPlaces.length, '개');
      dispatch(setNearbyPlaces(nearbyPlaces));
    }
  }, [nearbyPlaces, activeTab, dispatch]);

  // 검색 결과가 없으면 반경을 늘려서 재검색 (에러가 아닌 경우만)
  useEffect(() => {
    console.log('🔍 [디버깅] 반경 확장 로직 체크:', {
      activeTab,
      searchCenter: searchCenter ? { lat: searchCenter.latitude, lng: searchCenter.longitude } : null,
      nearbyLoading,
      nearbyPlacesCount: nearbyPlaces.length,
      nearbyError,
      searchAttempts,
      searchRadius,
      lastSearchCenter: lastSearchCenter ? { lat: lastSearchCenter.latitude, lng: lastSearchCenter.longitude } : null
    });

    // 에러가 있으면 재검색하지 않음
    if (nearbyError) {
      console.log('⚠️ [디버깅] 검색 중 에러 발생, 재검색 중단:', nearbyError);
      return;
    }

    // 지도 탭이 아니면 스킵
    if (activeTab !== 'map') {
      console.log('ℹ️ [디버깅] 지도 탭이 아니므로 스킵');
      return;
    }

    // searchCenter가 없으면 스킵
    if (!searchCenter) {
      console.log('ℹ️ [디버깅] searchCenter가 없으므로 스킵');
      return;
    }

    // 로딩 중이면 스킵
    if (nearbyLoading) {
      console.log('ℹ️ [디버깅] 로딩 중이므로 스킵');
      return;
    }

    // 검색 좌표가 변경되었으면 시도 횟수 리셋
    if (lastSearchCenter?.latitude !== searchCenter.latitude || 
        lastSearchCenter?.longitude !== searchCenter.longitude) {
      console.log('🔄 [디버깅] 검색 좌표가 변경되어 시도 횟수 리셋');
      setSearchAttempts(0);
      setLastSearchCenter(searchCenter);
      return;
    }

    // 공연장을 찾았으면 시도 횟수 리셋
    if (nearbyPlaces.length > 0) {
      console.log('✅ [디버깅] 공연장을 찾았으므로 시도 횟수 리셋:', nearbyPlaces.length, '개');
      setSearchAttempts(0);
      return;
    }

    // 공연장이 없고 시도 횟수가 3 미만일 때만 반경 확장
    const MIN_RADIUS = 100; // 최소 반경 100m
    
    // 최대 반경이 설정되어 있으면 그 값을 사용, 없으면 기본값 10km 사용
    const MAX_RADIUS = maxSearchRadius || 10000;
    
    // 반경이 이미 최대값 이상이면 더 이상 확장하지 않음
    if (searchRadius >= MAX_RADIUS) {
      console.log('⚠️ [디버깅] 반경이 이미 최대값에 도달했습니다:', {
        currentRadius: searchRadius,
        currentRadiusKm: (searchRadius / 1000).toFixed(2) + 'km',
        maxRadius: MAX_RADIUS,
        maxRadiusKm: (MAX_RADIUS / 1000).toFixed(2) + 'km',
        isViewportBased: !!maxSearchRadius
      });
      return;
    }
    
    // 반경이 비정상적으로 크면 최대값으로 제한
    if (searchRadius > MAX_RADIUS) {
      console.warn('⚠️ [디버깅] 반경이 비정상적으로 큽니다. 최대값으로 제한:', {
        currentRadius: searchRadius,
        maxRadius: MAX_RADIUS
      });
      dispatch(setSearchRadius(MAX_RADIUS));
      return;
    }
    
    if (nearbyPlaces.length === 0 && searchAttempts < 3) {
      console.log('🔄 [디버깅] 공연장이 없어서 반경 확장 시도:', {
        currentRadius: searchRadius,
        currentRadiusKm: (searchRadius / 1000).toFixed(2) + 'km',
        attempts: searchAttempts,
        maxAttempts: 3
      });
      
      // 반경을 2배로 늘려서 재검색 (최대 반경 제한)
      let newRadius = searchRadius * 2;
      
      // 최대 반경을 초과하지 않도록 제한
      if (newRadius > MAX_RADIUS) {
        newRadius = MAX_RADIUS;
        console.log('⚠️ [디버깅] 계산된 반경이 최대값을 초과하여 최대값으로 제한:', newRadius);
      }
      
      console.log(`🔄 공연장이 없어서 반경을 ${searchRadius}m → ${newRadius}m로 확장하여 재검색`);
      dispatch(setSearchRadius(newRadius));
      setSearchAttempts(prev => prev + 1);
    } else if (searchAttempts >= 3) {
      console.log('⚠️ [디버깅] 최대 시도 횟수(3회)에 도달하여 반경 확장 중단');
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

  /** 지역목록 탭: 공연장 목록 조회 (검색어, 지역 필터 적용) */
  const areaForApi = selected.region === '전체' ? null : selected.region;
  const keywordForApi = searchQuery.trim() || null;
  
  const {
    places: listPlaces,
    sentinelRef,
    loading: listLoading,
    totalCount,
  } = usePlaceList({
    area: areaForApi, // 지역 필터
    keyword: keywordForApi, // 검색어
    sortType: "이름순",
    enabled: activeTab === 'list', // 지역목록 탭일 때만 활성화
  });

  // 마커 생성 중 상태 추적
  useEffect(() => {
    if (activeTab === 'map' && mapViewRef.current) {
      const checkCreatingMarkers = () => {
        const creating = mapViewRef.current?.isCreatingMarkers || false;
        setIsCreatingMarkers(creating);
      };
      
      // 초기 확인
      checkCreatingMarkers();
      
      // 주기적으로 확인 (마커 생성이 완료될 때까지)
      const interval = setInterval(checkCreatingMarkers, 100);
      
      return () => clearInterval(interval);
    } else {
      setIsCreatingMarkers(false);
    }
  }, [activeTab, nearbyPlacesFromStore.length]); // places가 변경될 때마다 확인

  // 현재 탭에 따라 사용할 데이터 결정
  // 지도 탭에서는 전역 상태의 nearbyPlaces 사용 (순서 보장을 위해)
  const places = activeTab === 'map' ? nearbyPlacesFromStore : listPlaces;
  const loading = activeTab === 'map' ? (nearbyLoading || isCreatingMarkers) : listLoading;

  return (
    <div className={`${styles.container} ${activeTab === 'map' ? styles.mapMode : ''}`}>
      {/* {activeTab === 'list' && <h1>공연장</h1>} */}
      
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
              <div className={styles.loadingSpinner}>
                <div className={styles.spinnerDot}></div>
                <div className={styles.spinnerDot}></div>
                <div className={styles.spinnerDot}></div>
              </div>
              <p className={styles.loadingText}>위치를 확인하고 근처 공연장을 불러오는 중...</p>
            </div>
          )}
          <PlaceMapView 
            ref={mapViewRef}
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
                <img src={opaleSearchIcon} alt="검색" className={styles.searchIconImg} />
              </button>
            </form>
          </div>

          <RegionFilter 
            onChange={setSelected} 
            selectedRegion={selected.region}
          />

          <div className={styles.resultHeader}>
            <span className={styles.resultFilter}>
              {selected.region === '전체' ? '전체' : selected.region}
              {searchQuery && ` / ${searchQuery}`}
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
