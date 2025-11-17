// src/services/normalizePerformanceDetail.js
// 공연 상세 정보 API 응답을 UI에 맞게 변환하는 함수

/**
 * 날짜를 "YYYY.MM.DD. (요일)" 형식으로 변환
 * @param {string} dateString - "YYYY-MM-DD" 형식의 날짜 문자열
 * @returns {string} - "YYYY.MM.DD. (요일)" 형식
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[date.getDay()];
  
  return `${year}.${month}.${day}. (${weekday})`;
};

/**
 * 공연 기간 문자열 생성
 * @param {string} startDate - 시작일 "YYYY-MM-DD"
 * @param {string} endDate - 종료일 "YYYY-MM-DD"
 * @returns {string} - "YYYY.MM.DD. (요일)~YYYY.MM.DD. (요일)" 형식
 */
export const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return '';
  return `${formatDate(startDate)}~${formatDate(endDate)}`;
};

/**
 * 가격 문자열을 파싱하여 배열로 변환
 * @param {string} priceString - "보헤미안석(OP) 180,000원, VIP석 180,000원, ..." 형식
 * @returns {Array} - [{ seat: "VIP석", price: "180,000원" }, ...]
 */
export const parsePriceString = (priceString) => {
  if (!priceString || typeof priceString !== 'string') return [];
  
  return priceString
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0)
    .map(item => {
      // "보헤미안석(OP) 180,000원" 또는 "VIP석 180,000원" 형식 파싱
      const match = item.match(/^(.+?)\s+([\d,]+원)$/);
      if (match) {
        return {
          seat: match[1].trim(),
          price: match[2].trim()
        };
      }
      return null;
    })
    .filter(item => item !== null);
};

/**
 * 키워드 배열을 해시태그 형식으로 변환
 * @param {Array<string>} keywords - 키워드 배열
 * @returns {Array<string>} - ["#키워드1", "#키워드2", ...] 형식
 */
export const formatKeywordsAsHashtags = (keywords) => {
  if (!Array.isArray(keywords) || keywords.length === 0) return [];
  return keywords.map(keyword => `#${keyword}`);
};

/**
 * 공연 기본 정보 API 응답을 UI에 맞게 정규화
 * @param {Object} apiData - API 응답 데이터
 * @returns {Object} - UI에 맞게 변환된 데이터
 */
export const normalizePerformanceDetail = (apiData) => {
  if (!apiData) return null;

  return {
    id: apiData.performanceId,
    performanceId: apiData.performanceId,
    category: apiData.genrenm || '공연',
    title: apiData.title || '',
    englishTitle: apiData.title || '', // 영어 제목은 별도 필드가 없으면 title 사용
    venue: apiData.placeName || '',
    address: apiData.placeAddress || '',
    date: formatDateRange(apiData.startDate, apiData.endDate),
    startDate: apiData.startDate,
    endDate: apiData.endDate,
    duration: apiData.prfruntime || '',
    ageLimit: apiData.prfage || '',
    rating: apiData.rating ?? 0,
    reviewCount: apiData.reviewCount ?? 0, // API 응답에 없을 수 있음
    hashtags: formatKeywordsAsHashtags(apiData.keywords || []),
    genre: apiData.genrenm || '',
    description: apiData.aiSummary || '',
    poster: apiData.poster || '',
    prices: parsePriceString(apiData.price || ''),
    prfstate: apiData.prfstate || '',
    keywords: apiData.keywords || []
  };
};

