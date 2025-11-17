/* ============================================================
    💛 Favorite API (관심/좋아요 관련 전체)
    - 공연 관심 (Performance Favorite)
    - 공연 리뷰 관심 (Performance Review Favorite)
    - 공연장 리뷰 관심 (Place Review Favorite)
============================================================ */

import axiosInstance from "./axiosInstance";

/* -------------------------------
    Base URLs
-------------------------------- */
const performanceBase = "/favorites/performances";
const performanceReviewBase = "/favorites/performance-reviews";
const placeReviewBase = "/favorites/place-reviews";

/* ============================================================
    🎭 PERFORMANCE FAVORITE (공연 관심)
============================================================ */

/* ------------------------------------------------------------
    1) 공연 관심 토글 (POST /favorites/performances/{performanceId})
------------------------------------------------------------ */
export const togglePerformanceFavorite = async (performanceId) => {
  try {
    const res = await axiosInstance.post(`${performanceBase}/${performanceId}`);
    if (res.data.success) return res.data.data; // true/false
    throw new Error("공연 관심 토글 실패");
  } catch (err) {
    console.error("❌ togglePerformanceFavorite 오류:", err);
    throw err;
  }
};

/* ------------------------------------------------------------
    2) 공연 관심 여부 조회 (GET /favorites/performances/{performanceId})
------------------------------------------------------------ */
export const isPerformanceLiked = async (performanceId) => {
  try {
    const res = await axiosInstance.get(`${performanceBase}/${performanceId}`);
    if (res.data.success) return res.data.data; // true/false
    throw new Error("공연 관심 여부 조회 실패");
  } catch (err) {
    console.error("❌ isPerformanceLiked 오류:", err);
    throw err;
  }
};

/* ------------------------------------------------------------
    3) 내가 좋아요한 공연 ID 목록 (GET /favorites/performances/ids)
------------------------------------------------------------ */
export const fetchFavoritePerformanceIds = async () => {
  try {
    const res = await axiosInstance.get(`${performanceBase}/ids`);
    if (res.data.success) return res.data.data; // 리스트
    throw new Error("관심 공연 ID 목록 조회 실패");
  } catch (err) {
    console.error("❌ fetchFavoritePerformanceIds 오류:", err);
    throw err;
  }
};

/* ------------------------------------------------------------
    4) 마이페이지 공연 관심 상세 목록 조회 (GET /favorites/performances)
------------------------------------------------------------ */
export const fetchFavoritePerformances = async () => {
  try {
    const res = await axiosInstance.get(`${performanceBase}`);
    if (res.data.success) return res.data.data;
    throw new Error("공연 관심 목록 조회 실패");
  } catch (err) {
    console.error("❌ fetchFavoritePerformances 오류:", err);
    throw err;
  }
};

/* ============================================================
    📝 PERFORMANCE REVIEW FAVORITE (공연 리뷰 관심)
============================================================ */

/* ------------------------------------------------------------
    1) 공연 리뷰 관심 토글 (POST /favorites/performance-reviews/{reviewId})
------------------------------------------------------------ */
export const togglePerformanceReviewFavorite = async (performanceReviewId) => {
  try {
    const res = await axiosInstance.post(
      `${performanceReviewBase}/${performanceReviewId}`
    );

    if (res.data.success) return res.data.data; // true/false
    throw new Error("공연 리뷰 관심 토글 실패");
  } catch (err) {
    console.error("❌ togglePerformanceReviewFavorite 오류:", err);
    throw err;
  }
};

/* ------------------------------------------------------------
    2) 공연 리뷰 관심 여부 조회 (GET /favorites/performance-reviews/{reviewId})
------------------------------------------------------------ */
export const isPerformanceReviewLiked = async (performanceReviewId) => {
  try {
    const res = await axiosInstance.get(
      `${performanceReviewBase}/${performanceReviewId}`
    );

    if (res.data.success) return res.data.data;
    throw new Error("공연 리뷰 관심 여부 조회 실패");
  } catch (err) {
    console.error("❌ isPerformanceReviewLiked 오류:", err);
    throw err;
  }
};

