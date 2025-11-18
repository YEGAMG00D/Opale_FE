import React, { useEffect, useRef, useState } from 'react';
import styles from './PlaceMapView.module.css';
import { loadNaverMapScript } from '../../utils/loadNaverMap';

/**
 * 여러 공연장 위치를 표시하는 네이버 지도 컴포넌트
 * @param {Array} places - 공연장 배열 [{ id, name, latitude, longitude, address }, ...]
 * @param {Object} userLocation - GPS 사용자 위치 { latitude, longitude }
 * @param {Object} searchCenter - 검색 기준 좌표 { latitude, longitude }
 * @param {number} searchRadius - 검색 반경 (미터)
 * @param {Function} onSearchAtCenter - 현재 지도 중심 좌표로 검색하는 콜백 함수
 * @param {string} clientId - 네이버 지도 API Client ID (선택사항, 환경변수에서 가져옴)
 */
const PlaceMapView = ({ places = [], userLocation = null, searchCenter = null, searchRadius = 0, onSearchAtCenter, clientId }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowsRef = useRef([]);
  const userMarkerRef = useRef(null); // GPS 위치 마커 (파란색)
  const searchCenterMarkerRef = useRef(null); // 검색 기준 좌표 마커 (주황색)
  const searchRadiusCircleRef = useRef(null); // 검색 반경 원
  const scaleControlRef = useRef(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(null);

  // 지도 초기화 (한 번만 실행)
  useEffect(() => {
    // Client ID 가져오기 (환경변수 또는 props)
    const naverClientId = clientId || import.meta.env.VITE_NAVER_MAP_CLIENT_ID;
    
    // Client ID 검증
    if (!naverClientId || naverClientId === 'YOUR_CLIENT_ID' || naverClientId.trim() === '') {
      console.error('❌ 네이버 지도 API Client ID가 설정되지 않았습니다.');
      setMapError('네이버 지도 API Client ID가 설정되지 않았습니다. .env 파일에 VITE_NAVER_MAP_CLIENT_ID를 설정해주세요.');
      setMapLoading(false);
      return;
    }

    // 공식 문서에 따른 인증 실패 핸들러 설정
    window.navermap_authFailure = function () {
      console.error('❌ 네이버 지도 API 인증 실패');
      setMapError('네이버 지도 API 인증이 실패했습니다.');
      setMapLoading(false);
    };

    // 네이버 지도 API 스크립트 로드 및 지도 초기화
    const initMap = async () => {
      try {
        setMapLoading(true);
        setMapError(null);

        await new Promise(resolve => setTimeout(resolve, 0));

        if (!mapRef.current) {
          throw new Error('지도 컨테이너를 찾을 수 없습니다.');
        }

        // 스크립트 로드
        await loadNaverMapScript(naverClientId);

        if (!window.naver || !window.naver.maps) {
          throw new Error('네이버 지도 API가 로드되지 않았습니다.');
        }

        if (!mapRef.current) {
          throw new Error('지도 컨테이너를 찾을 수 없습니다.');
        }

        // 기본 위치로 지도 초기화 (마커는 별도 useEffect에서 처리)
        const defaultCenter = new window.naver.maps.LatLng(37.5665, 126.9780);
        const mapOptions = {
          center: defaultCenter,
          zoom: 11,
          zoomControl: true, // 줌 컨트롤 표시
          zoomControlOptions: {
            position: window.naver.maps.Position.TOP_RIGHT, // 우측 상단에 줌 컨트롤 배치 (CSS로 위치 조정)
          },
          draggable: true, // 드래그 활성화
          scrollWheelZoom: true, // 마우스 휠 줌 활성화
          pinchZoom: true, // 핀치 줌 활성화
          keyboardShortcuts: true, // 키보드 단축키 활성화
          disableDoubleClickZoom: false, // 더블클릭 줌 활성화
          disableDoubleClick: false, // 더블클릭 활성화
        };

        // 지도 생성
        const map = new window.naver.maps.Map(mapRef.current, mapOptions);
        mapInstanceRef.current = map;

        // 줌 컨트롤이 제대로 표시되도록 확인
        // 네이버 지도 API v3에서는 zoomControl: true로 설정하면 자동으로 추가되지만,
        // 수동으로도 추가할 수 있습니다
        try {
          // 줌 컨트롤이 없으면 수동으로 추가
          if (!map.controls || !map.controls[window.naver.maps.Position.TOP_RIGHT] || 
              map.controls[window.naver.maps.Position.TOP_RIGHT].length === 0) {
            const zoomControl = new window.naver.maps.ZoomControl({
              position: window.naver.maps.Position.TOP_RIGHT,
            });
            if (!map.controls) {
              map.controls = {};
            }
            if (!map.controls[window.naver.maps.Position.TOP_RIGHT]) {
              map.controls[window.naver.maps.Position.TOP_RIGHT] = [];
            }
            map.controls[window.naver.maps.Position.TOP_RIGHT].push(zoomControl);
          }
        } catch (zoomError) {
          console.warn('⚠️ 줌 컨트롤 추가 실패:', zoomError);
          // 줌 컨트롤 실패해도 지도는 계속 사용 가능
        }

        // 축적(Scale) 컨트롤 추가
        try {
          const scaleControl = new window.naver.maps.ScaleControl({
            position: window.naver.maps.Position.BOTTOM_RIGHT,
          });
          // controls가 자동으로 초기화되지 않을 수 있으므로 안전하게 처리
          if (map.controls && map.controls[window.naver.maps.Position.BOTTOM_RIGHT]) {
            map.controls[window.naver.maps.Position.BOTTOM_RIGHT].push(scaleControl);
          } else {
            // controls가 없으면 직접 추가
            if (!map.controls) {
              map.controls = {};
            }
            map.controls[window.naver.maps.Position.BOTTOM_RIGHT] = [scaleControl];
          }
          scaleControlRef.current = scaleControl;
        } catch (scaleError) {
          console.warn('⚠️ 축적 컨트롤 추가 실패:', scaleError);
          // 축적 컨트롤 실패해도 지도는 계속 사용 가능
        }

        console.log('🗺️ 지도 초기화 완료');

        setMapLoading(false);
      } catch (err) {
        console.error('네이버 지도 초기화 실패:', err);
        setMapError(err.message || '지도를 불러오는 중 오류가 발생했습니다.');
        setMapLoading(false);
      }
    };

    initMap();

    // cleanup 함수
    return () => {
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
        userMarkerRef.current = null;
      }
      if (searchCenterMarkerRef.current) {
        searchCenterMarkerRef.current.setMap(null);
        searchCenterMarkerRef.current = null;
      }
      if (scaleControlRef.current) {
        scaleControlRef.current = null;
      }
      if (window.navermap_authFailure) {
        delete window.navermap_authFailure;
      }
    };
  }, [clientId]); // clientId만 의존성으로 (지도는 한 번만 초기화)

  // places와 userLocation이 변경될 때 마커 업데이트 및 지도 조정
  useEffect(() => {
    if (!mapInstanceRef.current || !window.naver || !window.naver.maps) {
      return;
    }

    const map = mapInstanceRef.current;
    console.log('🗺️ 마커 업데이트 시작, places 개수:', places.length);

    // 기존 마커와 정보창 정리
    markersRef.current.forEach(marker => {
      if (marker) marker.setMap(null);
    });
    infoWindowsRef.current.forEach(infoWindow => {
      if (infoWindow) infoWindow.close();
    });
    markersRef.current = [];
    infoWindowsRef.current = [];

    // 기존 마커 제거
    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
      userMarkerRef.current = null;
    }
    if (searchCenterMarkerRef.current) {
      searchCenterMarkerRef.current.setMap(null);
      searchCenterMarkerRef.current = null;
    }
    if (searchRadiusCircleRef.current) {
      searchRadiusCircleRef.current.setMap(null);
      searchRadiusCircleRef.current = null;
    }

    // 유효한 위치 정보가 있는 공연장만 필터링
    const validPlaces = places.filter(
      place => place.latitude && place.longitude && 
      !isNaN(parseFloat(place.latitude)) && 
      !isNaN(parseFloat(place.longitude))
    );

    console.log('✅ 유효한 공연장 개수:', validPlaces.length);

    // GPS 위치 마커 생성 (파란색) - 항상 표시
    let gpsPosition = null;
    if (userLocation && userLocation.latitude && userLocation.longitude) {
      gpsPosition = new window.naver.maps.LatLng(
        userLocation.latitude,
        userLocation.longitude
      );

      // GPS 위치 마커 (파란색 원형 마커)
      const gpsMarker = new window.naver.maps.Marker({
        position: gpsPosition,
        map: map,
        icon: {
          content: `
            <div style="
              width: 18px;
              height: 18px;
              background-color: #4285F4;
              border: 2px solid #FFFFFF;
              border-radius: 50%;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            "></div>
          `,
          anchor: window.naver && window.naver.maps && window.naver.maps.Point 
            ? new window.naver.maps.Point(9, 9)
            : undefined,
        },
        zIndex: 1000,
        title: '내 위치 (GPS)',
      });

      userMarkerRef.current = gpsMarker;
      console.log('📍 GPS 위치 마커 생성:', { latitude: userLocation.latitude, longitude: userLocation.longitude });
    }

    // 검색 기준 좌표 마커 생성 (주황색) - searchCenter가 있을 때만
    let searchCenterPosition = null;
    if (searchCenter && searchCenter.latitude && searchCenter.longitude) {
      searchCenterPosition = new window.naver.maps.LatLng(
        searchCenter.latitude,
        searchCenter.longitude
      );

      // 검색 기준 좌표 마커 (주황색 원형 마커)
      const searchMarker = new window.naver.maps.Marker({
        position: searchCenterPosition,
        map: map,
        icon: {
          content: `
            <div style="
              width: 18px;
              height: 18px;
              background-color: #FF9800;
              border: 2px solid #FFFFFF;
              border-radius: 50%;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            "></div>
          `,
          anchor: window.naver && window.naver.maps && window.naver.maps.Point 
            ? new window.naver.maps.Point(9, 9)
            : undefined,
        },
        zIndex: 1001, // GPS 마커보다 위에 표시
        title: '검색 기준 위치',
      });

      searchCenterMarkerRef.current = searchMarker;
      console.log('📍 검색 기준 좌표 마커 생성:', { latitude: searchCenter.latitude, longitude: searchCenter.longitude });

      // 검색 반경 원 생성 (searchRadius가 있을 때만, 최소 반경 체크)
      // 너무 작은 반경은 Circle 생성 시 에러 발생 가능
      const MIN_CIRCLE_RADIUS = 50; // 최소 50m
      if (searchRadius && searchRadius >= MIN_CIRCLE_RADIUS) {
        try {
          const circle = new window.naver.maps.Circle({
            map: map,
            center: searchCenterPosition,
            radius: searchRadius, // 미터 단위
            fillColor: '#FF9800',
            fillOpacity: 0.15, // 불투명도
            strokeColor: '#FF9800',
            strokeOpacity: 0.4,
            strokeWeight: 2,
            zIndex: 1, // 마커보다 아래에 표시
          });
          searchRadiusCircleRef.current = circle;
          console.log('⭕ 검색 반경 원 생성:', { radius: searchRadius, center: searchCenterPosition });
        } catch (circleError) {
          console.warn('⚠️ 반경 원 생성 실패:', circleError);
          // 에러 발생 시 원을 생성하지 않음
          searchRadiusCircleRef.current = null;
        }
      } else if (searchRadius && searchRadius > 0 && searchRadius < MIN_CIRCLE_RADIUS) {
        console.log('ℹ️ 반경이 너무 작아서 원을 표시하지 않습니다:', searchRadius);
      }
    }

    // 지도 중심 좌표 결정 (검색 기준 좌표 우선, 없으면 GPS 위치)
    const centerPosition = searchCenterPosition || gpsPosition;

    // 지도 중심 및 줌 조정
    if (centerPosition && validPlaces.length > 0) {
      // 검색 기준 좌표(또는 GPS 위치)를 정중앙에 두고, 모든 공연장 마커가 보이도록 조정
      // fitBounds를 사용하여 모든 마커가 보이도록 하고, 중심 위치를 정중앙에 배치
      const allBounds = new window.naver.maps.LatLngBounds();
      allBounds.extend(centerPosition);
      validPlaces.forEach(place => {
        allBounds.extend(new window.naver.maps.LatLng(place.latitude, place.longitude));
      });

      // fitBounds로 모든 마커가 보이도록 설정 (padding 추가)
      map.fitBounds(allBounds, {
        top: 100,   // 상단 여유 (탭과 버튼 공간)
        right: 50,
        bottom: 100, // 하단 여유
        left: 50,
      });

      // 중심 위치를 정중앙에 배치하기 위해 약간의 지연 후 재조정
      setTimeout(() => {
        // 현재 bounds를 가져와서 중심 위치가 정중앙에 있는지 확인
        const currentBounds = map.getBounds();
        const currentCenter = map.getCenter();
        
        // 중심 위치가 bounds 안에 있는지 확인하고, 필요시 재조정
        if (currentBounds && currentBounds.hasLatLng(centerPosition)) {
          // 중심 위치를 정중앙으로 설정
          map.setCenter(centerPosition);
          
          // 모든 공연장이 보이는지 확인
          let allVisible = true;
          validPlaces.forEach(place => {
            const placePos = new window.naver.maps.LatLng(place.latitude, place.longitude);
            if (!currentBounds.hasLatLng(placePos)) {
              allVisible = false;
            }
          });

          // 일부 마커가 보이지 않으면 약간 줌 아웃
          if (!allVisible) {
            const currentZoom = map.getZoom();
            map.setZoom(Math.max(currentZoom - 1, 10));
          }
          
          // 최종적으로 중심 위치를 정중앙으로 설정
          map.setCenter(centerPosition);
        }
      }, 100);
    } else if (centerPosition) {
      // 중심 위치만 있고 공연장이 없는 경우 - 조금만 줌 아웃
      map.setCenter(centerPosition);
      const currentZoom = map.getZoom();
      // 현재 줌 레벨보다 1-2단계만 낮춤 (너무 멀지 않게)
      map.setZoom(Math.max(currentZoom - 2, 12));
    } else if (validPlaces.length > 0) {
      // 중심 위치가 없고 공연장만 있는 경우
      if (validPlaces.length > 1) {
        const bounds = new window.naver.maps.LatLngBounds();
        validPlaces.forEach(place => {
          bounds.extend(new window.naver.maps.LatLng(place.latitude, place.longitude));
        });
        map.fitBounds(bounds, {
          top: 100,
          right: 50,
          bottom: 100,
          left: 50,
        });
      } else if (validPlaces.length === 1) {
        const placePos = new window.naver.maps.LatLng(validPlaces[0].latitude, validPlaces[0].longitude);
        map.setCenter(placePos);
        map.setZoom(15);
      }
    }

    // 각 공연장에 마커 생성
    validPlaces.forEach((place) => {
      const position = new window.naver.maps.LatLng(place.latitude, place.longitude);
      
      const marker = new window.naver.maps.Marker({
        position: position,
        map: map,
        title: place.name,
      });
      markersRef.current.push(marker);

      // 정보창 생성
      const infoWindow = new window.naver.maps.InfoWindow({
        content: `<div style="padding: 10px; font-weight: 600;">${place.name}</div>`,
      });
      infoWindowsRef.current.push(infoWindow);

      // 마커 클릭 시 정보창 표시
      window.naver.maps.Event.addListener(marker, 'click', () => {
        // 다른 정보창 닫기
        infoWindowsRef.current.forEach(iw => {
          if (iw && iw !== infoWindow && iw.getMap()) {
            iw.close();
          }
        });
        // 현재 정보창 토글
        if (infoWindow.getMap()) {
          infoWindow.close();
        } else {
          infoWindow.open(map, marker);
        }
      });
    });

    console.log('✅ 마커 생성 완료:', markersRef.current.length, '개');
  }, [places, userLocation, searchCenter, searchRadius]); // searchRadius도 의존성에 추가

  // 현재 위치에서 검색 버튼 클릭 핸들러
  const handleSearchAtCenter = () => {
    if (!mapInstanceRef.current || !onSearchAtCenter) {
      return;
    }

    const map = mapInstanceRef.current;
    const center = map.getCenter();
    
    if (center) {
      const latitude = center.lat();
      const longitude = center.lng();
      
      // 현재 뷰포트의 bounds 계산
      const bounds = map.getBounds();
      if (bounds) {
        const sw = bounds.getSW(); // 남서쪽 모서리
        const ne = bounds.getNE(); // 북동쪽 모서리
        
        // 대각선 거리 계산 (Haversine 공식)
        const R = 6371000; // 지구 반지름 (미터)
        const lat1 = sw.lat() * Math.PI / 180;
        const lat2 = ne.lat() * Math.PI / 180;
        const deltaLat = (ne.lat() - sw.lat()) * Math.PI / 180;
        const deltaLng = (ne.lng() - sw.lng()) * Math.PI / 180;
        
        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                  Math.cos(lat1) * Math.cos(lat2) *
                  Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const viewportRadius = (R * c) / 2; // 대각선의 절반을 반경으로 사용
        
        // 뷰포트 반경에 약간의 여유를 더함 (10% 추가)
        let calculatedRadius = Math.ceil(viewportRadius * 1.1);
        
        // 최소/최대 반경 제한 (너무 작거나 크면 문제 발생)
        const MIN_RADIUS = 100; // 최소 100m (너무 작으면 Circle 에러 발생)
        const MAX_RADIUS = 10000; // 최대 10km
        
        if (calculatedRadius < MIN_RADIUS) {
          calculatedRadius = MIN_RADIUS;
        } else if (calculatedRadius > MAX_RADIUS) {
          calculatedRadius = MAX_RADIUS;
        }
        
        console.log('🔍 현재 지도 중심 좌표로 검색:', { 
          latitude, 
          longitude,
          viewportRadius: Math.round(viewportRadius),
          calculatedRadius,
          limited: calculatedRadius !== Math.ceil(viewportRadius * 1.1)
        });
        
        onSearchAtCenter({ 
          latitude, 
          longitude,
          radius: calculatedRadius 
        });
      } else {
        // bounds를 가져올 수 없으면 기본값 사용
        console.log('🔍 현재 지도 중심 좌표로 검색 (기본 반경):', { latitude, longitude });
        onSearchAtCenter({ 
          latitude, 
          longitude,
          radius: 5000 // 기본 반경 5km
        });
      }
    }
  };

  // 현재 위치로 이동 버튼 클릭 핸들러
  const handleMoveToCurrentLocation = () => {
    if (!mapInstanceRef.current || !userLocation) {
      console.warn('⚠️ GPS 위치가 없어서 이동할 수 없습니다.');
      return;
    }

    const map = mapInstanceRef.current;
    const gpsPosition = new window.naver.maps.LatLng(
      userLocation.latitude,
      userLocation.longitude
    );
    
    // GPS 위치로 뷰포트만 이동 (검색 기준 좌표는 유지)
    map.setCenter(gpsPosition);
    map.setZoom(15);
    console.log('📍 GPS 위치로 뷰포트 이동:', { 
      latitude: userLocation.latitude, 
      longitude: userLocation.longitude,
      gpsLocation: userLocation 
    });
  };

  // 반경 표시 텍스트 포맷팅
  const formatRadius = (radius) => {
    if (radius >= 1000) {
      return `${(radius / 1000).toFixed(1)}km`;
    }
    return `${radius}m`;
  };

  return (
    <div className={styles.mapContainer}>
      <div ref={mapRef} className={styles.map} />
      {/* 반경 정보 표시 */}
      {searchCenter && searchRadius > 0 && (
        <div className={styles.radiusInfo}>
          반경 {formatRadius(searchRadius)}
        </div>
      )}
      {/* 버튼 그룹 */}
      {mapInstanceRef.current && (
        <div className={styles.buttonGroup}>
          {/* 현재 위치로 이동 버튼 */}
          {userLocation && (
            <button 
              className={styles.locationButton}
              onClick={handleMoveToCurrentLocation}
              type="button"
              title="현재 위치로 이동"
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className={styles.locationIcon}
              >
                <circle cx="12" cy="12" r="2" fill="#797979"/>
                <circle cx="12" cy="12" r="8" stroke="#797979" strokeWidth="1.5" fill="none"/>
                <line x1="12" y1="4" x2="12" y2="6" stroke="#797979" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="12" y1="18" x2="12" y2="20" stroke="#797979" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="4" y1="12" x2="6" y2="12" stroke="#797979" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="18" y1="12" x2="20" y2="12" stroke="#797979" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}
          {/* 현 위치에서 검색 버튼 */}
          {onSearchAtCenter && (
            <button 
              className={styles.searchButton}
              onClick={handleSearchAtCenter}
              type="button"
            >
              공연장
            </button>
          )}
        </div>
      )}
      {/* 로딩 오버레이 */}
      {mapLoading && (
        <div className={styles.loadingOverlay}>
          지도를 불러오는 중...
        </div>
      )}
      {/* 에러 오버레이 */}
      {mapError && !mapLoading && (
        <div className={styles.errorOverlay}>
          {mapError}
        </div>
      )}
    </div>
  );
};

export default PlaceMapView;

