/**
 * 티켓 단일 상세 조회 API 응답을 프론트엔드 형식으로 정제
 */

import { transformTicketDataFromApi } from '../utils/ticketDataTransform';

/**
 * 티켓 단일 상세 조회 API 응답을 프론트엔드 형식으로 변환
 * @param {Object} apiResponse - API 응답 (TicketDetailResponseDto)
 * @param {number} apiResponse.ticketId - 티켓 ID
 * @param {string} apiResponse.performanceName - 공연명
 * @param {string} apiResponse.performanceId - 공연 ID
 * @param {string} apiResponse.placeId - 공연장 ID
 * @param {string} apiResponse.performanceDate - 공연 관람 날짜 및 시간 (LocalDateTime)
 * @param {string} apiResponse.seatInfo - 좌석 정보
 * @param {string} apiResponse.placeName - 공연장명
 * @param {string} apiResponse.ticketImageUrl - 티켓 이미지 URL
 * @param {boolean} apiResponse.isVerified - 티켓 인증 여부
 * @param {string} apiResponse.source - 인증 방식 (OCR / MANUAL / ADMIN)
 * @returns {Object} - 정제된 티켓 상세 데이터
 */
export const normalizeTicketDetail = (apiResponse) => {
  if (!apiResponse) {
    return null;
  }

  // TicketDetailResponseDto를 프론트엔드 형식으로 변환
  const frontendData = transformTicketDataFromApi({
    performanceName: apiResponse.performanceName,
    performanceDate: apiResponse.performanceDate,
    seatFront: apiResponse.seatFront,
    seatNumber: apiResponse.seatNumber,
    seatInfo: apiResponse.seatInfo, // 하위 호환성용
    placeName: apiResponse.placeName,
    ticketImageUrl: apiResponse.ticketImageUrl,
    performanceId: apiResponse.performanceId,
    placeId: apiResponse.placeId
  });

  return {
    id: apiResponse.ticketId,
    ticketId: apiResponse.ticketId,
    performanceId: apiResponse.performanceId || null,
    placeId: apiResponse.placeId || null,
    performanceName: apiResponse.performanceName || '',
    performanceDate: frontendData?.performanceDate || '',
    performanceTime: frontendData?.performanceTime || '',
    seatFront: frontendData?.seatFront || '',
    seatNumber: frontendData?.seatNumber || '',
    placeName: apiResponse.placeName || '',
    ticketImageUrl: apiResponse.ticketImageUrl || null,
    isVerified: apiResponse.isVerified || false,
    source: apiResponse.source || 'MANUAL',
    requestedAt: apiResponse.requestedAt || null,
    updatedAt: apiResponse.updatedAt || null
  };
};

