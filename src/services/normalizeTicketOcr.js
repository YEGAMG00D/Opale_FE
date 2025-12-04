/**
 * 티켓 OCR API 응답을 프론트엔드 형식으로 정제
 */

/**
 * 티켓 OCR API 응답을 프론트엔드 입력 형식으로 변환
 * @param {Object} apiResponse - API 응답 (TicketOcrResponseDto)
 * @param {string} apiResponse.performanceName - 공연명
 * @param {string} apiResponse.performanceDate - LocalDateTime 형식 (yyyy-MM-ddTHH:mm:ss)
 * @param {string} apiResponse.seatFront - 좌석 앞부분 (예: "다 11열")
 * @param {string} apiResponse.seatNumber - 좌석 번호 (예: "4")
 * @param {string} apiResponse.seatInfo - 좌석 정보 문자열 (하위 호환성용)
 * @param {string} apiResponse.placeName - 공연장명
 * @returns {Object} - 프론트엔드 입력 형식 데이터
 */
export const normalizeTicketOcr = (apiResponse) => {
  console.log('🔍 [normalizeTicketOcr] 입력 데이터:', apiResponse);
  
  if (!apiResponse) {
    console.warn('⚠️ [normalizeTicketOcr] apiResponse가 null입니다.');
    return {
      performanceName: '',
      performanceDate: '',
      performanceTime: '',
      seatFront: '',
      seatNumber: '',
      placeName: ''
    };
  }

  const frontendData = {
    performanceName: apiResponse.performanceName || '',
    placeName: apiResponse.placeName || '',
  };

  // 1) LocalDateTime → 날짜/시간 분리
  // performanceDate: "2025-10-23T19:00:00" → performanceDate: "2025-10-23", performanceTime: "19:00"
  if (apiResponse.performanceDate) {
    const dateTimeStr = apiResponse.performanceDate;
    console.log('📅 [normalizeTicketOcr] 원본 performanceDate:', dateTimeStr);
    
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
    console.log('📅 [normalizeTicketOcr] 변환된 날짜/시간:', frontendData.performanceDate, frontendData.performanceTime);
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
  // (기존 API 응답을 위한 fallback)
  if (!apiResponse.seatFront && !apiResponse.seatNumber && apiResponse.seatInfo) {
    const seatInfo = apiResponse.seatInfo.trim();
    console.log('💺 [normalizeTicketOcr] seatInfo fallback 처리:', seatInfo);
    
    // "-" 기준으로 분리 시도 (예: "다 11열-4번")
    if (seatInfo.includes('-')) {
      const parts = seatInfo.split('-').map(p => p.trim());
      if (parts.length >= 2) {
        // 마지막 부분을 그대로 사용 (숫자만 추출하지 않고 '번' 포함 그대로)
        const lastPart = parts[parts.length - 1];
        frontendData.seatNumber = lastPart; // '번' 포함 그대로
        // 나머지를 앞부분으로
        frontendData.seatFront = parts.slice(0, parts.length - 1).join(' ').trim();
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
  
  console.log('💺 [normalizeTicketOcr] 변환된 좌석 정보:', {
    seatFront: frontendData.seatFront,
    seatNumber: frontendData.seatNumber
  });

  console.log('✅ [normalizeTicketOcr] 최종 변환 결과:', frontendData);
  return frontendData;
};

