// src/services/normalizePerformanceReview.js

/**
 * 공연 리뷰 API 응답을 UI에 맞게 정규화
 * @param {Object} apiData - API 응답 데이터 (reviews 배열 포함)
 * @returns {Array} - UI에 맞게 변환된 리뷰 배열
 */
export const normalizePerformanceReviews = (apiData) => {
  if (!apiData || !Array.isArray(apiData.reviews)) {
    return [];
  }

  return apiData.reviews.map((review) => {
    // 날짜 포맷팅 (2025-11-12T17:57:53 -> 2025.11.12)
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}.${month}.${day}`;
    };

    // 공연일자 포맷팅 (2025-10-23 -> 2025.10.23)
    const formatPerformanceDate = (dateString) => {
      if (!dateString) return '';
      // 이미 포맷된 형식인지 확인
      if (dateString.includes('.')) return dateString;
      // YYYY-MM-DD 형식을 YYYY.MM.DD로 변환
      if (dateString.includes('-')) {
        return dateString.replace(/-/g, '.');
      }
      // ISO 형식인 경우
      try {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
      } catch {
        return dateString;
      }
    };

    // 좌석 정보 포맷팅 (구역과 열까지만 표시)
    const formatSeatInfo = (review) => {
      // section, row, number 필드가 있는 경우
      if (review.section || review.row) {
        const section = review.section || '';
        const row = review.row || '';
        const number = review.number || '';
        
        if (section && row && number) {
          return `${section} ${row}열 ${number}번`;
        } else if (section && row) {
          return `${section} ${row}열`;
        } else if (section) {
          return section;
        } else if (row) {
          return `${row}열`;
        } else if (number) {
          return `${number}번`;
        }
      }
      
      // seatInfo 필드가 문자열로 있는 경우 파싱 (우선순위)
      if (review.seatInfo) {
        const seatStr = String(review.seatInfo).trim();
        if (seatStr) {
          // "구역 열 번호" 형태를 파싱
          // 예: "나 구역 15열 23번" -> "나 구역 15열 23번" 또는 "나 구역 15열"
          const rowMatch = seatStr.match(/(\d+)\s*열/);
          const numberMatch = seatStr.match(/(\d+)\s*번/);
          
          if (rowMatch && numberMatch) {
            // 열과 번이 모두 있는 경우
            const rowIndex = seatStr.indexOf(rowMatch[0]);
            const section = seatStr.substring(0, rowIndex).trim();
            return `${section} ${rowMatch[1]}열 ${numberMatch[1]}번`;
          } else if (rowMatch) {
            // 열만 있는 경우
            const rowIndex = seatStr.indexOf(rowMatch[0]);
            const section = seatStr.substring(0, rowIndex).trim();
            return `${section} ${rowMatch[1]}열`;
          } else if (numberMatch) {
            // 번만 있는 경우
            const numberIndex = seatStr.indexOf(numberMatch[0]);
            const section = seatStr.substring(0, numberIndex).trim();
            return `${section} ${numberMatch[1]}번`;
          }
          // 패턴이 맞지 않으면 전체를 반환
          return seatStr;
        }
      }
      
      // seat 필드가 문자열로 있는 경우 파싱
      if (review.seat) {
        const seatStr = String(review.seat);
        // "구역 열 번호" 형태를 "구역 열"로 변환
        // 예: "나 구역 15열 23번" -> "나 구역 15열"
        const match = seatStr.match(/(.+?)\s*(\d+)열/);
        if (match) {
          const section = match[1].trim();
          const row = match[2];
          return `${section} ${row}열`;
        }
        // 이미 "구역 열" 형태인 경우 그대로 반환
        if (seatStr.includes('열') && !seatStr.includes('번')) {
          return seatStr;
        }
      }
      
      return '';
    };

    return {
      id: review.performanceReviewId,
      performanceReviewId: review.performanceReviewId,
      performanceId: review.performanceId,
      userId: review.userId,
      title: review.title || '',
      content: review.contents || '',
      rating: review.rating || 0,
      reviewType: review.reviewType || 'AFTER',
      author: review.nickname || '익명',
      date: formatDate(review.createdAt || review.updatedAt),
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      // 관람 정보
      performanceDate: formatPerformanceDate(review.performanceDate || review.performanceDateStr || ''), // 관람일자
      performanceTime: review.performanceTime || review.performanceTimeStr || '', // 관람 시간
      seat: formatSeatInfo(review), // 구역과 열까지만 표시
      // 원본 좌석 정보 (필요시 사용)
      section: review.section || '',
      row: review.row || '',
      number: review.number || '',
      // API 응답의 새로운 필드들
      performanceTitle: review.performanceTitle || '',
      poster: review.poster || '',
      // 하위 호환성을 위한 필드
      performanceName: review.performanceTitle || review.performanceName || review.performance?.title || null,
      performance: review.performance || null,
    };
  });
};

