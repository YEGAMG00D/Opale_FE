// src/services/normalizePerformance.js

const DEFAULT_POSTER = "/assets/default_poster.png";

export const normalizePerformance = (item) => {
  let poster = item.poster;

  // 🔥 배열 형태 대응
  if (Array.isArray(poster)) {
    poster = poster.length > 0 ? poster[0] : null;
  }

  // 🔥 객체 형태 대응
  if (poster && typeof poster === "object") {
    poster = poster.origin || poster.thumb || Object.values(poster)[0] || null;
  }

  // 🔥 poster가 null이면 기본 이미지
  if (!poster) {
    poster = DEFAULT_POSTER;
  }

  // 🔥 http → https 강제 (KOPIS 혼합 콘텐츠 방지)
  if (poster.startsWith("http://")) {
    poster = poster.replace("http://", "https://");
  }

  return {
    id: item.performanceId,
    title: item.title,
    venue: item.placeName,
    startDate: item.startDate,
    endDate: item.endDate,
    rating: item.rating ?? 0,
    reviewCount: item.reviewCount ?? 0,

    // 🔥 여기!!! 'poster' 필드를 명확히 추가!!!!
    poster: poster,

    // 🔥 동일한 값 image에도 넣어서 호환성 유지
    image: poster,

    keywords: item.keywords ?? [],
    aiSummary: item.aiSummary ?? "",
  };
};