/* ------------------------------------------------------------
    3) 내가 좋아요한 공연 리뷰 ID 목록 (GET /favorites/performance-reviews/ids)
------------------------------------------------------------ */
export const fetchFavoritePerformanceReviewIds = async () => {
  try {
    const res = await axiosInstance.get(`${performanceReviewBase}/ids`);
    if (res.data.success) return res.data.data;
    throw new Error("관심 공연 리뷰 ID 목록 조회 실패");
  } catch (err) {
    console.error("❌ fetchFavoritePerformanceReviewIds 오류:", err);
    throw err;
  }
};

/* ------------------------------------------------------------
    4) 내가 좋아요한 공연 리뷰 상세 목록 조회 (GET /favorites/performance-reviews)
------------------------------------------------------------ */
export const fetchFavoritePerformanceReviews = async () => {
  try {
    const res = await axiosInstance.get(`${performanceReviewBase}`);
    if (res.data.success) return res.data.data;
    throw new Error("관심 공연 리뷰 목록 조회 실패");
  } catch (err) {
    console.error("❌ fetchFavoritePerformanceReviews 오류:", err);
    throw err;
  }
};

/* ============================================================
    🏟️ PLACE REVIEW FAVORITE (공연장 리뷰 관심)
============================================================ */

/* ------------------------------------------------------------
    1) 공연장 리뷰 관심 토글 (POST /favorites/place-reviews/{placeReviewId})
------------------------------------------------------------ */
export const togglePlaceReviewFavorite = async (placeReviewId) => {
  try {
    const res = await axiosInstance.post(
      `${placeReviewBase}/${placeReviewId}`
    );

    if (res.data.success) return res.data.data;
    throw new Error("공연장 리뷰 관심 토글 실패");
  } catch (err) {
    console.error("❌ togglePlaceReviewFavorite 오류:", err);
    throw err;
  }
};

/* ------------------------------------------------------------
    2) 공연장 리뷰 관심 여부 조회 (GET /favorites/place-reviews/{placeReviewId})
------------------------------------------------------------ */
export const isPlaceReviewLiked = async (placeReviewId) => {
  try {
    const res = await axiosInstance.get(
      `${placeReviewBase}/${placeReviewId}`
    );

    if (res.data.success) return res.data.data;
    throw new Error("공연장 리뷰 관심 여부 조회 실패");
  } catch (err) {
    console.error("❌ isPlaceReviewLiked 오류:", err);
    throw err;
  }
};

/* ------------------------------------------------------------
    3) 내가 좋아요한 공연장 리뷰 ID 목록 (GET /favorites/place-reviews/ids)
------------------------------------------------------------ */
export const fetchFavoritePlaceReviewIds = async () => {
  try {
    const res = await axiosInstance.get(`${placeReviewBase}/ids`);
    if (res.data.success) return res.data.data;
    throw new Error("관심 공연장 리뷰 ID 목록 조회 실패");
  } catch (err) {
    console.error("❌ fetchFavoritePlaceReviewIds 오류:", err);
    throw err;
  }
};

/* ------------------------------------------------------------
    4) 공연장 리뷰 관심 상세 목록 조회 (GET /favorites/place-reviews)
------------------------------------------------------------ */
export const fetchFavoritePlaceReviews = async () => {
  try {
    const res = await axiosInstance.get(`${placeReviewBase}`);
    if (res.data.success) return res.data.data;
    throw new Error("관심 공연장 리뷰 목록 조회 실패");
  } catch (err) {
    console.error("❌ fetchFavoritePlaceReviews 오류:", err);
    throw err;
  }
};

/* ============================================================
    모듈 종합 export
============================================================ */
export default {
  // 공연 관심
  togglePerformanceFavorite,
  isPerformanceLiked,
  fetchFavoritePerformanceIds,
  fetchFavoritePerformances,

  // 공연 리뷰 관심
  togglePerformanceReviewFavorite,
  isPerformanceReviewLiked,
  fetchFavoritePerformanceReviewIds,
  fetchFavoritePerformanceReviews,

  // 공연장 리뷰 관심
  togglePlaceReviewFavorite,
  isPlaceReviewLiked,
  fetchFavoritePlaceReviewIds,
  fetchFavoritePlaceReviews,
};
