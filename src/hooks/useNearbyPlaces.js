// src/hooks/useNearbyPlaces.js

import { useEffect, useState, useRef } from "react";
import { fetchNearbyPlaces } from "../api/placeApi";
import { normalizePlace } from "../services/normalizePlace";
import { getCurrentLocation, getDefaultLocation } from "../utils/geolocation";

/**
 * 근처 공연장 목록을 조회하는 훅
 * @param {Object} params - { latitude, longitude, radius, sortType, enabled }
 */
export const useNearbyPlaces = (params = {}) => {
  const {
    latitude: providedLatitude,
    longitude: providedLongitude,
    radius = 5000, // 기본 반경 500m
    sortType = "거리순",
    enabled = true, // 훅 활성화 여부
  } = params;

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  const activeRequestId = useRef(0);
  const prevCoordinatesRef = useRef({ latitude: null, longitude: null });

  useEffect(() => {
    // 훅이 비활성화되어 있으면 스킵
    if (!enabled) {
      setPlaces([]);
      setLoading(false);
      // prevCoordinatesRef 초기화 (페이지를 나갔다가 다시 들어올 때를 위해)
      prevCoordinatesRef.current = { latitude: null, longitude: null };
      return;
    }

    const loadNearbyPlaces = async () => {
      // 좌표가 변경되었는지 확인
      const coordinatesChanged = 
        prevCoordinatesRef.current.latitude !== providedLatitude ||
        prevCoordinatesRef.current.longitude !== providedLongitude;
      
      // 좌표가 변경되었거나 처음 호출될 때 로딩 시작
      // (prevCoordinatesRef.current.latitude === null이면 coordinatesChanged도 true가 됨)
      if (coordinatesChanged || prevCoordinatesRef.current.latitude === null) {
        setLoading(true);
        setError(null);
        console.log('🔄 [로딩 시작] 좌표 변경 감지:', {
          prev: prevCoordinatesRef.current,
          current: { latitude: providedLatitude, longitude: providedLongitude }
        });
        // 이전 좌표 저장
        prevCoordinatesRef.current = {
          latitude: providedLatitude,
          longitude: providedLongitude
        };
      }

      const reqId = ++activeRequestId.current;

      try {
        let latitude = providedLatitude;
        let longitude = providedLongitude;
        let gpsLocation = null;

        // GPS 위치는 항상 가져오기 (전역 상태 저장용)
        try {
          const location = await getCurrentLocation();
          gpsLocation = { latitude: location.latitude, longitude: location.longitude };
          setUserLocation(gpsLocation);
          console.log('📍 GPS 위치 획득:', gpsLocation);
        } catch (gpsError) {
          // GPS 실패 시 기본 위치 사용
          const defaultLoc = getDefaultLocation();
          gpsLocation = { latitude: defaultLoc.latitude, longitude: defaultLoc.longitude };
          setUserLocation(gpsLocation);
          console.warn('⚠️ GPS 실패, 기본 위치 사용:', gpsLocation);
        }

        // 좌표가 제공되지 않았으면 GPS 위치 사용
        if (!latitude || !longitude) {
          latitude = gpsLocation.latitude;
          longitude = gpsLocation.longitude;
          console.log('📍 GPS 위치로 근처 공연장 조회:', { latitude, longitude });
        } else {
          console.log('📍 제공된 좌표로 근처 공연장 조회:', { latitude, longitude });
        }

        // 최신 요청만 처리
        if (reqId !== activeRequestId.current) return;

        const dto = {
          latitude,
          longitude,
          radius,
          sortType,
          page: 1,
          size: 100, // 근처 공연장은 한 번에 많이 가져오기
        };

        console.log('📡 근처 공연장 API 호출:', dto);
        const res = await fetchNearbyPlaces(dto);
        console.log('✅ 근처 공연장 API 응답:', res);

        // 최신 요청만 반영
        if (reqId !== activeRequestId.current) return;

        const list = res.places?.map(normalizePlace) ?? [];
        console.log('📍 정규화된 공연장 목록:', list);
        console.log('📍 공연장 개수:', list.length);
        console.log('📊 API 응답 상세:', {
          totalCount: res.totalCount,
          placesCount: res.places?.length ?? 0,
          normalizedCount: list.length,
          requestParams: dto
        });
        
        setPlaces(list);
        setTotalCount(res.totalCount ?? 0);
        
        // 공연장이 없어도 에러가 아님 (정상적인 결과)
        if (list.length === 0) {
          console.log('⚠️ [디버깅] 해당 범위에 공연장이 없습니다.');
          console.log('⚠️ [디버깅] 검색 파라미터:', {
            center: { latitude, longitude },
            radius: radius,
            radiusKm: (radius / 1000).toFixed(2) + 'km'
          });
          console.log('⚠️ [디버깅] API 응답 totalCount:', res.totalCount);
          setError(null); // 에러가 아닌 빈 결과
        } else {
          console.log('✅ [디버깅] 공연장을 찾았습니다:', list.length, '개');
          setError(null);
        }
      } catch (err) {
        // 최신 요청만 에러 처리
        if (reqId === activeRequestId.current) {
          console.error("❌ 근처 공연장 목록 호출 실패:", err);
          setError(err.message || "근처 공연장을 불러오는 중 오류가 발생했습니다.");
          setPlaces([]);
        }
      } finally {
        // 최신 요청만 로딩 상태 해제
        if (reqId === activeRequestId.current) {
          setLoading(false);
        }
      }
    };

    loadNearbyPlaces();

    // cleanup
    return () => {
      activeRequestId.current++;
    };
  }, [enabled, providedLatitude, providedLongitude, radius, sortType]);

  return {
    places,
    loading,
    error,
    userLocation,
    totalCount,
  };
};

