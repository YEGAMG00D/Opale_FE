/* ============================================================
    📝 Review API (공연 리뷰 + 공연장 리뷰)
    - Performance Reviews (공연 리뷰)
    - Place Reviews (공연장 리뷰)
============================================================ */
import axiosInstance from "./axiosInstance";

/* -------------------------------
    Base URLs
-------------------------------- */
const performanceBase = "/reviews/performances";
const placeBase = "/reviews/places";

/* ============================================================
    🎭 PERFORMANCE REVIEWS (공연 리뷰 API)
============================================================ */

/* ------------------------------------------------------------
    ✅ 1. 공연 리뷰 단일 조회 (GET /reviews/performances/{reviewId})
------------------------------------------------------------ */
export const fetchPerformanceReview = async (reviewId) => {
  try {
    const res = await axiosInstance.get(`${performanceBase}/${reviewId}`);

    if (res.data.success) return res.data.data;
    throw new Error("공연 리뷰 조회 실패");
  } catch (err) {
    console.error("❌ fetchPerformanceReview 오류:", err);
    throw err;
  }
};

/* ------------------------------------------------------------
    ✅ 2. 공연별 리뷰 목록 조회 (비로그인 가능)
       GET /reviews/performances/performance/{performanceId}?reviewType=...
------------------------------------------------------------ */
export const fetchPerformanceReviewsByPerformance = async (
  performanceId,
  reviewType = null
) => {
  try {
    const res = await axiosInstance.get(
      `${performanceBase}/performance/${performanceId}`,
      {
        params: reviewType ? { reviewType } : {},
      }
    );

    if (res.data.success) return res.data.data;
    throw new Error("공연별 리뷰 목록 조회 실패");
  } catch (err) {
    console.error("❌ fetchPerformanceReviewsByPerformance 오류:", err);
    throw err;
  }
};

/* ------------------------------------------------------------
    ✅ 3. 내가 작성한 공연 리뷰 목록 조회 (로그인 필요)
       GET /reviews/performances/me?reviewType=
------------------------------------------------------------ */
export const fetchMyPerformanceReviews = async (reviewType = null) => {
  try {
    const res = await axiosInstance.get(`${performanceBase}/me`, {
      params: reviewType ? { reviewType } : {},
    });

    if (res.data.success) return res.data.data;
    throw new Error("내 공연 리뷰 목록 조회 실패");
  } catch (err) {
    console.error("❌ fetchMyPerformanceReviews 오류:", err);
    throw err;
  }
};

/* ------------------------------------------------------------
    ✅ 4. 특정 회원의 공연 리뷰 목록 조회 (비로그인 가능)
       GET /reviews/performances/user/{userId}?reviewType=
------------------------------------------------------------ */
export const fetchPerformanceReviewsByUser = async (userId, reviewType = null) => {
  try {
    const res = await axiosInstance.get(
      `${performanceBase}/user/${userId}`,
      {
        params: reviewType ? { reviewType } : {},
      }
    );

    if (res.data.success) return res.data.data;
    throw new Error("회원 공연 리뷰 목록 조회 실패");
  } catch (err) {
    console.error("❌ fetchPerformanceReviewsByUser 오류:", err);
    throw err;
  }
};

/* ------------------------------------------------------------
    ✅ 5. 공연 리뷰 작성 (POST)
------------------------------------------------------------ */
export const createPerformanceReview = async (dto) => {
  try {
    const res = await axiosInstance.post(`${performanceBase}`, dto);

    if (res.data.success) return res.data.data;
    throw new Error("공연 리뷰 작성 실패");
  } catch (err) {
    console.error("❌ createPerformanceReview 오류:", err);
    throw err;
  }
};

/* ------------------------------------------------------------
    ✅ 6. 공연 리뷰 수정 (PUT /{reviewId})
------------------------------------------------------------ */
export const updatePerformanceReview = async (reviewId, dto) => {
  try {
    const res = await axiosInstance.put(
      `${performanceBase}/${reviewId}`,
      dto
    );

    if (res.data.success) return res.data.data;
    throw new Error("공연 리뷰 수정 실패");
  } catch (err) {
    console.error("❌ updatePerformanceReview 오류:", err);
    throw err;
  }
};

/* ------------------------------------------------------------
    ✅ 7. 공연 리뷰 삭제 (DELETE /{reviewId})
------------------------------------------------------------ */
export const deletePerformanceReview = async (reviewId) => {
  try {
    const res = await axiosInstance.delete(
      `${performanceBase}/${reviewId}`
    );

    if (res.data.success) return true;
    throw new Error("공연 리뷰 삭제 실패");
  } catch (err) {
    console.error("❌ deletePerformanceReview 오류:", err);
    throw err;
  }
};

