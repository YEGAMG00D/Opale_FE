// src/services/normalizePerformanceVideos.js

/**
 * 공연 영상 목록 API 응답을 정제하는 함수
 * fetchPerformanceVideos가 이미 items 배열만 반환하므로
 * items 배열을 받아서 정제합니다.
 * 
 * @param {Array} items - API 응답의 items 배열
 * @returns {Array} 정제된 영상 목록 데이터
 */
export const normalizePerformanceVideos = (items) => {
  // 데이터가 없으면 빈 배열 반환
  if (!items || !Array.isArray(items)) {
    return [];
  }

  return items.map((video) => ({
    id: video.performanceVideoId,
    performanceVideoId: video.performanceVideoId,
    youtubeVideoId: video.youtubeVideoId || "",
    title: video.title || "",
    thumbnailUrl: video.thumbnailUrl || "",
    sourceUrl: video.sourceUrl || "",
    embedUrl: video.embedUrl || "",
  }));
};

