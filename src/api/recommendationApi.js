/* ===================================================================
    🎭 Recommendation API
    - 공연 추천
    - 공연장 추천
    - 채팅방 추천
    - 개인화 추천

    모든 추천 API는 GET 방식이며, 요청 파라미터는 optional.
=================================================================== */

import axiosInstance from "./axiosInstance";

const base = "/recommendations";

/* ============================================================
    1) 개인화 추천 (로그인 사용자)
    GET /api/recommendations/user?size=&sort=
============================================================ */
export const getUserRecommendations = async (params = {}) => {
  try {
    const res = await axiosInstance.get(`${base}/user`, { params });

    if (res.data.success) return res.data.data; // RecommendationPerformanceListResponseDto
    throw new Error("개인화 추천 조회 실패");
  } catch (err) {
    console.error("❌ getUserRecommendations 오류:", err);
    throw err;
  }
};

/* ============================================================
    2) 운영자용 개인화 추천
    GET /api/recommendations/user/{userId}?size=&sort=
============================================================ */
export const getUserRecommendationsByAdmin = async (userId, params = {}) => {
  try {
    const res = await axiosInstance.get(`${base}/user/${userId}`, { params });

    if (res.data.success) return res.data.data;
    throw new Error("운영자 개인화 추천 조회 실패");
  } catch (err) {
    console.error("❌ getUserRecommendationsByAdmin 오류:", err);
    throw err;
  }
};

/* ============================================================
    3) 특정 공연과 비슷한 공연 추천
    GET /api/recommendations/performance/{performanceId}?size=&sort=
============================================================ */
export const getSimilarPerformances = async (performanceId, params = {}) => {
  try {
    const res = await axiosInstance.get(`${base}/performance/${performanceId}`, {
      params,
    });

    if (res.data.success) return res.data.data;
    throw new Error("비슷한 공연 추천 조회 실패");
  } catch (err) {
    console.error("❌ getSimilarPerformances 오류:", err);
    throw err;
  }
};

/* ============================================================
    4) 장르 기반 추천
    GET /api/recommendations/genre?genre=뮤지컬&size=10&sort=latest
============================================================ */
export const getGenreRecommendations = async (params = {}) => {
  try {
    const res = await axiosInstance.get(`${base}/genre`, { params });

    if (res.data.success) return res.data.data;
    throw new Error("장르 기반 추천 조회 실패");
  } catch (err) {
    console.error("❌ getGenreRecommendations 오류:", err);
    throw err;
  }
};

/* ============================================================
    5) 인기 공연 추천
    GET /api/recommendations/popular?size=10
============================================================ */
export const getPopularRecommendations = async (params = {}) => {
  try {
    const res = await axiosInstance.get(`${base}/popular`, { params });

    if (res.data.success) return res.data.data;
    throw new Error("인기 공연 추천 조회 실패");
  } catch (err) {
    console.error("❌ getPopularRecommendations 오류:", err);
    throw err;
  }
};

/* ============================================================
    6) 최신 공연 추천
    GET /api/recommendations/latest?size=10
============================================================ */
export const getLatestRecommendations = async (params = {}) => {
  try {
    const res = await axiosInstance.get(`${base}/latest`, { params });

    if (res.data.success) return res.data.data;
    throw new Error("최신 공연 추천 조회 실패");
  } catch (err) {
    console.error("❌ getLatestRecommendations 오류:", err);
    throw err;
  }
};

/* ============================================================
    7) 인기 공연장 추천
    GET /api/recommendations/popular/places?size=10
============================================================ */
export const getPopularPlaces = async (params = {}) => {
  try {
    const res = await axiosInstance.get(`${base}/popular/places`, { params });

    if (res.data.success) return res.data.data;
    throw new Error("인기 공연장 추천 조회 실패");
  } catch (err) {
    console.error("❌ getPopularPlaces 오류:", err);
    throw err;
  }
};

/* ============================================================
    8) 인기 채팅방 추천
    GET /api/recommendations/popular/chatrooms?size=10
============================================================ */
export const getPopularChatRooms = async (params = {}) => {
  try {
    const res = await axiosInstance.get(`${base}/popular/chatrooms`, { params });

    if (res.data.success) return res.data.data;
    throw new Error("인기 채팅방 추천 조회 실패");
  } catch (err) {
    console.error("❌ getPopularChatRooms 오류:", err);
    throw err;
  }
};

/* ============================================================
    Export
============================================================ */
const recommendationApi = {
  getUserRecommendations,
  getUserRecommendationsByAdmin,
  getSimilarPerformances,
  getGenreRecommendations,
  getPopularRecommendations,
  getLatestRecommendations,
  getPopularPlaces,
  getPopularChatRooms,
};

export default recommendationApi;
