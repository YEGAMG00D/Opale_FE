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

  // 인터파크 이미지 URL에서 상품 ID 추출
  const extractInterparkGoodsId = (imageUrl) => {
    if (!imageUrl) return null;
    
    // 인터파크 이미지 URL 패턴: https://ticketimage.interpark.com/Play/image/large/25/25009291_p.gif
    // 또는 다른 패턴들도 있을 수 있음
    const patterns = [
      /\/Play\/image\/[^\/]+\/\d+\/(\d+)_[^\/]+\.(gif|jpg|png|webp)/i,  // /Play/image/large/25/25009291_p.gif
      /\/goods\/(\d+)/i,  // /goods/25009291
      /(\d{8,})/  // 8자리 이상 숫자 (상품 ID로 추정)
    ];
    
    for (const pattern of patterns) {
      const match = imageUrl.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };

  // 링크 생성 - 인터파크의 경우 이미지 URL에서 상품 ID 추출
  const normalizeLink = (link, imageUrl, site) => {
    // 이미 링크가 있으면 그대로 사용
    if (link && link.trim() !== '') {
      return link;
    }
    
    // 인터파크의 경우 이미지 URL에서 상품 ID 추출하여 링크 생성
    if (site === 'INTERPARK' || site === 'interpark' || site?.toUpperCase() === 'INTERPARK') {
      const goodsId = extractInterparkGoodsId(imageUrl);
      if (goodsId) {
        return `https://tickets.interpark.com/goods/${goodsId}`;
      }
    }
    
    return link || '';
  };

  const site = item.site ?? '';
  const imageUrl = normalizeImageUrl(item.imageUrl ?? '', site);
  const link = normalizeLink(item.link ?? '', imageUrl, site);

  return {
    site,
    title: item.title ?? '',
    venue: item.venue ?? '',
    imageUrl,
    saleType: item.saleType ?? '',
    discountPercent: item.discountPercent ?? '',
    discountPrice: item.discountPrice ?? '',
    startDate: formatDate(item.startDate),
    endDate: formatDate(item.endDate),
    dateRange: formatDateRange(item.startDate, item.endDate),
    link,
    discountEndDatetime: item.discountEndDatetime ?? null,
  };
};

