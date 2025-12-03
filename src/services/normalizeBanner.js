// src/services/normalizeBanner.js

/**
 * 관리자 배너 응답 데이터 정제
 * AdminBannerResponseDto → 프론트엔드 형식
 */
export const normalizeAdminBanner = (item) => {
  if (!item) {
    return null;
  }

  return {
    bannerId: item.bannerId,
    performanceId: item.performanceId ?? "",
    titleText: item.titleText ?? "",
    subtitleText: item.subtitleText ?? "",
    descriptionText: item.descriptionText ?? "",
    dateText: item.dateText ?? "",
    placeText: item.placeText ?? "",
    imageUrl: item.imageUrl ?? "",
    displayOrder: item.displayOrder ?? 0,
    isActive: item.isActive ?? false,
    linkUrl: item.linkUrl ?? "",
  };
};

/**
 * 관리자 배너 목록 정제
 */
export const normalizeAdminBannerList = (data) => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map(normalizeAdminBanner).filter(item => item !== null);
};

/**
 * 메인 페이지 배너 응답 데이터 정제
 * MainBannerResponseDto → 프론트엔드 형식
 */
export const normalizeMainBanner = (item) => {
  if (!item) {
    return null;
  }

  return {
    bannerId: item.bannerId,
    imageUrl: item.imageUrl ?? "",
    performanceId: item.performanceId ?? "",
    titleText: item.titleText ?? "",
    subtitleText: item.subtitleText ?? "",
    descriptionText: item.descriptionText ?? "",
    dateText: item.dateText ?? "",
    placeText: item.placeText ?? "",
    linkUrl: item.linkUrl ?? "",
  };
};

/**
 * 메인 페이지 배너 목록 정제
 */
export const normalizeMainBannerList = (data) => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map(normalizeMainBanner).filter(item => item !== null);
};

/**
 * 관리자 공연 배너 응답 데이터 정제
 * AdminMainPerformanceBannerResponseDto → 프론트엔드 형식
 */
export const normalizeAdminMainPerformanceBanner = (item) => {
  if (!item) {
    return null;
  }

  return {
    bannerId: item.bannerId,
    performanceId: item.performanceId ?? "",
    performanceTitle: item.performanceTitle ?? "",
    displayOrder: item.displayOrder ?? 0,
    isActive: item.isActive ?? false,
  };
};

/**
 * 관리자 공연 배너 목록 정제
 */
export const normalizeAdminMainPerformanceBannerList = (data) => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map(normalizeAdminMainPerformanceBanner).filter(item => item !== null);
};

/**
 * 메인 페이지 공연 배너 응답 데이터 정제
 * MainPerformanceBannerResponseDto → 프론트엔드 형식
 */
export const normalizeMainPerformanceBanner = (item) => {
  if (!item) {
    return null;
  }

  return {
    bannerId: item.bannerId,
    performanceId: item.performanceId ?? "",
    title: item.title ?? "",
    startDate: item.startDate ?? "",
    endDate: item.endDate ?? "",
    placeName: item.placeName ?? "",
    genrenm: item.genrenm ?? "",
    rating: item.rating ?? 0,
    posterUrl: item.posterUrl ?? "",
  };
};

/**
 * 메인 페이지 공연 배너 목록 정제
 */
export const normalizeMainPerformanceBannerList = (data) => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map(normalizeMainPerformanceBanner).filter(item => item !== null);
};

/**
 * 관리자 컨텐츠 배너 응답 데이터 정제
 * AdminMainContentBannerResponseDto → 프론트엔드 형식
 */
export const normalizeAdminMainContentBanner = (item) => {
  if (!item) {
    return null;
  }

  return {
    contentBannerId: item.contentBannerId,
    title: item.title ?? "",
    content: item.content ?? "",
    imageUrl: item.imageUrl ?? "",
    linkUrl: item.linkUrl ?? "",
    performanceId: item.performanceId ?? "",
    displayOrder: item.displayOrder ?? 0,
    isActive: item.isActive ?? false,
  };
};

/**
 * 관리자 컨텐츠 배너 목록 정제
 */
export const normalizeAdminMainContentBannerList = (data) => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map(normalizeAdminMainContentBanner).filter(item => item !== null);
};

/**
 * 메인 페이지 컨텐츠 배너 응답 데이터 정제
 * MainContentBannerResponseDto → 프론트엔드 형식
 */
export const normalizeMainContentBanner = (item) => {
  if (!item) {
    return null;
  }

  return {
    contentBannerId: item.contentBannerId,
    title: item.title ?? "",
    content: item.content ?? "",
    imageUrl: item.imageUrl ?? "",
    linkUrl: item.linkUrl ?? "",
    performanceId: item.performanceId ?? "",
  };
};

/**
 * 메인 페이지 컨텐츠 배너 목록 정제
 */
export const normalizeMainContentBannerList = (data) => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map(normalizeMainContentBanner).filter(item => item !== null);
};

