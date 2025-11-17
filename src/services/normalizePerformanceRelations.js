// src/services/normalizePerformanceRelations.js

/**
 * 공연 예매처 목록 API 응답을 정제하는 함수
 * 
 * API 응답에는 siteName과 siteUrl만 있으므로,
 * siteName을 분석하여 UI에 표시할 logo와 color를 자동 생성합니다.
 * 
 * @param {Object} data - API 응답 데이터 { items: [{ relationId, siteName, siteUrl }] }
 * @returns {Array} 정제된 예매처 목록 [{ id, name, url, logo, color }]
 */
export const normalizePerformanceRelations = (data) => {
  if (!data || !data.items || !Array.isArray(data.items)) {
    return [];
  }

  return data.items.map((item) => {
    const siteName = item.siteName || "";

    /**
     * siteName에서 로고 텍스트 추출
     * - 대형 예매처: 알려진 약자 사용 (N, Y, I, TL 등)
     * - 기타 예매처: 첫 글자 사용 (예: "클린서비스주식회사" -> "클")
     */
    const getLogo = (siteName) => {
      const lowerName = siteName.toLowerCase();
      
      // 대형 예매처 사이트 매핑
      if (siteName.includes("네이버") || siteName.includes("네이버예약") || lowerName.includes("naver")) {
        return "N";
      }
      if (siteName.includes("예스24") || siteName.includes("yes24") || lowerName.includes("yes24")) {
        return "Y";
      }
      if (siteName.includes("인터파크") || lowerName.includes("interpark")) {
        return "I";
      }
      if (siteName.includes("티켓링크") || lowerName.includes("ticketlink")) {
        return "TL";
      }
      if (siteName.includes("멜론티켓") || lowerName.includes("melonticket")) {
        return "M";
      }
      if (siteName.includes("위메프") || lowerName.includes("wemakeprice")) {
        return "W";
      }
      
      // 기타 예매처: 첫 글자 사용 (한글인 경우 첫 글자, 영문인 경우 첫 대문자)
      if (siteName.length > 0) {
        const firstChar = siteName.charAt(0);
        // 한글인 경우 첫 글자 반환
        if (/[가-힣]/.test(firstChar)) {
          return firstChar;
        }
        // 영문인 경우 대문자로 변환
        return firstChar.toUpperCase();
      }
      
      return "?";
    };

    /**
     * siteName에서 배경색 추출
     * - 네이버만 초록색 (#03C75A)
     * - 나머지는 기본 회색 (#F5F5F5)
     */
    const getColor = (siteName) => {
      const lowerName = siteName.toLowerCase();
      if (
        siteName.includes("네이버") || 
        siteName.includes("네이버예약") || 
        lowerName.includes("naver")
      ) {
        return "#03C75A"; // 네이버 그린
      }
      return "#F5F5F5"; // 기본 회색
    };

    return {
      id: item.relationId,
      name: item.siteName || "예매처",
      url: item.siteUrl || "",
      logo: getLogo(siteName), // siteName에서 자동 추출
      color: getColor(siteName), // siteName에서 자동 추출
    };
  });
};