/* ============================================================
    🏟️ PLACE REVIEWS (공연장 리뷰 API)
============================================================ */

/* ------------------------------------------------------------
    ✅ 1. 공연장 리뷰 단일 조회
       GET /reviews/places/{reviewId}
------------------------------------------------------------ */
export const fetchPlaceReview = async (reviewId) => {
  try {
    const res = await axiosInstance.get(`${placeBase}/${reviewId}`);

    if (res.data.success) return res.data.data;
    throw new Error("공연장 리뷰 조회 실패");
  } catch (err) {
    console.error("❌ fetchPlaceReview 오류:", err);
    throw err;
  }
};

/* ------------------------------------------------------------
    ✅ 2. 공연장별 리뷰 목록 조회 (비로그인 가능)
       GET /reviews/places/place/{placeId}?reviewType=
------------------------------------------------------------ */
export const fetchPlaceReviewsByPlace = async (placeId, reviewType = null) => {
  try {
    const res = await axiosInstance.get(
      `${placeBase}/place/${placeId}`,
      {
        params: reviewType ? { reviewType } : {},
      }
    );

    if (res.data.success) return res.data.data;
    throw new Error("공연장별 리뷰 목록 조회 실패");
  } catch (err) {
    console.error("❌ fetchPlaceReviewsByPlace 오류:", err);
    throw err;
  }
};

/* ------------------------------------------------------------
    ⚠️ 3. 내가 작성한 공연장 리뷰 목록 조회 (로그인 필요)
       GET /reviews/places/me
------------------------------------------------------------ */
export const fetchMyPlaceReviews = async (reviewType = null) => {
  try {
    const res = await axiosInstance.get(`${placeBase}/me`, {
      params: reviewType ? { reviewType } : {},
    });

    if (res.data.success) return res.data.data;
    throw new Error("내 공연장 리뷰 목록 조회 실패");
  } catch (err) {
    console.error("❌ fetchMyPlaceReviews 오류:", err);
    throw err;
  }
};

/* ------------------------------------------------------------
    ✅ 4. 특정 회원의 공연장 리뷰 목록 조회 (비로그인 가능)
       GET /reviews/places/user/{userId}?reviewType=
------------------------------------------------------------ */
export const fetchPlaceReviewsByUser = async (userId, reviewType = null) => {
  try {
    const res = await axiosInstance.get(
      `${placeBase}/user/${userId}`,
      {
        params: reviewType ? { reviewType } : {},
      }
    );

    if (res.data.success) return res.data.data;
    throw new Error("회원 공연장 리뷰 목록 조회 실패");
  } catch (err) {
    console.error("❌ fetchPlaceReviewsByUser 오류:", err);
    throw err;
  }
};

/* ------------------------------------------------------------
    🎯 5. 공연장 리뷰 작성 (POST)
------------------------------------------------------------ */
export const createPlaceReview = async (dto) => {
  try {
    const res = await axiosInstance.post(`${placeBase}`, dto);

    if (res.data.success) return res.data.data;
    throw new Error("공연장 리뷰 작성 실패");
  } catch (err) {
    console.error("❌ createPlaceReview 오류:", err);
    throw err;
  }
};

/* ------------------------------------------------------------
    🎯 6. 공연장 리뷰 수정 (PUT /{reviewId})
------------------------------------------------------------ */
export const updatePlaceReview = async (reviewId, dto) => {
  try {
    const res = await axiosInstance.put(`${placeBase}/${reviewId}`, dto);

    if (res.data.success) return res.data.data;
    throw new Error("공연장 리뷰 수정 실패");
  } catch (err) {
    console.error("❌ updatePlaceReview 오류:", err);
    throw err;
  }
};

/* ------------------------------------------------------------
    🎯 7. 공연장 리뷰 삭제 (DELETE /{reviewId})
------------------------------------------------------------ */
export const deletePlaceReview = async (reviewId) => {
  try {
    const res = await axiosInstance.delete(`${placeBase}/${reviewId}`);

    if (res.data.success) return true;
    throw new Error("공연장 리뷰 삭제 실패");
  } catch (err) {
    console.error("❌ deletePlaceReview 오류:", err);
    throw err;
  }
};

/* ============================================================
    모듈형 export 묶음
============================================================ */
export default {
  // 공연 리뷰
  fetchPerformanceReview,
  fetchPerformanceReviewsByPerformance,
  fetchMyPerformanceReviews,
  fetchPerformanceReviewsByUser,
  createPerformanceReview,
  updatePerformanceReview,
  deletePerformanceReview,

  // 공연장 리뷰
  fetchPlaceReview,
  fetchPlaceReviewsByPlace,
  fetchMyPlaceReviews,
  fetchPlaceReviewsByUser,
  createPlaceReview,
  updatePlaceReview,
  deletePlaceReview,
};
