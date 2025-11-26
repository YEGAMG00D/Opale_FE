// src/services/normalizePerformanceImageList.js

/**
 * 공연 수집 이미지 목록 API 응답을 정제하는 함수
 * 
 * @param {Object} data - API 응답 데이터 (AdminPerformanceImageListResponseDto)
 * @returns {Object} 정제된 이미지 목록 데이터
 */
export const normalizePerformanceImageList = (data) => {
  if (!data) {
    return {
      performanceId: "",
      title: "",
      placeName: "",
      startDate: null,
      endDate: null,
      totalCount: 0,
      discountCount: 0,
      castingCount: 0,
      seatCount: 0,
      noticeCount: 0,
      otherCount: 0,
      images: [],
      discountImages: [],
      castingImages: [],
      seatImages: [],
      noticeImages: [],
      otherImages: [],
    };
  }

  // 타입별 이미지 리스트를 정제하는 헬퍼 함수
  const normalizeImageList = (imageList) => {
    if (!Array.isArray(imageList)) return [];
    return imageList.map((image) => ({
      id: image.performanceImageId,
      performanceImageId: image.performanceImageId,
      imageUrl: image.imageUrl || "",
      imageType: image.imageType || "",
      sourceUrl: image.sourceUrl || "",
    }));
  };

  // 모든 타입별 이미지를 하나의 리스트로 합치기
  const allImages = [
    ...normalizeImageList(data.discountImages || []),
    ...normalizeImageList(data.castingImages || []),
    ...normalizeImageList(data.seatImages || []),
    ...normalizeImageList(data.noticeImages || []),
    ...normalizeImageList(data.otherImages || []),
  ];

  return {
    performanceId: data.performanceId || "",
    title: data.title || "",
    placeName: data.placeName || "",
    startDate: data.startDate || null,
    endDate: data.endDate || null,
    totalCount: data.totalCount || 0,
    discountCount: data.discountCount || 0,
    castingCount: data.castingCount || 0,
    seatCount: data.seatCount || 0,
    noticeCount: data.noticeCount || 0,
    otherCount: data.otherCount || 0,
    images: allImages,
    discountImages: normalizeImageList(data.discountImages || []),
    castingImages: normalizeImageList(data.castingImages || []),
    seatImages: normalizeImageList(data.seatImages || []),
    noticeImages: normalizeImageList(data.noticeImages || []),
    otherImages: normalizeImageList(data.otherImages || []),
  };
};

