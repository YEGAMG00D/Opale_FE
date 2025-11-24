// src/services/normalizeDiscount.js

/**
 * 할인 공연 목록 정제 함수
 * @param {Object} data - API 응답 데이터
 * @returns {Object} 정제된 할인 공연 목록
 */
export const normalizeDiscountList = (data) => {
  if (!data) {
    return {
      totalCount: 0,
      items: [],
    };
  }

  return {
    totalCount: data.totalCount ?? 0,
    items: (data.items ?? []).map(normalizeDiscountItem),
  };
};

/**
 * 할인 공연 단일 아이템 정제 함수
 * @param {Object} item - 할인 공연 아이템
 * @returns {Object} 정제된 할인 공연 아이템
 */
export const normalizeDiscountItem = (item) => {
  if (!item) {
    return null;
  }

  // 날짜 포맷팅 (LocalDate -> YYYY.MM.DD)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}.${month}.${day}`;
    } catch (e) {
      return dateString;
    }
  };

  // 날짜 범위 포맷팅
  const formatDateRange = (startDate, endDate) => {
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    if (start && end) {
      return `${start} ~ ${end}`;
    } else if (start) {
      return `${start} ~`;
    } else if (end) {
      return `~ ${end}`;
    }
    return '';
  };

  // 이미지 URL 처리 - 타임티켓의 경우 절대 경로로 변환
  const normalizeImageUrl = (imageUrl, site) => {
    if (!imageUrl) return '';
    
    // 이미 절대 URL인 경우 그대로 반환
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // 타임티켓의 경우 상대 경로 앞에 도메인 추가
    if (site === 'TIMETICKET' || site === 'timeticket' || site?.toUpperCase() === 'TIMETICKET') {
      // 상대 경로가 /로 시작하지 않으면 / 추가
      const path = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
      return `https://timeticket.co.kr${path}`;
    }
    
    return imageUrl;
  };

  const site = item.site ?? '';
  const imageUrl = normalizeImageUrl(item.imageUrl ?? '', site);

  return {
    site,
    title: item.title ?? '',
    venue: item.venue ?? '',
    imageUrl,
    saleType: item.saleType ?? '',
    discountPercent: item.discountPercent ?? '',
    discountPrice: item.discountPrice ?? '',
    area: item.area ?? '',
    category: item.category ?? '',
    rating: item.rating ?? 0,
    ratingCount: item.ratingCount ?? 0,
    startDate: formatDate(item.startDate),
    endDate: formatDate(item.endDate),
    dateRange: formatDateRange(item.startDate, item.endDate),
    link: item.link ?? '',
    discountEndDatetime: item.discountEndDatetime ?? null,
  };
};

