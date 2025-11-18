import React, { useEffect, useRef, useState } from 'react';
import styles from './PlaceMapView.module.css';
import { loadNaverMapScript } from '../../utils/loadNaverMap';

/**
 * 여러 공연장 위치를 표시하는 네이버 지도 컴포넌트
 * @param {Array} places - 공연장 배열 [{ id, name, latitude, longitude, address }, ...]
 * @param {string} clientId - 네이버 지도 API Client ID (선택사항, 환경변수에서 가져옴)
 */
const PlaceMapView = ({ places = [], clientId }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowsRef = useRef([]);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(null);

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

    // 네이버 지도 API 스크립트 로드
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

        // 유효한 위치 정보가 있는 공연장만 필터링
        const validPlaces = places.filter(
          place => place.latitude && place.longitude && 
          !isNaN(parseFloat(place.latitude)) && 
          !isNaN(parseFloat(place.longitude))
        );

        if (validPlaces.length === 0) {
          // 기본 위치 (서울 시청)
          const defaultCenter = new window.naver.maps.LatLng(37.5665, 126.9780);
          const mapOptions = {
            center: defaultCenter,
            zoom: 11,
            zoomControl: false,
            draggable: false,
            scrollWheelZoom: false,
            pinchZoom: false,
            keyboardShortcuts: false,
            disableDoubleClickZoom: true,
            disableDoubleClick: true,
          };
          const map = new window.naver.maps.Map(mapRef.current, mapOptions);
          mapInstanceRef.current = map;
          setMapLoading(false);
          return;
        }

        // 모든 마커의 중심점 계산
        const bounds = new window.naver.maps.LatLngBounds();
        validPlaces.forEach(place => {
          bounds.extend(new window.naver.maps.LatLng(place.latitude, place.longitude));
        });

        // 지도 옵션 설정
        const mapOptions = {
          center: bounds.getCenter(),
          zoom: 11,
          zoomControl: false,
          draggable: false,
          scrollWheelZoom: false,
          pinchZoom: false,
          keyboardShortcuts: false,
          disableDoubleClickZoom: true,
          disableDoubleClick: true,
        };

        // 지도 생성
        const map = new window.naver.maps.Map(mapRef.current, mapOptions);
        mapInstanceRef.current = map;

        // 모든 마커가 보이도록 bounds 조정
        if (validPlaces.length > 1) {
          map.fitBounds(bounds);
        }

        // 기존 마커와 정보창 정리
        markersRef.current.forEach(marker => {
          if (marker) marker.setMap(null);
        });
        infoWindowsRef.current.forEach(infoWindow => {
          if (infoWindow) infoWindow.close();
        });
        markersRef.current = [];
        infoWindowsRef.current = [];

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
      markersRef.current.forEach(marker => {
        if (marker) {
          marker.setMap(null);
        }
      });
      infoWindowsRef.current.forEach(infoWindow => {
        if (infoWindow) {
          infoWindow.close();
        }
      });
      markersRef.current = [];
      infoWindowsRef.current = [];
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
      if (window.navermap_authFailure) {
        delete window.navermap_authFailure;
      }
    };
  }, [places, clientId]);

  return (
    <div className={styles.mapContainer}>
      <div ref={mapRef} className={styles.map} />
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

