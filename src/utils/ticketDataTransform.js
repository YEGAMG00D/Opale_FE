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
 * @param {string} frontendData.section - 구역
 * @param {string} frontendData.row - 열
 * @param {string} frontendData.number - 번
 * @param {string} frontendData.placeName - 공연장명 (선택)
 * @param {number} frontendData.performanceId - 공연 ID (선택)
 * @param {number} frontendData.placeId - 공연장 ID (선택)
 * @returns {Object} - 백엔드 API 요청 DTO
 */
export const transformTicketDataForApi = (frontendData) => {
  const dto = {
    performanceName: frontendData.performanceName || '',
  };

  // performanceId가 있으면 포함
  if (frontendData.performanceId) {
    dto.performanceId = frontendData.performanceId;
  }

  // placeId가 있으면 포함
  if (frontendData.placeId) {
    dto.placeId = frontendData.placeId;
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

  // 2) 구역/열/번 → seatInfo 문자열로 변환
  // seatInfo = "구역 열열 번번" 형식
  const seatSection = frontendData.section || '';
  const seatRow = frontendData.row || '';
  const seatNumber = frontendData.number || '';

  if (seatSection || seatRow || seatNumber) {
    let seatInfoParts = [];
    
    if (seatSection) {
      seatInfoParts.push(seatSection);
    }
    
    if (seatRow) {
      seatInfoParts.push(`${seatRow}열`);
    }
    
    if (seatNumber) {
      seatInfoParts.push(`${seatNumber}번`);
    }
    
    dto.seatInfo = seatInfoParts.join(' ');
  } else {
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
 * @param {string} apiResponse.seatInfo - 좌석 정보 문자열 ("구역 열열 번번")
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

  // 2) seatInfo 문자열 → 구역/열/번 분리
  // seatInfo: "나 구역 15열 23번" → section: "나 구역", row: "15", number: "23"
  if (apiResponse.seatInfo) {
    const seatInfo = apiResponse.seatInfo.trim();
    
    // 정규식으로 "열", "번" 패턴 찾기
    // 예: "나 구역 15열 23번" 또는 "R석 15열 23번"
    const rowMatch = seatInfo.match(/(\d+)\s*열/);
    const numberMatch = seatInfo.match(/(\d+)\s*번/);
    
    if (rowMatch && numberMatch) {
      // 열과 번이 모두 있는 경우
      const rowIndex = seatInfo.indexOf(rowMatch[0]);
      const numberIndex = seatInfo.indexOf(numberMatch[0]);
      
      // 구역은 열 앞부분
      frontendData.section = seatInfo.substring(0, rowIndex).trim();
      frontendData.row = rowMatch[1]; // 숫자만 추출
      frontendData.number = numberMatch[1]; // 숫자만 추출
    } else if (rowMatch) {
      // 열만 있는 경우
      const rowIndex = seatInfo.indexOf(rowMatch[0]);
      frontendData.section = seatInfo.substring(0, rowIndex).trim();
      frontendData.row = rowMatch[1];
      frontendData.number = '';
    } else if (numberMatch) {
      // 번만 있는 경우
      const numberIndex = seatInfo.indexOf(numberMatch[0]);
      frontendData.section = seatInfo.substring(0, numberIndex).trim();
      frontendData.row = '';
      frontendData.number = numberMatch[1];
    } else {
      // 패턴이 맞지 않으면 전체를 구역으로 처리
      frontendData.section = seatInfo;
      frontendData.row = '';
      frontendData.number = '';
    }
  } else {
    frontendData.section = '';
    frontendData.row = '';
    frontendData.number = '';
  }

  return frontendData;
};

