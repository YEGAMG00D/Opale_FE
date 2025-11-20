// src/services/normalizePerformance.js

const DEFAULT_POSTER = "/assets/default_poster.png";

export const normalizePerformance = (item) => {

  // 1) 포스터: 문자열 그대로 사용
  let poster = item.poster;
  if (typeof poster !== "string" || poster.trim() === "") {
    poster = DEFAULT_POSTER;
  }

  // 2) 장르: genrenm → genre로 표준화
  const genre =
    item.genrenm ??
    item.genre ??
    item.performanceType ??
    "기타";

  return {
    id: item.performanceId,
    title: item.title,
    venue: item.placeName,
    startDate: item.startDate,
    endDate: item.endDate,
    rating: item.rating ?? 0,
    reviewCount: item.reviewCount ?? 0,
    image: poster,
    keywords: item.keywords ?? [],
    aiSummary: item.aiSummary ?? "",
    genre,
  };
};
