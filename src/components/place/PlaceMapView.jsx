import React, { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import styles from './PlaceMapView.module.css';
import { loadNaverMapScript } from '../../utils/loadNaverMap';
import PlaceWithPerformancesCard from '../cards/PlaceWithPerformancesCard';
import { createPlaceMarkerHTML } from './PlaceMarker';
import { watchCurrentLocation, clearLocationWatch } from '../../utils/geolocation';

/**
 * 여러 공연장 위치를 표시하는 네이버 지도 컴포넌트
 * @param {Array} places - 공연장 배열 [{ id, name, latitude, longitude, address }, ...]
 * @param {Object} userLocation - GPS 사용자 위치 { latitude, longitude }
 * @param {Object} searchCenter - 검색 기준 좌표 { latitude, longitude }
 * @param {number} searchRadius - 검색 반경 (미터)
 * @param {Function} onSearchAtCenter - 현재 지도 중심 좌표로 검색하는 콜백 함수
 * @param {string} clientId - 네이버 지도 API Client ID (선택사항, 환경변수에서 가져옴)
 */
const PlaceMapView = forwardRef(({ places = [], userLocation = null, searchCenter = null, searchRadius = 0, onSearchAtCenter, clientId }, ref) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowsRef = useRef([]);
  const markerIntervalsRef = useRef(new Map()); // 마커별 포스터 변경 interval 저장
  const markerPerformanceIndicesRef = useRef(new Map()); // 마커별 현재 공연 인덱스 저장
  const markerPerformancesRef = useRef(new Map()); // 마커별 공연 목록 저장
  const markerShowingFirstRef = useRef(new Map()); // 마커별 현재 보이는 레이어 추적 (true: imgElement, false: imgNextElement)
  const userMarkerRef = useRef(null); // GPS 위치 마커 (파란색)
  const searchCenterMarkerRef = useRef(null); // 검색 기준 좌표 마커 (주황색)
  const searchRadiusCircleRef = useRef(null); // 검색 반경 원
  const scaleControlRef = useRef(null);
  const locationWatchIdRef = useRef(null); // 실시간 위치 추적 ID
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const [isCreatingMarkers, setIsCreatingMarkers] = useState(false); // 마커 생성 중 상태
  
  // 선택된 공연장 상태 (마커 클릭 시)
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedPlaceCardHeight, setSelectedPlaceCardHeight] = useState(0); // 선택된 카드 시트 높이 (0 또는 'max-content')
  const [isCardVisible, setIsCardVisible] = useState(false); // 카드 표시 여부 (애니메이션용)
  const selectedPlaceInfoWindowRef = useRef(null); // 선택된 공연장의 인포윈도우 ref
  const selectedPlaceMarkerRef = useRef(null); // 선택된 공연장의 마커 ref
  
  // 하단 시트 상태
  const [sheetHeight, setSheetHeight] = useState(180); // 기본 높이 (px) - 드래그 핸들 + 헤더 + 일부 카드가 보이도록
  const [isDragging, setIsDragging] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false); // 스냅 애니메이션 중인지
  const dragStateRef = useRef({ startY: 0, startHeight: 0 });
  const sheetRef = useRef(null);
  const sheetContentRef = useRef(null); // 시트 내용 영역 ref
  const animationFrameRef = useRef(null);
  const scrollStateRef = useRef({ 
    startY: 0, 
    isDraggingSheet: false, 
    wasDraggingDown: false,
    initialScrollTop: 0,
    isContentScrolling: false
  });
  const globalTouchHandlersRef = useRef({ move: null, end: null });
  
  const MIN_SHEET_HEIGHT = 150; // 최소 높이 - 드래그 핸들과 헤더가 확실히 보이도록
  const HEADER_HEIGHT = 61; // Header 높이 (MainLayout.css의 --header-height와 동일)
  
  // 최대 높이 계산 (header 밑까지)
  const getMaxSheetHeight = useCallback(() => {
    return window.innerHeight - HEADER_HEIGHT;
  }, []);

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
      // 마커는 마커 업데이트 useEffect의 cleanup에서 처리하므로 여기서는 제거하지 않음
      // (탭 전환 시 마커가 사라지는 문제 방지)
      if (scaleControlRef.current) {
        scaleControlRef.current = null;
      }
      if (window.navermap_authFailure) {
        delete window.navermap_authFailure;
      }
      // 지도 인스턴스는 유지 (탭 전환 시 재사용)
      // mapInstanceRef.current는 다음 마운트 시 재사용되거나 새로 생성됨
    };
  }, [clientId]); // clientId만 의존성으로 (지도는 한 번만 초기화)

  // 마커 제거 함수 (외부에서 호출 가능하도록)
  const clearMarkers = useCallback(async () => {
    if (!mapInstanceRef.current || !window.naver || !window.naver.maps) {
      return;
    }

    console.log('🧹 [마커 제거] 기존 공연장 마커 모두 제거 시작');
    
    // 모든 포스터 변경 interval 정리
    markerIntervalsRef.current.forEach((intervalId, marker) => {
      clearInterval(intervalId);
    });
    markerIntervalsRef.current.clear();
    markerPerformanceIndicesRef.current.clear();
    markerPerformancesRef.current.clear();
    markerShowingFirstRef.current.clear();
    
    // 모든 공연장 마커를 동기적으로 제거
    const markersToRemove = [...markersRef.current];
    markersToRemove.forEach(marker => {
      if (marker) {
        marker.setMap(null);
        if (window.naver && window.naver.maps && window.naver.maps.Event) {
          window.naver.maps.Event.clearInstanceListeners(marker);
        }
      }
    });
    
    const infoWindowsToRemove = [...infoWindowsRef.current];
    infoWindowsToRemove.forEach(infoWindow => {
      if (infoWindow) {
        infoWindow.close();
        if (window.naver && window.naver.maps && window.naver.maps.Event) {
          window.naver.maps.Event.clearInstanceListeners(infoWindow);
        }
      }
    });
    
    // 검색 기준 좌표 마커와 반경 원도 제거
    if (searchCenterMarkerRef.current) {
      searchCenterMarkerRef.current.setMap(null);
      searchCenterMarkerRef.current = null;
      console.log('🧹 [마커 제거] 검색 기준 좌표 마커 제거');
    }
    if (searchRadiusCircleRef.current) {
      searchRadiusCircleRef.current.setMap(null);
      searchRadiusCircleRef.current = null;
      console.log('🧹 [마커 제거] 검색 반경 원 제거');
    }
    
    // 선택된 공연장 카드 닫기 (시트가 보이도록)
    if (selectedPlaceInfoWindowRef.current) {
      selectedPlaceInfoWindowRef.current.close();
      selectedPlaceInfoWindowRef.current = null;
    }
    setIsCardVisible(false);
    setSelectedPlaceCardHeight(0);
    setSelectedPlace(null);
    selectedPlaceMarkerRef.current = null;
    console.log('🧹 [마커 제거] 선택된 공연장 카드 닫기');
    
    // ref를 즉시 비움
    markersRef.current = [];
    infoWindowsRef.current = [];
    
    // 지도 재렌더링을 위한 약간의 지연
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log('✅ [마커 제거] 기존 공연장 마커 제거 완료');
  }, []); // 의존성 배열은 비워둠 (상태 setter는 안정적이므로)

  // ref를 통해 clearMarkers 함수와 isCreatingMarkers 상태 노출
  useImperativeHandle(ref, () => ({
    clearMarkers,
    isCreatingMarkers
  }), [clearMarkers, isCreatingMarkers]);

  // places가 변경될 때 마커 생성 (4단계: 전역 상태에 저장된 목록으로 마커 생성)
  // mapLoading이 false일 때만 실행 (지도 초기화 완료 후)
  useEffect(() => {
    if (!mapInstanceRef.current || !window.naver || !window.naver.maps || mapLoading) {
      // 지도가 아직 로딩 중이면 마커 생성하지 않음
      return;
    }

    const map = mapInstanceRef.current;
    console.log('🗺️ [4단계] 마커 생성 시작:', {
      placesCount: places.length,
      userLocation,
      searchCenter,
      searchRadius,
      mapReady: !!map
    });

    // places가 빈 배열이면 기존 공연장 마커만 제거 (검색 기준 마커는 별도 처리)
    if (!places || places.length === 0) {
      console.log('📭 [마커 생성] places가 비어있음 - 기존 공연장 마커 제거');
      // 기존 공연장 마커 모두 제거
      const markersToRemove = [...markersRef.current];
      markersToRemove.forEach(marker => {
        if (marker) {
          marker.setMap(null);
          if (window.naver && window.naver.maps && window.naver.maps.Event) {
            window.naver.maps.Event.clearInstanceListeners(marker);
          }
        }
      });
      markersRef.current = [];
      
      // 인포윈도우도 모두 닫기
      const infoWindowsToRemove = [...infoWindowsRef.current];
      infoWindowsToRemove.forEach(infoWindow => {
        if (infoWindow) {
          infoWindow.close();
          if (window.naver && window.naver.maps && window.naver.maps.Event) {
            window.naver.maps.Event.clearInstanceListeners(infoWindow);
          }
        }
      });
      infoWindowsRef.current = [];
      
      // places가 비어있어도 searchCenter가 있으면 검색 기준 마커와 반경 원은 생성해야 함
      // 따라서 여기서 return하지 않고 계속 진행
    }

    // 유효한 위치 정보가 있는 공연장만 필터링
    const validPlaces = places.filter(
      place => place.latitude && place.longitude && 
      !isNaN(parseFloat(place.latitude)) && 
      !isNaN(parseFloat(place.longitude))
    );

    console.log('✅ [디버깅] 유효한 공연장 개수:', validPlaces.length);
    if (validPlaces.length === 0 && places.length > 0) {
      console.warn('⚠️ [디버깅] places는 있지만 유효한 공연장이 없습니다. 원본 places:', places);
      // 공연장이 없어도 GPS 마커는 생성해야 하므로 return하지 않음
    }

    // 기존 검색 기준 마커와 반경 원 제거 (GPS 마커는 유지)
    // searchCenter가 변경될 때마다 이전 마커 제거
    if (searchCenterMarkerRef.current) {
      searchCenterMarkerRef.current.setMap(null);
      searchCenterMarkerRef.current = null;
      console.log('🧹 [마커 생성] 이전 검색 기준 좌표 마커 제거');
    }
    if (searchRadiusCircleRef.current) {
      searchRadiusCircleRef.current.setMap(null);
      searchRadiusCircleRef.current = null;
      console.log('🧹 [마커 생성] 이전 검색 반경 원 제거');
    }

    // GPS 위치 마커 생성/업데이트 (파란색) - 항상 표시
    let gpsPosition = null;
    if (userLocation && userLocation.latitude && userLocation.longitude) {
      gpsPosition = new window.naver.maps.LatLng(
        userLocation.latitude,
        userLocation.longitude
      );

      // 기존 GPS 마커가 있으면 위치만 업데이트, 없으면 새로 생성
      if (userMarkerRef.current) {
        userMarkerRef.current.setPosition(gpsPosition);
        console.log('📍 GPS 위치 마커 업데이트:', { latitude: userLocation.latitude, longitude: userLocation.longitude });
      } else {
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
    } else if (userMarkerRef.current) {
      // GPS 위치가 없으면 마커 제거
      userMarkerRef.current.setMap(null);
      userMarkerRef.current = null;
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

      // 검색 반경 원 생성 (searchRadius가 있을 때만, 최소/최대 반경 체크)
      // 너무 작거나 큰 반경은 Circle 생성 시 에러 발생 가능
      const MIN_CIRCLE_RADIUS = 50; // 최소 50m
      const MAX_CIRCLE_RADIUS = 50000; // 최대 50km (너무 크면 Circle 에러 발생)
      
      // 반경이 비정상적으로 크면 원을 생성하지 않음
      if (searchRadius && searchRadius >= MIN_CIRCLE_RADIUS && searchRadius <= MAX_CIRCLE_RADIUS) {
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
        console.log('ℹ️ [디버깅] 반경이 너무 작아서 원을 표시하지 않습니다:', searchRadius);
      } else if (searchRadius && searchRadius > MAX_CIRCLE_RADIUS) {
        console.warn('⚠️ [디버깅] 반경이 너무 커서 원을 표시하지 않습니다:', {
          radius: searchRadius,
          radiusKm: (searchRadius / 1000).toFixed(2) + 'km',
          maxRadius: MAX_CIRCLE_RADIUS,
          maxRadiusKm: (MAX_CIRCLE_RADIUS / 1000).toFixed(2) + 'km'
        });
      }
    }

    // 지도 중심 좌표 결정 (검색 기준 좌표 우선, 없으면 GPS 위치)
    const centerPosition = searchCenterPosition || gpsPosition;

    // 반경 원의 bounds 계산 함수
    const calculateCircleBounds = (centerLat, centerLng, radius) => {
      // 위도/경도 1도당 미터 (위도는 일정, 경도는 위도에 따라 다름)
      const latPerMeter = 1 / 111000; // 위도 1도 ≈ 111km
      const lngPerMeter = 1 / (111000 * Math.cos(centerLat * Math.PI / 180)); // 경도는 위도에 따라 다름
      
      // 반경 원의 bounds 계산 (반경을 절반으로 줄여서 더 가깝게 보이도록)
      const padding = 0.3; // 반경을 절반으로 줄임 (반경 원이 화면에 더 가깝게)
      const radiusInDegrees = {
        lat: (radius * latPerMeter) * padding,
        lng: (radius * lngPerMeter) * padding
      };
      
      return new window.naver.maps.LatLngBounds(
        new window.naver.maps.LatLng(centerLat - radiusInDegrees.lat, centerLng - radiusInDegrees.lng), // 남서쪽
        new window.naver.maps.LatLng(centerLat + radiusInDegrees.lat, centerLng + radiusInDegrees.lng)  // 북동쪽
      );
    };

    // 지도 중심 및 줌 조정
    // GPS 위치가 있고 공연장이 없고 검색 기준 좌표도 없을 때 GPS 위치로 뷰포트 설정
    if (gpsPosition && validPlaces.length === 0 && !searchCenterPosition) {
      map.setCenter(gpsPosition);
      map.setZoom(15);
      console.log('📍 [초기 로드] GPS 위치로 지도 뷰포트 설정 (줌 레벨 15):', {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude
      });
    } else if (centerPosition && validPlaces.length > 0) {
      // 검색 기준 좌표(또는 GPS 위치)를 정중앙에 두고, 모든 공연장 마커와 반경 원이 보이도록 조정
      const allBounds = new window.naver.maps.LatLngBounds();
      allBounds.extend(centerPosition);
      validPlaces.forEach(place => {
        allBounds.extend(new window.naver.maps.LatLng(place.latitude, place.longitude));
      });
      
      // 반경 원이 있으면 반경 원의 bounds도 포함
      if (searchCenter && searchRadius && searchRadiusCircleRef.current) {
        const circleBounds = calculateCircleBounds(
          searchCenter.latitude,
          searchCenter.longitude,
          searchRadius
        );
        // 반경 원의 bounds를 allBounds에 병합
        allBounds.extend(circleBounds.getSW());
        allBounds.extend(circleBounds.getNE());
      }

      // fitBounds로 모든 마커와 반경 원이 보이도록 설정 (최소한의 padding만, 부드러운 애니메이션)
      // 반경 원이 화면에 최대한 가깝게 보이도록 padding을 최소화 (조금 잘려도 OK)
      map.fitBounds(allBounds, {
        top: 40,   // 상단 여유 (탭과 버튼 공간) - 최소화
        right: 10, // 최소화
        bottom: 40, // 하단 여유 - 최소화
        left: 10, // 최소화
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
      // 중심 위치만 있고 공연장이 없는 경우
      // GPS 위치인 경우 줌 레벨 15로 설정 (GPS 버튼과 동일)
      if (gpsPosition && centerPosition.equals(gpsPosition)) {
        map.setCenter(centerPosition);
        map.setZoom(15);
        console.log('📍 [디버깅] 초기 GPS 위치로 지도 설정 (줌 레벨 15):', {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude
        });
      } else {
        // 검색 기준 좌표만 있는 경우
        // 반경 원이 있으면 반경 원이 화면에 다 들어오도록 조정
        if (searchCenter && searchRadius && searchRadiusCircleRef.current) {
          const circleBounds = calculateCircleBounds(
            searchCenter.latitude,
            searchCenter.longitude,
            searchRadius
          );
          
          // 반경 원이 화면에 다 들어오도록 fitBounds (부드러운 애니메이션)
          // 반경 원이 화면에 최대한 가깝게 보이도록 padding을 최소화 (조금 잘려도 OK)
          map.fitBounds(circleBounds, {
            top: 40,   // 상단 여유 (탭과 버튼 공간) - 최소화
            right: 10, // 최소화
            bottom: 40, // 하단 여유 - 최소화
            left: 10, // 최소화
          });
          
          console.log('🔍 [디버깅] 반경 원이 화면에 다 들어오도록 뷰포트 조정:', {
            center: { lat: searchCenter.latitude, lng: searchCenter.longitude },
            radius: searchRadius,
            radiusKm: (searchRadius / 1000).toFixed(2) + 'km'
          });
        } else {
          // 반경 원이 없으면 조금만 줌 아웃
          map.setCenter(centerPosition);
          const currentZoom = map.getZoom();
          map.setZoom(Math.max(currentZoom - 2, 12));
        }
      }
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

    // 새로운 공연장 마커 생성 (비동기로 포스터 포함 마커 생성)
    const createMarkers = async () => {
      console.log('📍 [4단계] 새로운 공연장 마커 생성 시작:', validPlaces.length, '개');
      
      // 마커 생성 중 상태 설정
      setIsCreatingMarkers(true);
      
      // 기존 마커가 남아있으면 제거 (안전장치)
      if (markersRef.current.length > 0) {
        console.warn('⚠️ [4단계] 기존 마커가 남아있습니다. 제거합니다.');
        const remainingMarkers = [...markersRef.current];
        remainingMarkers.forEach(marker => {
          if (marker) {
            marker.setMap(null);
            if (window.naver && window.naver.maps && window.naver.maps.Event) {
              window.naver.maps.Event.clearInstanceListeners(marker);
            }
          }
        });
        markersRef.current = [];
      }

      // 새로운 마커 생성 (지도에 표시하지 않고 먼저 생성)
      const newMarkers = [];
      const newInfoWindows = [];

      for (const place of validPlaces) {
      const position = new window.naver.maps.LatLng(place.latitude, place.longitude);
      
        // 커스텀 마커 HTML 생성 (포스터 포함)
        const { html: markerHTML, anchor, performances, markerId } = await createPlaceMarkerHTML(place, 0);
        
        // 마커 생성 (map: null로 설정하여 지도에 표시하지 않음)
      const marker = new window.naver.maps.Marker({
        position: position,
        map: null, // 먼저 지도에 표시하지 않음
        title: place.name,
          icon: {
            content: markerHTML,
            anchor: new window.naver.maps.Point(anchor.x, anchor.y),
          },
          zIndex: 100,
      });
        newMarkers.push(marker);
        
        // 여러 공연이 있는 경우 포스터 변경 interval 설정
        if (performances && performances.length > 1 && markerId) {
          markerPerformancesRef.current.set(marker, performances);
          markerPerformanceIndicesRef.current.set(marker, 0);
          markerShowingFirstRef.current.set(marker, true); // 초기값: imgElement가 보임
          
          // 5초마다 포스터 변경 (이미지만 부드럽게 변경, cross-fade 효과)
          const intervalId = setInterval(() => {
            const currentIndex = markerPerformanceIndicesRef.current.get(marker) || 0;
            const nextIndex = (currentIndex + 1) % performances.length;
            markerPerformanceIndicesRef.current.set(marker, nextIndex);
            
            // 마커의 DOM 요소에 접근해서 이미지만 변경
            const markerElement = marker.getElement();
            if (markerElement) {
              const imgElement = markerElement.querySelector(`#${markerId}-img`);
              const imgNextElement = markerElement.querySelector(`#${markerId}-img-next`);
              
              if (imgElement && imgNextElement) {
                const nextPerformance = performances[nextIndex];
                const nextPosterUrl = nextPerformance.poster || '/placeholder-poster.png';
                
                // 현재 보이는 이미지와 다음에 보일 이미지 결정
                const isShowingFirst = markerShowingFirstRef.current.get(marker) ?? true;
                const currentImg = isShowingFirst ? imgElement : imgNextElement;
                const nextImg = isShowingFirst ? imgNextElement : imgElement;
                
                // 다음 이미지를 미리 로드
                const newImg = new Image();
                newImg.onload = () => {
                  // 이미지가 완전히 로드된 후에만 전환 시작
                  // 다음 이미지를 다음 레이어에 설정 (이미 로드된 이미지 사용)
                  nextImg.src = newImg.src; // 이미 로드된 이미지 사용
                  nextImg.alt = nextPerformance.title || '공연 포스터';
                  
                  // 다음 이미지가 완전히 준비될 때까지 약간의 지연
                  requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                      // cross-fade 효과: 현재 이미지는 fade out, 다음 이미지는 fade in
                      currentImg.style.opacity = '0';
                      nextImg.style.opacity = '1';
                      
                      // 전환이 완료되면 다음 전환을 위해 반대 레이어에 다음 이미지 준비
                      setTimeout(() => {
                        // 다음 다음 이미지 인덱스
                        const nextNextIndex = (nextIndex + 1) % performances.length;
                        const nextNextPerformance = performances[nextNextIndex];
                        const nextNextPosterUrl = nextNextPerformance.poster || '/placeholder-poster.png';
                        
                        // 다음 다음 이미지를 미리 로드해서 현재 보이지 않는 레이어에 준비
                        const nextNextImg = new Image();
                        nextNextImg.onload = () => {
                          // 현재 보이지 않는 레이어에 다음 다음 이미지 설정
                          currentImg.src = nextNextImg.src;
                          currentImg.alt = nextNextPerformance.title || '공연 포스터';
                          currentImg.style.opacity = '0';
                        };
                        nextNextImg.onerror = () => {
                          currentImg.src = '/placeholder-poster.png';
                          currentImg.alt = '공연 포스터';
                          currentImg.style.opacity = '0';
                        };
                        nextNextImg.src = nextNextPosterUrl;
                        
                        // 다음 전환을 위해 반대 레이어 사용
                        markerShowingFirstRef.current.set(marker, !isShowingFirst);
                      }, 800); // transition 시간과 동일
                    });
                  });
                };
                newImg.onerror = () => {
                  // 에러 시 placeholder 이미지 사용
                  const placeholderImg = new Image();
                  placeholderImg.onload = () => {
                    nextImg.src = placeholderImg.src;
                    nextImg.alt = '공연 포스터';
                    
                    requestAnimationFrame(() => {
                      requestAnimationFrame(() => {
                        currentImg.style.opacity = '0';
                        nextImg.style.opacity = '1';
                        
                        // 다음 전환을 위해 반대 레이어에 다음 이미지 준비
                        setTimeout(() => {
                          const nextNextIndex = (nextIndex + 1) % performances.length;
                          const nextNextPerformance = performances[nextNextIndex];
                          const nextNextPosterUrl = nextNextPerformance.poster || '/placeholder-poster.png';
                          
                          const nextNextImg = new Image();
                          nextNextImg.onload = () => {
                            currentImg.src = nextNextImg.src;
                            currentImg.alt = nextNextPerformance.title || '공연 포스터';
                            currentImg.style.opacity = '0';
                          };
                          nextNextImg.onerror = () => {
                            currentImg.src = '/placeholder-poster.png';
                            currentImg.alt = '공연 포스터';
                            currentImg.style.opacity = '0';
                          };
                          nextNextImg.src = nextNextPosterUrl;
                          
                          markerShowingFirstRef.current.set(marker, !isShowingFirst);
                        }, 800);
                      });
                    });
                  };
                  placeholderImg.onerror = () => {
                    console.warn('⚠️ Placeholder 이미지 로드 실패:', markerId);
                  };
                  placeholderImg.src = '/placeholder-poster.png';
                };
                newImg.src = nextPosterUrl;
              }
            }
          }, 5000); // 5초마다 변경
          
          markerIntervalsRef.current.set(marker, intervalId);
        }

      // 정보창 생성
      const infoWindow = new window.naver.maps.InfoWindow({
        content: `<div style="padding: 10px; font-weight: 600;">${place.name}</div>`,
      });
        newInfoWindows.push(infoWindow);

        // 마커 클릭 시 공연장 카드 표시
      window.naver.maps.Event.addListener(marker, 'click', () => {
        // 다른 정보창 닫기
          newInfoWindows.forEach(iw => {
          if (iw && iw !== infoWindow && iw.getMap()) {
            iw.close();
          }
        });
          
          // 선택된 공연장 설정
          setSelectedPlace(place);
          selectedPlaceInfoWindowRef.current = infoWindow;
          selectedPlaceMarkerRef.current = marker;
          
          // 인포윈도우 열기
          infoWindow.open(map, marker);
          
          // 지도 중심을 해당 마커로 이동
          map.setCenter(position);
          map.setZoom(Math.max(map.getZoom(), 15)); // 최소 줌 레벨 15
          
          // 카드 시트 높이를 max-content로 설정 (내용에 맞게 자동 조정)
          setSelectedPlaceCardHeight('max-content');
          
          // 애니메이션을 위해 약간의 지연 후 표시
          setTimeout(() => {
            setIsCardVisible(true);
          }, 10);
        });
      }
      
      // 모든 마커 생성이 완료된 후 한 번에 지도에 표시
      newMarkers.forEach(marker => {
        marker.setMap(map);
      });
      
      // 모든 마커 생성이 완료된 후에만 ref에 추가
      markersRef.current = newMarkers;
      infoWindowsRef.current = newInfoWindows;
      
      // 마커 생성 완료 상태 해제
      setIsCreatingMarkers(false);
      
      console.log('✅ [4단계] 새로운 공연장 마커 생성 완료:', markersRef.current.length, '개');
    };

    // await로 기다려서 마커 생성이 완료되도록 보장
    createMarkers().catch(error => {
      console.error('❌ [4단계] 마커 생성 중 오류 발생:', error);
    });

    console.log('✅ [디버깅] 마커 생성 완료:', {
      totalMarkers: markersRef.current.length,
      placeMarkers: markersRef.current.length - (userMarkerRef.current ? 1 : 0) - (searchCenterMarkerRef.current ? 1 : 0),
      hasUserMarker: !!userMarkerRef.current,
      hasSearchCenterMarker: !!searchCenterMarkerRef.current,
      hasSearchRadiusCircle: !!searchRadiusCircleRef.current,
      validPlacesCount: validPlaces.length
    });

  }, [places, userLocation, searchCenter, searchRadius, mapLoading]); // places가 변경될 때만 마커 생성

  // 지도 초기 로드 시 GPS 위치로 뷰포트 자동 설정 및 마커 생성
  useEffect(() => {
    if (!mapInstanceRef.current || !window.naver || !window.naver.maps || mapLoading) {
      return;
    }

    // GPS 위치가 있고, 검색 기준 좌표가 없고, 공연장이 없을 때만 GPS 위치로 뷰포트 설정
    if (userLocation && userLocation.latitude && userLocation.longitude && 
        !searchCenter && (!places || places.length === 0)) {
      const map = mapInstanceRef.current;
      const gpsPosition = new window.naver.maps.LatLng(
        userLocation.latitude,
        userLocation.longitude
      );
      
      // GPS 마커가 없으면 생성
      if (!userMarkerRef.current) {
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
        console.log('📍 [초기 로드] GPS 위치 마커 생성:', {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude
        });
      } else {
        // 기존 마커가 있으면 위치 업데이트
        userMarkerRef.current.setPosition(gpsPosition);
        userMarkerRef.current.setMap(map); // 지도에 표시
      }
      
      // 현재 지도 중심이 기본 위치(서울 시청)인지 확인
      const currentCenter = map.getCenter();
      const defaultCenter = new window.naver.maps.LatLng(37.5665, 126.9780);
      
      // 기본 위치에 있거나 GPS 위치와 다르면 GPS 위치로 이동
      if (!currentCenter || 
          (Math.abs(currentCenter.lat() - defaultCenter.lat()) < 0.001 && 
           Math.abs(currentCenter.lng() - defaultCenter.lng()) < 0.001) ||
          (Math.abs(currentCenter.lat() - gpsPosition.lat()) > 0.001 || 
           Math.abs(currentCenter.lng() - gpsPosition.lng()) > 0.001)) {
        map.setCenter(gpsPosition);
        map.setZoom(15);
        console.log('📍 [자동 설정] GPS 위치로 지도 뷰포트 설정:', {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude
        });
      }
    }
  }, [userLocation, searchCenter, places, mapLoading]); // GPS 위치가 설정되면 뷰포트 업데이트

  // 실시간 GPS 위치 추적 (GPS 마커만 업데이트)
  useEffect(() => {
    if (!mapInstanceRef.current || !window.naver || !window.naver.maps || mapLoading) {
      return;
    }

    const map = mapInstanceRef.current;

    // 기존 watchPosition이 있으면 정리
    if (locationWatchIdRef.current !== null) {
      clearLocationWatch(locationWatchIdRef.current);
      locationWatchIdRef.current = null;
    }

    // 실시간 위치 추적 시작
    const watchId = watchCurrentLocation(
      (newLocation) => {
        // 위치가 변경될 때마다 GPS 마커만 업데이트 (다른 마커는 건드리지 않음)
        if (!mapInstanceRef.current || !window.naver || !window.naver.maps) {
          return;
        }

        const gpsPosition = new window.naver.maps.LatLng(
          newLocation.latitude,
          newLocation.longitude
        );

        // GPS 마커가 있으면 위치만 업데이트
        if (userMarkerRef.current) {
          userMarkerRef.current.setPosition(gpsPosition);
          console.log('📍 [실시간] GPS 마커 위치 업데이트:', {
            latitude: newLocation.latitude,
            longitude: newLocation.longitude
          });
        } else {
          // GPS 마커가 없으면 생성
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
          console.log('📍 [실시간] GPS 마커 생성:', {
            latitude: newLocation.latitude,
            longitude: newLocation.longitude
          });
        }
      },
      (error) => {
        console.error('❌ [실시간] GPS 위치 추적 실패:', error);
        // 에러가 발생해도 기존 마커는 유지
      }
    );

    locationWatchIdRef.current = watchId;
    console.log('🔄 [실시간] GPS 위치 추적 시작');

    // cleanup: 컴포넌트 언마운트 시 위치 추적 중지
    return () => {
      if (locationWatchIdRef.current !== null) {
        clearLocationWatch(locationWatchIdRef.current);
        locationWatchIdRef.current = null;
        console.log('🛑 [실시간] GPS 위치 추적 중지');
      }
    };
  }, [mapLoading]); // 지도가 로드되면 시작

  // 컴포넌트 언마운트 시 마커 정리
  useEffect(() => {
    return () => {
      // 위치 추적 중지
      if (locationWatchIdRef.current !== null) {
        clearLocationWatch(locationWatchIdRef.current);
        locationWatchIdRef.current = null;
      }
      
      // 모든 포스터 변경 interval 정리
      markerIntervalsRef.current.forEach((intervalId) => {
        clearInterval(intervalId);
      });
      markerIntervalsRef.current.clear();
      markerPerformanceIndicesRef.current.clear();
      markerPerformancesRef.current.clear();
      markerShowingFirstRef.current.clear();
      
      // 컴포넌트가 언마운트될 때만 마커 정리
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
      markersRef.current.forEach(marker => {
        if (marker) marker.setMap(null);
      });
      infoWindowsRef.current.forEach(infoWindow => {
        if (infoWindow) infoWindow.close();
      });
      markersRef.current = [];
      infoWindowsRef.current = [];
    };
  }, []); // 컴포넌트 언마운트 시에만 실행

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
    if (!mapInstanceRef.current || !userLocation || !window.naver || !window.naver.maps) {
      console.warn('⚠️ GPS 위치가 없어서 이동할 수 없습니다.');
      return;
    }

    const map = mapInstanceRef.current;
    const gpsPosition = new window.naver.maps.LatLng(
      userLocation.latitude,
      userLocation.longitude
    );
    
    // GPS 마커가 없으면 생성
    if (!userMarkerRef.current) {
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
      console.log('📍 GPS 위치 마커 생성 (버튼 클릭):', { 
        latitude: userLocation.latitude, 
        longitude: userLocation.longitude 
      });
    } else {
      // 기존 마커가 있으면 위치 업데이트
      userMarkerRef.current.setPosition(gpsPosition);
      userMarkerRef.current.setMap(map); // 지도에 다시 표시
    }
    
    // GPS 위치로 뷰포트 이동
    map.setCenter(gpsPosition);
    map.setZoom(15);
    console.log('📍 GPS 위치로 뷰포트 이동:', { 
      latitude: userLocation.latitude, 
      longitude: userLocation.longitude,
      gpsLocation: userLocation 
    });
  };

  // 선택된 공연장 카드 닫기 핸들러
  const handleCloseSelectedPlaceCard = () => {
    // 먼저 애니메이션으로 닫기
    setIsCardVisible(false);
    setSelectedPlaceCardHeight(0);
    
    // 애니메이션 완료 후 상태 정리
    setTimeout(() => {
      // 인포윈도우 닫기
      if (selectedPlaceInfoWindowRef.current) {
        selectedPlaceInfoWindowRef.current.close();
        selectedPlaceInfoWindowRef.current = null;
      }
      
      // 선택 해제
      setSelectedPlace(null);
      selectedPlaceMarkerRef.current = null;
    }, 300); // transition 시간과 동일
  };

  // 반경 표시 텍스트 포맷팅
  const formatRadius = (radius) => {
    if (radius >= 1000) {
      return `${(radius / 1000).toFixed(1)}km`;
    }
    return `${radius}m`;
  };

  // 스냅 포인트 계산 (최소, 중간, 최대)
  const getSnapHeight = useCallback((currentHeight, wasDraggingDown = false) => {
    const maxHeight = getMaxSheetHeight();
    const midHeight = (MIN_SHEET_HEIGHT + maxHeight) / 2;
    
    // 아래로 드래그한 경우 최대 높이로 스냅하지 않음
    if (wasDraggingDown && currentHeight < maxHeight - 10) {
      // 아래로 드래그해서 내려간 경우, 중간 또는 최소 높이로만 스냅
      const snapPoints = [MIN_SHEET_HEIGHT, midHeight];
      return snapPoints.reduce((prev, curr) => {
        return Math.abs(curr - currentHeight) < Math.abs(prev - currentHeight) ? curr : prev;
      });
    }
    
    // 현재 높이에서 가장 가까운 스냅 포인트 찾기
    const snapPoints = [MIN_SHEET_HEIGHT, midHeight, maxHeight];
    const closest = snapPoints.reduce((prev, curr) => {
      return Math.abs(curr - currentHeight) < Math.abs(prev - currentHeight) ? curr : prev;
    });
    
    // 아래로 드래그한 경우 최대 높이로 스냅하지 않음
    if (wasDraggingDown && closest === maxHeight && currentHeight < maxHeight - 10) {
      // 중간 높이로 스냅
      return midHeight;
    }
    
    return closest;
  }, [getMaxSheetHeight]);

  // 시트가 최대 높이이고 스크롤이 맨 위에 있는지 확인
  const isAtTopAndMaxHeight = useCallback(() => {
    const maxHeight = getMaxSheetHeight();
    const isMaxHeight = Math.abs(sheetHeight - maxHeight) < 5; // 5px 오차 허용
    
    if (!isMaxHeight) return false;
    
    const contentEl = sheetContentRef.current;
    if (!contentEl) return false;
    
    // 스크롤이 맨 위에 있는지 확인 (5px 오차 허용)
    return contentEl.scrollTop <= 5;
  }, [sheetHeight, getMaxSheetHeight]);
  
  // 스크롤이 맨 위에 있는지 확인
  const isScrollAtTop = useCallback(() => {
    const contentEl = sheetContentRef.current;
    if (!contentEl) return false;
    return contentEl.scrollTop <= 5;
  }, []);

  // 하단 시트 드래그 시작
  const handleSheetMouseDown = useCallback((e) => {
    setIsDragging(true);
    setIsTransitioning(false); // 드래그 시작 시 transition 비활성화
    dragStateRef.current.startY = e.clientY;
    dragStateRef.current.startHeight = sheetHeight;
    scrollStateRef.current.wasDraggingDown = false; // 초기화
    e.preventDefault();
  }, [sheetHeight]);

  // 하단 시트 드래그 중 (requestAnimationFrame으로 부드럽게)
  const handleSheetMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    // 이전 애니메이션 프레임 취소
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    // requestAnimationFrame으로 부드러운 업데이트
    animationFrameRef.current = requestAnimationFrame(() => {
      const currentY = e.clientY;
      const startY = dragStateRef.current.startY;
      const deltaY = startY - currentY; // 위로 드래그하면 양수
      let newHeight = dragStateRef.current.startHeight + deltaY;
      
      // 최소/최대 높이 제한 (header 밑까지)
      const maxHeight = getMaxSheetHeight();
      newHeight = Math.max(MIN_SHEET_HEIGHT, Math.min(maxHeight, newHeight));
      
      // 아래로 드래그 중임을 표시 (마우스가 아래로 이동 = clientY 증가)
      if (currentY > startY) {
        scrollStateRef.current.wasDraggingDown = true;
      }
      
      setSheetHeight(newHeight);
    });
  }, [isDragging, getMaxSheetHeight]);

  // 하단 시트 드래그 종료 (스냅 포인트로 이동)
  const handleSheetMouseUp = useCallback(() => {
    setIsDragging(false);
    
    // 애니메이션 프레임 취소
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    // 아래로 드래그한 경우 현재 위치 유지, 위로 드래그한 경우만 스냅
    const wasDraggingDown = scrollStateRef.current.wasDraggingDown;
    const finalHeight = sheetHeight;
    const startHeight = dragStateRef.current.startHeight;
    
    // 아래로 드래그했는지 확인 (wasDraggingDown 플래그 또는 높이 비교)
    const actuallyDraggedDown = wasDraggingDown || (finalHeight < startHeight - 5);
    
    if (actuallyDraggedDown && finalHeight < getMaxSheetHeight() - 10) {
      // 아래로 드래그한 경우, 현재 위치에서 고정
      const targetHeight = Math.max(finalHeight, MIN_SHEET_HEIGHT);
    setIsTransitioning(true);
      setSheetHeight(targetHeight);
    } else {
      // 위로 드래그한 경우에만 스냅 포인트 사용
      setIsTransitioning(true);
      const snapHeight = getSnapHeight(finalHeight, actuallyDraggedDown);
    setSheetHeight(snapHeight);
    }
    
    // transition 완료 후 transition 상태 해제
    setTimeout(() => {
      setIsTransitioning(false);
    }, 200);
  }, [sheetHeight, getSnapHeight, getMaxSheetHeight]);

  // 터치 이벤트 핸들러
  const handleSheetTouchStart = useCallback((e) => {
    setIsDragging(true);
    setIsTransitioning(false);
    dragStateRef.current.startY = e.touches[0].clientY;
    dragStateRef.current.startHeight = sheetHeight;
    scrollStateRef.current.wasDraggingDown = false; // 초기화
  }, [sheetHeight]);

  const handleSheetTouchMove = useCallback((e) => {
    if (!isDragging) return;
    
    // 이전 애니메이션 프레임 취소
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    // requestAnimationFrame으로 부드러운 업데이트
    animationFrameRef.current = requestAnimationFrame(() => {
      const currentY = e.touches[0].clientY;
      const startY = dragStateRef.current.startY;
      const deltaY = startY - currentY;
      let newHeight = dragStateRef.current.startHeight + deltaY;
      
      const maxHeight = getMaxSheetHeight();
      newHeight = Math.max(MIN_SHEET_HEIGHT, Math.min(maxHeight, newHeight));
      
      // 아래로 드래그 중임을 표시 (손가락이 아래로 이동 = clientY 증가)
      if (currentY > startY) {
        scrollStateRef.current.wasDraggingDown = true;
      }
      
      setSheetHeight(newHeight);
    });
  }, [isDragging, getMaxSheetHeight]);

  const handleSheetTouchEnd = useCallback(() => {
    setIsDragging(false);
    
    // 애니메이션 프레임 취소
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    // 아래로 드래그한 경우 현재 위치 유지, 위로 드래그한 경우만 스냅
    const wasDraggingDown = scrollStateRef.current.wasDraggingDown;
    const finalHeight = sheetHeight;
    const startHeight = dragStateRef.current.startHeight;
    
    // 아래로 드래그했는지 확인 (wasDraggingDown 플래그 또는 높이 비교)
    const actuallyDraggedDown = wasDraggingDown || (finalHeight < startHeight - 5);
    
    if (actuallyDraggedDown && finalHeight < getMaxSheetHeight() - 10) {
      // 아래로 드래그한 경우, 현재 위치에서 고정
      const targetHeight = Math.max(finalHeight, MIN_SHEET_HEIGHT);
    setIsTransitioning(true);
      setSheetHeight(targetHeight);
    } else {
      // 위로 드래그한 경우에만 스냅 포인트 사용
      setIsTransitioning(true);
      const snapHeight = getSnapHeight(finalHeight, actuallyDraggedDown);
    setSheetHeight(snapHeight);
    }
    
    // transition 완료 후 transition 상태 해제
    setTimeout(() => {
      setIsTransitioning(false);
    }, 200);
  }, [sheetHeight, getSnapHeight, getMaxSheetHeight]);

  // 시트가 최대 높이일 때 아래로 드래그하는 핸들러 (드래그 핸들, 헤더용)
  const handleMaxHeightDragDown = useCallback((e) => {
    const maxHeight = getMaxSheetHeight();
    const isMaxHeight = Math.abs(sheetHeight - maxHeight) < 5;
    
    if (!isMaxHeight) return;
    
    const deltaY = e.touches[0].clientY - dragStateRef.current.startY;
    
    // 아래로 드래그하면 (양수) 시트를 내리기
    if (deltaY > 3) {
      e.preventDefault();
      e.stopPropagation();
      
      // 이미 드래그 중이면 전역 핸들러가 처리하도록
      if (scrollStateRef.current.isDraggingSheet) {
        return;
      }
      
      scrollStateRef.current.isDraggingSheet = true;
      scrollStateRef.current.wasDraggingDown = true; // 아래로 드래그했음을 표시
      
      setIsDragging(true);
      setIsTransitioning(false);
      dragStateRef.current.startY = e.touches[0].clientY;
      dragStateRef.current.startHeight = sheetHeight;
      
      // 기존 핸들러 제거
      if (globalTouchHandlersRef.current.move) {
        document.removeEventListener('touchmove', globalTouchHandlersRef.current.move);
      }
      if (globalTouchHandlersRef.current.end) {
        document.removeEventListener('touchend', globalTouchHandlersRef.current.end);
      }
      
      // 전역 터치 이벤트로 전환
      const handleGlobalTouchMove = (globalE) => {
        if (!scrollStateRef.current.isDraggingSheet) return;
        
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        
        animationFrameRef.current = requestAnimationFrame(() => {
          const currentY = globalE.touches[0].clientY;
          const startY = dragStateRef.current.startY;
          const globalDeltaY = startY - currentY;
          let newHeight = dragStateRef.current.startHeight + globalDeltaY;
          
          const maxHeight = getMaxSheetHeight();
          newHeight = Math.max(MIN_SHEET_HEIGHT, Math.min(maxHeight, newHeight));
          
          // 아래로 드래그 중임을 표시 (손가락이 아래로 이동 = clientY 증가)
          if (currentY > startY) {
            scrollStateRef.current.wasDraggingDown = true;
          }
          
          setSheetHeight(newHeight);
        });
        
        globalE.preventDefault();
      };
      
      const handleGlobalTouchEnd = () => {
        const wasDraggingDown = scrollStateRef.current.wasDraggingDown;
        const finalHeight = sheetHeight; // 현재 높이 저장
        const startHeight = dragStateRef.current.startHeight;
        
        // 아래로 드래그했는지 확인 (wasDraggingDown 플래그 또는 높이 비교)
        const actuallyDraggedDown = wasDraggingDown || (finalHeight < startHeight - 5);
        
        scrollStateRef.current.isDraggingSheet = false;
        scrollStateRef.current.wasDraggingDown = false;
        setIsDragging(false);
        
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        
        // 아래로 드래그한 경우, 현재 위치에서 고정 (최대 높이로 올라가지 않음)
        if (actuallyDraggedDown && finalHeight < getMaxSheetHeight() - 10) {
          // 현재 높이를 그대로 유지 (최소 높이보다 작으면 최소 높이로만 조정)
          const targetHeight = Math.max(finalHeight, MIN_SHEET_HEIGHT);
          
          setIsTransitioning(true);
          setSheetHeight(targetHeight);
        } else {
          // 위로 드래그한 경우에만 스냅 포인트 사용
          setIsTransitioning(true);
          const snapHeight = getSnapHeight(finalHeight, actuallyDraggedDown);
          setSheetHeight(snapHeight);
        }
        
        setTimeout(() => {
          setIsTransitioning(false);
          document.removeEventListener('touchmove', handleGlobalTouchMove);
          document.removeEventListener('touchend', handleGlobalTouchEnd);
          globalTouchHandlersRef.current.move = null;
          globalTouchHandlersRef.current.end = null;
        }, 300);
      };
      
      globalTouchHandlersRef.current.move = handleGlobalTouchMove;
      globalTouchHandlersRef.current.end = handleGlobalTouchEnd;
      
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      document.addEventListener('touchend', handleGlobalTouchEnd);
    }
  }, [sheetHeight, getMaxSheetHeight, getSnapHeight]);

  // 전역 마우스/터치 이벤트 리스너
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleSheetMouseMove);
      document.addEventListener('mouseup', handleSheetMouseUp);
      document.addEventListener('touchmove', handleSheetTouchMove, { passive: false });
      document.addEventListener('touchend', handleSheetTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleSheetMouseMove);
        document.removeEventListener('mouseup', handleSheetMouseUp);
        document.removeEventListener('touchmove', handleSheetTouchMove);
        document.removeEventListener('touchend', handleSheetTouchEnd);
        
        // 애니메이션 프레임 정리
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [isDragging, handleSheetMouseMove, handleSheetMouseUp, handleSheetTouchMove, handleSheetTouchEnd]);
  
  // 컴포넌트 언마운트 시 애니메이션 프레임 정리
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

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
              현재 위치에서 공연장 찾기
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
      
      {/* 선택된 공연장 카드 시트 (목록 위에 표시) */}
      {selectedPlace && (
        <div 
          className={`${styles.selectedPlaceCard} ${isCardVisible ? styles.cardVisible : ''}`}
          style={{ 
            height: selectedPlaceCardHeight === 'max-content' ? 'max-content' : `${selectedPlaceCardHeight}px`,
            maxHeight: selectedPlaceCardHeight === 'max-content' ? 'calc(100vh - 61px - 76px)' : 'none' // header와 footer 제외한 최대 높이
          }}
        >
          {/* 닫기 버튼 */}
          <button 
            className={styles.closeButton}
            onClick={handleCloseSelectedPlaceCard}
            type="button"
            aria-label="닫기"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M18 6L6 18M6 6L18 18" 
                stroke="#6b7280" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
          
          {/* 공연장 카드 내용 */}
          <div className={styles.selectedPlaceCardContent}>
            <PlaceWithPerformancesCard
              {...selectedPlace}
            />
          </div>
        </div>
      )}
      
      {/* 하단 시트 - 공연장 목록 */}
      {places.length > 0 && (
        <div 
          ref={sheetRef}
          className={`${styles.bottomSheet} ${isTransitioning ? styles.transitioning : ''} ${isDragging ? styles.dragging : ''} ${selectedPlace ? styles.sheetHidden : ''}`}
          style={{ height: selectedPlace ? '0px' : `${sheetHeight}px` }}
        >
          {/* 드래그 핸들 */}
          <div 
            className={styles.sheetHandle}
            onMouseDown={handleSheetMouseDown}
            onTouchStart={(e) => {
              const maxHeight = getMaxSheetHeight();
              const isMaxHeight = Math.abs(sheetHeight - maxHeight) < 5;
              
              if (isMaxHeight) {
                // 최대 높이일 때는 아래로 드래그할 수 있도록
                dragStateRef.current.startY = e.touches[0].clientY;
                scrollStateRef.current.isDraggingSheet = false;
                scrollStateRef.current.wasDraggingDown = false;
              } else {
                // 일반 드래그
                handleSheetTouchStart(e);
              }
            }}
            onTouchMove={(e) => {
              const maxHeight = getMaxSheetHeight();
              const isMaxHeight = Math.abs(sheetHeight - maxHeight) < 5;
              
              if (isMaxHeight && !scrollStateRef.current.isDraggingSheet) {
                handleMaxHeightDragDown(e);
              } else if (!isMaxHeight) {
                handleSheetTouchMove(e);
              }
            }}
            onTouchEnd={(e) => {
              const maxHeight = getMaxSheetHeight();
              const isMaxHeight = Math.abs(sheetHeight - maxHeight) < 5;
              
              if (!isMaxHeight) {
                handleSheetTouchEnd();
              }
            }}
          >
            <div className={styles.sheetHandleBar} />
          </div>
          
          {/* 시트 헤더 */}
          <div 
            className={styles.sheetHeader}
            onTouchStart={(e) => {
              const maxHeight = getMaxSheetHeight();
              const isMaxHeight = Math.abs(sheetHeight - maxHeight) < 5;
              
              if (isMaxHeight) {
                // 최대 높이일 때는 아래로 드래그할 수 있도록
                dragStateRef.current.startY = e.touches[0].clientY;
                scrollStateRef.current.isDraggingSheet = false;
                scrollStateRef.current.wasDraggingDown = false;
              }
            }}
            onTouchMove={(e) => {
              const maxHeight = getMaxSheetHeight();
              const isMaxHeight = Math.abs(sheetHeight - maxHeight) < 5;
              
              if (isMaxHeight && !scrollStateRef.current.isDraggingSheet) {
                handleMaxHeightDragDown(e);
              }
            }}
          >
            <h3 className={styles.sheetTitle}>근처 공연장 {places.length}곳</h3>
          </div>
          
          {/* 공연장 목록 */}
          <div 
            ref={sheetContentRef}
            className={styles.sheetContent}
            onTouchStart={(e) => {
              const maxHeight = getMaxSheetHeight();
              const isMaxHeight = Math.abs(sheetHeight - maxHeight) < 5;
              const contentEl = sheetContentRef.current;
              
              // 시트가 최대 높이이고 스크롤이 맨 위일 때 드래그 모드 준비
              if (isMaxHeight && contentEl && contentEl.scrollTop <= 5) {
                scrollStateRef.current.startY = e.touches[0].clientY;
                scrollStateRef.current.initialScrollTop = contentEl.scrollTop;
                scrollStateRef.current.isDraggingSheet = false;
                scrollStateRef.current.wasDraggingDown = false;
                scrollStateRef.current.isContentScrolling = false;
              }
            }}
            onTouchMove={(e) => {
              // 이미 sheet를 드래그 중이면 전역 핸들러가 처리
              if (scrollStateRef.current.isDraggingSheet) {
                return;
              }
              
              const maxHeight = getMaxSheetHeight();
              const isMaxHeight = Math.abs(sheetHeight - maxHeight) < 5;
              const contentEl = sheetContentRef.current;
              
              if (!isMaxHeight || !contentEl) {
                return;
              }
              
              const currentScrollTop = contentEl.scrollTop;
              const deltaY = e.touches[0].clientY - scrollStateRef.current.startY;
              
              // 스크롤이 맨 위에 있고 아래로 드래그하면 sheet를 내림
              if (currentScrollTop <= 5 && deltaY > 3) {
                // 스크롤이 아니라 sheet를 드래그
                e.preventDefault();
                e.stopPropagation();
                
                scrollStateRef.current.isDraggingSheet = true;
                scrollStateRef.current.wasDraggingDown = true;
                scrollStateRef.current.isContentScrolling = false;
                
                setIsDragging(true);
                setIsTransitioning(false);
                dragStateRef.current.startY = e.touches[0].clientY;
                dragStateRef.current.startHeight = sheetHeight;
                
                // 기존 핸들러 제거
                if (globalTouchHandlersRef.current.move) {
                  document.removeEventListener('touchmove', globalTouchHandlersRef.current.move);
                }
                if (globalTouchHandlersRef.current.end) {
                  document.removeEventListener('touchend', globalTouchHandlersRef.current.end);
                }
                
                // 전역 터치 이벤트로 전환
                const handleGlobalTouchMove = (globalE) => {
                  if (!scrollStateRef.current.isDraggingSheet) return;
                  
                  if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                  }
                  
                  animationFrameRef.current = requestAnimationFrame(() => {
                    const currentY = globalE.touches[0].clientY;
                    const startY = dragStateRef.current.startY;
                    const globalDeltaY = startY - currentY;
                    let newHeight = dragStateRef.current.startHeight + globalDeltaY;
                    
                    const maxHeight = getMaxSheetHeight();
                    newHeight = Math.max(MIN_SHEET_HEIGHT, Math.min(maxHeight, newHeight));
                    
                    // 아래로 드래그 중임을 표시 (손가락이 아래로 이동 = clientY 증가)
                    // 아래로 드래그: currentY > startY → deltaY < 0 → newHeight 감소
                    if (currentY > startY) {
                      scrollStateRef.current.wasDraggingDown = true;
                    }
                    
                    setSheetHeight(newHeight);
                  });
                  
                  globalE.preventDefault();
                };
                
                const handleGlobalTouchEnd = () => {
                  const wasDraggingDown = scrollStateRef.current.wasDraggingDown;
                  const finalHeight = sheetHeight;
                  const startHeight = dragStateRef.current.startHeight;
                  
                  // 아래로 드래그했는지 확인 (wasDraggingDown 플래그 또는 높이 비교)
                  const actuallyDraggedDown = wasDraggingDown || (finalHeight < startHeight - 5);
                  
                  scrollStateRef.current.isDraggingSheet = false;
                  scrollStateRef.current.wasDraggingDown = false;
                  scrollStateRef.current.isContentScrolling = false;
                  setIsDragging(false);
                  
                  if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                  }
                  
                  // 아래로 드래그한 경우, 현재 위치에서 고정
                  if (actuallyDraggedDown && finalHeight < getMaxSheetHeight() - 10) {
                    const targetHeight = Math.max(finalHeight, MIN_SHEET_HEIGHT);
                  setIsTransitioning(true);
                    setSheetHeight(targetHeight);
                  } else {
                    setIsTransitioning(true);
                    const snapHeight = getSnapHeight(finalHeight, actuallyDraggedDown);
                  setSheetHeight(snapHeight);
                  }
                  
                  setTimeout(() => {
                    setIsTransitioning(false);
                    document.removeEventListener('touchmove', handleGlobalTouchMove);
                    document.removeEventListener('touchend', handleGlobalTouchEnd);
                    globalTouchHandlersRef.current.move = null;
                    globalTouchHandlersRef.current.end = null;
                  }, 300);
                };
                
                globalTouchHandlersRef.current.move = handleGlobalTouchMove;
                globalTouchHandlersRef.current.end = handleGlobalTouchEnd;
                
                document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
                document.addEventListener('touchend', handleGlobalTouchEnd);
              } else if (deltaY < -3 && currentScrollTop > 5) {
                // 위로 드래그하고 스크롤이 맨 위가 아니면 일반 스크롤
                scrollStateRef.current.isContentScrolling = true;
              }
            }}
            onTouchEnd={() => {
              // 터치 종료 시 상태 리셋
              if (!scrollStateRef.current.isDraggingSheet) {
                scrollStateRef.current.isContentScrolling = false;
              }
            }}
            onWheel={(e) => {
              // 시트가 최대 높이이고 스크롤이 맨 위일 때 위로 스크롤하면 시트 내리기
              if (isAtTopAndMaxHeight() && e.deltaY < 0) {
                e.preventDefault();
                const midHeight = (MIN_SHEET_HEIGHT + getMaxSheetHeight()) / 2;
                setIsTransitioning(true);
                setSheetHeight(midHeight);
                setTimeout(() => setIsTransitioning(false), 300);
              }
            }}
          >
            <ul className={styles.placeList}>
              {places.map((place, index) => (
                <PlaceWithPerformancesCard
                  key={place.id + "_" + index}
                  {...place}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
});

PlaceMapView.displayName = 'PlaceMapView';

export default PlaceMapView;

