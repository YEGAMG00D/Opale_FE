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

