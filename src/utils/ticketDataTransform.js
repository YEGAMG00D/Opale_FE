/**
 * 티켓 데이터 변환 유틸리티
 * 프론트엔드 입력 형식 ↔ 백엔드 API DTO 형식 변환
 */

/**
 * 프론트엔드 입력 데이터를 백엔드 API 요청 DTO로 변환
 * @param {Object} frontendData - 프론트엔드 입력 데이터
 * @param {string} frontendData.performanceName - 공연명
 * @param {string} frontendData.performanceDate - 날짜 (yyyy-MM-dd)
 * @param {string} frontendData.performanceTime - 시간 (HH:mm)
 * @param {string} frontendData.seatFront - 좌석 앞부분 (예: "다 11열", "1층 A구역 3열")
 * @param {string} frontendData.seatNumber - 좌석 번호 (예: "4")
 * @param {string} frontendData.placeName - 공연장명 (선택)
 * @param {number} frontendData.performanceId - 공연 ID (선택)
 * @param {number} frontendData.placeId - 공연장 ID (선택)
 * @returns {Object} - 백엔드 API 요청 DTO
 */
export const transformTicketDataForApi = (frontendData) => {
  const dto = {
    performanceName: frontendData.performanceName || '',
  };

  // performanceId가 있으면 포함 (null, undefined가 아닌 경우)
  // 백엔드 DTO는 String 타입이므로 String으로 변환
  if (frontendData.performanceId !== null && frontendData.performanceId !== undefined) {
    dto.performanceId = String(frontendData.performanceId);
    console.log('✅ [transformTicketDataForApi] performanceId 포함:', dto.performanceId);
  } else {
    console.warn('⚠️ [transformTicketDataForApi] performanceId 없음:', frontendData.performanceId);
  }

  // placeId가 있으면 포함 (null, undefined가 아닌 경우)
  // 백엔드 DTO는 String 타입이므로 String으로 변환
  if (frontendData.placeId !== null && frontendData.placeId !== undefined) {
    dto.placeId = String(frontendData.placeId);
    console.log('✅ [transformTicketDataForApi] placeId 포함:', dto.placeId);
  }

  // 1) 날짜 + 시간 → LocalDateTime 형식으로 변환
  // performanceDate: yyyy-MM-dd, performanceTime: HH:mm
  // → performanceDate: yyyy-MM-ddTHH:mm:00
  if (frontendData.performanceDate) {
    if (frontendData.performanceTime) {
      // 시간이 있으면 합쳐서 보내기
      dto.performanceDate = `${frontendData.performanceDate}T${frontendData.performanceTime}:00`;
    } else {
      // 시간이 없으면 날짜만 보내기 (00:00:00으로 설정)
      dto.performanceDate = `${frontendData.performanceDate}T00:00:00`;
    }
  } else {
    // 날짜도 없으면 null
    dto.performanceDate = null;
  }

  // 2) seatFront, seatNumber를 공백으로 연결하여 seatInfo 문자열로 변환
  // 예: seatFront: "다 11열", seatNumber: "4" 또는 "4번" → seatInfo: "다 11열 4번"
  let seatFront = (frontendData.seatFront || '').trim();
  let seatNumber = (frontendData.seatNumber || '').trim();
  
  // seatFront 끝의 '-' 제거 (중복 방지)
  if (seatFront && seatFront.endsWith('-')) {
    seatFront = seatFront.slice(0, -1).trim();
  }
  
  // seatNumber 앞의 '-' 제거 (중복 방지)
  if (seatNumber && seatNumber.startsWith('-')) {
    seatNumber = seatNumber.slice(1).trim();
  }
  
  // seatNumber에 '번'이 없으면 추가
  if (seatNumber && !seatNumber.endsWith('번')) {
    seatNumber = `${seatNumber}번`;
  }
  
  if (seatFront && seatNumber) {
    // 둘 다 있으면: "앞부분 번호번" 형식 (공백으로 연결, 하이픈 없음)
    dto.seatInfo = `${seatFront} ${seatNumber}`;
  } else if (seatFront) {
    // 앞부분만 있으면: 앞부분만
    dto.seatInfo = seatFront;
  } else if (seatNumber) {
    // 번호만 있으면: 번호번 형식
    dto.seatInfo = seatNumber;
  } else {
    // 둘 다 없으면: null
    dto.seatInfo = null;
  }

  // 3) 공연장명 (선택)
  if (frontendData.placeName) {
    dto.placeName = frontendData.placeName;
  }

  return dto;
};

