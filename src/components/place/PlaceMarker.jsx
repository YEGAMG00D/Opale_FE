// src/components/place/PlaceMarker.jsx

import { fetchPlacePerformances } from '../../api/placeApi';
import { normalizePlacePerformances } from '../../services/normalizePlacePerformance';

/**
 * 공연장 마커 HTML 생성 함수
 * 네이버 지도 API의 Marker icon content로 사용
 * @param {Object} place - 공연장 정보
 * @returns {Promise<{html: string, anchor: {x: number, y: number}}>} 마커 HTML 문자열과 anchor 포인트
 */
export const createPlaceMarkerHTML = async (place) => {
  // 기본 마커 HTML (공연이 없을 때) - 작은 동그라미
  const defaultMarkerHTML = `
    <div style="
      width: 32px;
      height: 32px;
      background-color: #DFE6F6;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    "></div>
  `;
  const defaultAnchor = { x: 16, y: 16 }; // 32px / 2

  if (!place || !place.id) {
    return { html: defaultMarkerHTML, anchor: defaultAnchor };
  }

  // 공연 정보 가져오기
  try {
    const data = await fetchPlacePerformances(place.id);
    const normalized = normalizePlacePerformances(data);
    
    // 현재 상영중인 공연만 필터링
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const currentPerformances = normalized.filter((perf) => {
      if (!perf.startDate || !perf.endDate) return false;
      
      const start = new Date(perf.startDate);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(perf.endDate);
      end.setHours(0, 0, 0, 0);
      
      return today >= start && today <= end;
    });

    // 현재 상영중인 공연이 있으면 포스터 표시
    if (currentPerformances.length > 0) {
      const firstPerformance = currentPerformances[0];
      const posterUrl = firstPerformance.poster || '/placeholder-poster.png';
      
      const markerWithPosterHTML = `
        <div style="
          width: 48px;
          height: 48px;
          background-color: #ffffff;
          border: 3px solid #DFE6F6;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        ">
          <img 
            src="${posterUrl}" 
            alt="${firstPerformance.title || '공연 포스터'}"
            style="
              width: 100%;
              height: 100%;
              object-fit: cover;
              border-radius: 50%;
            "
            onerror="this.onerror=null; this.src='/placeholder-poster.png';"
          />
        </div>
      `;
      const posterAnchor = { x: 24, y: 24 }; // 48px / 2
      
      return { html: markerWithPosterHTML, anchor: posterAnchor };
    }
  } catch (error) {
    console.warn('⚠️ 공연장 마커 포스터 로드 실패:', error);
  }

  // 공연이 없거나 로드 실패 시 기본 마커
  return { html: defaultMarkerHTML, anchor: defaultAnchor };
};

// PlaceMarker 컴포넌트는 현재 사용하지 않지만, 
// 향후 확장을 위해 남겨둡니다.
// 실제로는 createPlaceMarkerHTML 함수만 사용합니다.

