/**
 * 티켓 OCR API 응답을 프론트엔드 형식으로 정제
 */

/**
 * 티켓 OCR API 응답을 프론트엔드 입력 형식으로 변환
 * @param {Object} apiResponse - API 응답 (TicketOcrResponseDto)
 * @param {string} apiResponse.performanceName - 공연명
 * @param {string} apiResponse.performanceDate - LocalDateTime 형식 (yyyy-MM-ddTHH:mm:ss)
 * @param {string} apiResponse.seatInfo - 좌석 정보 문자열 ("나 구역 15열 23번")
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
      section: '',
      row: '',
      number: '',
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

  // 2) seatInfo 문자열 → 구역/열/번 분리
  // `-` 기준으로 나누고 뒤에서부터 최대 3칸으로 채우기
  // 예: "11열-2번" -> (빈칸) (11) (2)
  // 예: "2층-A구역-3열-15" -> (2층 A) (3) (15)
  // 예: "다구역-7열-1번" -> (다) (7) (1)
  if (apiResponse.seatInfo) {
    const seatInfo = apiResponse.seatInfo.trim();
    console.log('💺 [normalizeTicketOcr] 원본 seatInfo:', seatInfo);
    
    // `-` 기준으로 분리
    const parts = seatInfo.split('-').map(part => part.trim()).filter(part => part.length > 0);
    console.log('💺 [normalizeTicketOcr] 분리된 parts:', parts);
    
    // 초기값
    frontendData.section = '';
    frontendData.row = '';
    frontendData.number = '';
    
    if (parts.length === 0) {
      // 빈 문자열인 경우 - 이미 초기값으로 설정됨
    } else if (parts.length === 1) {
      // 하나만 있는 경우 -> 구역으로 처리
      frontendData.section = parts[0];
    } else {
      // 2개 이상인 경우 -> 뒤에서부터 최대 3칸으로 채우기
      // 뒤에서부터: [구역들...] [열] [번]
      
      // 마지막 부분에서 숫자 추출 (번)
      const lastPart = parts[parts.length - 1];
      const lastNumber = lastPart.match(/\d+/);
      
      // 마지막에서 두 번째 부분에서 숫자 추출 (열)
      const secondLastPart = parts.length >= 2 ? parts[parts.length - 2] : '';
      const secondLastNumber = secondLastPart.match(/\d+/);
      
      if (lastNumber && secondLastNumber) {
        // 열과 번이 모두 있는 경우
        // 예: "2층-A구역-3열-15" -> (2층 A) (3) (15)
        // 예: "다구역-7열-1번" -> (다) (7) (1)
        frontendData.number = lastNumber[0];
        frontendData.row = secondLastNumber[0];
        
        // 나머지 앞부분을 구역으로 합치기
        if (parts.length > 2) {
          const sectionParts = parts.slice(0, parts.length - 2);
          // 각 부분에서 숫자와 "열", "번" 같은 단어 제거하고 구역명만 추출
          const cleanSectionParts = sectionParts.map(part => {
            // "열", "번" 같은 단어 제거
            return part.replace(/\d+\s*(열|번)/g, '').trim();
          }).filter(part => part.length > 0);
          
          frontendData.section = cleanSectionParts.join(' ');
        }
      } else if (lastNumber) {
        // 번만 있는 경우
        // 예: "11열-2번" -> (빈칸) (11) (2)
        // "11열"에서 숫자 추출
        const firstNumber = parts[0].match(/\d+/);
        if (firstNumber) {
          frontendData.row = firstNumber[0];
          frontendData.number = lastNumber[0];
          // 구역은 빈칸
        } else {
          // 첫 번째가 숫자가 아니면 구역으로 처리
          frontendData.section = parts.slice(0, parts.length - 1).join(' ');
          frontendData.number = lastNumber[0];
        }
      } else if (secondLastNumber) {
        // 열만 있는 경우
        frontendData.row = secondLastNumber[0];
        const sectionParts = parts.slice(0, parts.length - 1);
        const cleanSectionParts = sectionParts.map(part => {
          return part.replace(/\d+\s*(열|번)/g, '').trim();
        }).filter(part => part.length > 0);
        frontendData.section = cleanSectionParts.join(' ');
      } else {
        // 숫자가 없는 경우 -> 모두 구역으로 처리
        frontendData.section = parts.join(' ');
      }
    }
    
    console.log('💺 [normalizeTicketOcr] 변환된 좌석 정보:', {
      section: frontendData.section,
      row: frontendData.row,
      number: frontendData.number
    });
  } else {
    frontendData.section = '';
    frontendData.row = '';
    frontendData.number = '';
  }

  console.log('✅ [normalizeTicketOcr] 최종 변환 결과:', frontendData);
  return frontendData;
};