/**
 * 백엔드 API 응답 DTO를 프론트엔드 입력 형식으로 변환
 * @param {Object} apiResponse - 백엔드 API 응답 (TicketDetailResponseDto)
 * @param {string} apiResponse.performanceDate - LocalDateTime 형식 (yyyy-MM-ddTHH:mm:ss)
 * @param {string} apiResponse.seatFront - 좌석 앞부분 (예: "다 11열")
 * @param {string} apiResponse.seatNumber - 좌석 번호 (예: "4")
 * @param {string} apiResponse.seatInfo - 좌석 정보 문자열 (하위 호환성용, seatFront/seatNumber가 없을 때만 사용)
 * @returns {Object} - 프론트엔드 입력 형식 데이터
 */
export const transformTicketDataFromApi = (apiResponse) => {
  if (!apiResponse) return null;

  const frontendData = {
    performanceName: apiResponse.performanceName || '',
    placeName: apiResponse.placeName || '',
    ticketImageUrl: apiResponse.ticketImageUrl || null,
    performanceId: apiResponse.performanceId || null,
    placeId: apiResponse.placeId || null,
  };

  // 1) LocalDateTime → 날짜/시간 분리
  // performanceDate: "2025-10-23T19:00:00" → performanceDate: "2025-10-23", performanceTime: "19:00"
  if (apiResponse.performanceDate) {
    const dateTimeStr = apiResponse.performanceDate;
    
    // ISO 형식 파싱
    if (dateTimeStr.includes('T')) {
      const [datePart, timePart] = dateTimeStr.split('T');
      frontendData.performanceDate = datePart; // yyyy-MM-dd
      
      if (timePart) {
        // HH:mm:ss 또는 HH:mm 형식에서 시간만 추출
        const timeOnly = timePart.split(':').slice(0, 2).join(':');
        frontendData.performanceTime = timeOnly; // HH:mm
      } else {
        frontendData.performanceTime = '';
      }
    } else {
      // 날짜만 있는 경우
      frontendData.performanceDate = dateTimeStr;
      frontendData.performanceTime = '';
    }
  } else {
    frontendData.performanceDate = '';
    frontendData.performanceTime = '';
  }

  // 2) seatFront, seatNumber를 그대로 사용
  // 백엔드에서 seatFront, seatNumber를 제공하는 경우
  if (apiResponse.seatFront !== undefined) {
    frontendData.seatFront = apiResponse.seatFront || '';
  } else {
    frontendData.seatFront = '';
  }
  
  if (apiResponse.seatNumber !== undefined) {
    frontendData.seatNumber = apiResponse.seatNumber || '';
  } else {
    frontendData.seatNumber = '';
  }

  // 하위 호환성: seatFront/seatNumber가 없고 seatInfo만 있는 경우
  // (기존 데이터를 위한 fallback)
  if (!apiResponse.seatFront && !apiResponse.seatNumber && apiResponse.seatInfo) {
    const seatInfo = apiResponse.seatInfo.trim();
    
    // "-" 기준으로 분리 시도 (예: "다 11열-4번")
    if (seatInfo.includes('-')) {
      const parts = seatInfo.split('-').map(p => p.trim());
      if (parts.length >= 2) {
        // 마지막 부분에서 숫자 추출 (번)
        const lastPart = parts[parts.length - 1];
        const numberMatch = lastPart.match(/(\d+)/);
        
        if (numberMatch) {
          frontendData.seatNumber = numberMatch[1];
          // 나머지를 앞부분으로
          frontendData.seatFront = parts.slice(0, parts.length - 1).join(' ').trim();
        } else {
          frontendData.seatFront = parts.slice(0, parts.length - 1).join(' ').trim();
          frontendData.seatNumber = '';
        }
      } else {
        frontendData.seatFront = seatInfo;
        frontendData.seatNumber = '';
      }
    } else {
      // "-"가 없으면 전체를 앞부분으로 처리
      frontendData.seatFront = seatInfo;
      frontendData.seatNumber = '';
    }
  }

  return frontendData;
};

