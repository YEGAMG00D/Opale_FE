/* ============================================================
    🎭 Performance API (공연 관련)
    - 공연 목록 조회
    - 인기 공연 목록 조회
    - 오늘 공연 조회
    - 공연 기본 정보 조회
    - 공연 예매처 목록 조회
    - 공연 영상 목록 조회
    - 공연 예매 정보 조회 (좌석/캐스팅/공지/기타 이미지)
    - 공연 소개 이미지 조회
    - 좌표 기반 근처 공연 조회
============================================================ */
import axiosInstance from "./axiosInstance";

const base = "/performances";

/* ============================================================
    ✅ 1. 공연 목록 조회 (POST)
    dto = { genre, keyword, sortType, area, page, size }
============================================================ */
export const fetchPerformanceList = async (dto) => {
  try {
    const res = await axiosInstance.post(`${base}`, dto);

    if (res.data.success) return res.data.data;
    throw new Error("공연 목록 조회 실패");
  } catch (err) {
    console.error("❌ fetchPerformanceList 오류:", err);
    throw err;
  }
};

/* ============================================================
    ✅ 2. 인기 공연 목록 조회 (GET /top)
============================================================ */
export const fetchTopPerformances = async () => {
  try {
    const res = await axiosInstance.get(`${base}/top`);

    if (res.data.success) return res.data.data;
    throw new Error("인기 공연 목록 조회 실패");
  } catch (err) {
    console.error("❌ fetchTopPerformances 오류:", err);
    throw err;
  }
};

/* ============================================================
    ✅ 3. 오늘 개막/종료 공연 조회
    type = start | end | all
============================================================ */
export const fetchTodayPerformances = async (type = "all") => {
  try {
    const res = await axiosInstance.get(`${base}/today`, {
      params: { type },
    });

    if (res.data.success) return res.data.data;
    throw new Error("오늘 공연 조회 실패");
  } catch (err) {
    console.error("❌ fetchTodayPerformances 오류:", err);
    throw err;
  }
};

/* ============================================================
    ✅ 4. 공연 기본 정보 조회 (GET /:performanceId/basic)
============================================================ */
export const fetchPerformanceBasic = async (performanceId) => {
  try {
    const res = await axiosInstance.get(
      `${base}/${performanceId}/basic`
    );

    if (res.data.success) return res.data.data;
    throw new Error("공연 기본 정보 조회 실패");
  } catch (err) {
    console.error("❌ fetchPerformanceBasic 오류:", err);
    throw err;
  }
};

/* ============================================================
    ✅ 5. 공연 예매처 목록 조회 (GET /:performanceId/relation)
============================================================ */
export const fetchPerformanceRelations = async (performanceId) => {
  try {
    const res = await axiosInstance.get(
      `${base}/${performanceId}/relation`
    );

    if (res.data.success) return res.data.data;
    throw new Error("공연 예매처 목록 조회 실패");
  } catch (err) {
    console.error("❌ fetchPerformanceRelations 오류:", err);
    throw err;
  }
};

/* ============================================================
    ✅ 6. 공연 영상 목록 조회 (GET /:performanceId/video)
============================================================ */
export const fetchPerformanceVideos = async (performanceId) => {
  try {
    const res = await axiosInstance.get(
      `${base}/${performanceId}/video`
    );

    if (res.data.success) return res.data.data;
    throw new Error("공연 영상 목록 조회 실패");
  } catch (err) {
    console.error("❌ fetchPerformanceVideos 오류:", err);
    throw err;
  }
};

/* ============================================================
    ✅ 7. 공연 예매 정보 조회 (좌석/캐스팅/공지/기타 이미지)
    GET /:performanceId/booking
============================================================ */
export const fetchPerformanceBooking = async (performanceId) => {
  try {
    const res = await axiosInstance.get(
      `${base}/${performanceId}/booking`
    );

    if (res.data.success) return res.data.data;
    throw new Error("공연 예매 정보 조회 실패");
  } catch (err) {
    console.error("❌ fetchPerformanceBooking 오류:", err);
    throw err;
  }
};

/* ============================================================
    ✅ 8. 공연 소개 이미지 조회 (infoImage)
    GET /:performanceId/infoImage
============================================================ */
export const fetchPerformanceInfoImages = async (performanceId) => {
  try {
    const res = await axiosInstance.get(
      `${base}/${performanceId}/infoImage`
    );

    if (res.data.success) return res.data.data;
    throw new Error("공연 소개 이미지 조회 실패");
  } catch (err) {
    console.error("❌ fetchPerformanceInfoImages 오류:", err);
    throw err;
  }
};

/* ============================================================
    ✅ 9. 좌표 기반 근처 공연 조회 (POST /nearby)
    dto = { latitude, longitude, radius, page, size }
============================================================ */
export const fetchNearbyPerformances = async (dto) => {
  try {
    const res = await axiosInstance.post(`${base}/nearby`, dto);

    if (res.data.success) return res.data.data;
    throw new Error("근처 공연 조회 실패");
  } catch (err) {
    console.error("❌ fetchNearbyPerformances 오류:", err);
    throw err;
  }
};

/* ============================================================
    모듈 형태 export
============================================================ */
export default {
  fetchPerformanceList,
  fetchTopPerformances,
  fetchTodayPerformances,
  fetchPerformanceBasic,
  fetchPerformanceRelations,
  fetchPerformanceVideos,
  fetchPerformanceBooking,
  fetchPerformanceInfoImages,
  fetchNearbyPerformances,
};
