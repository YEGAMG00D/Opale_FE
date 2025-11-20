/* ============================================================
    🏟️ Place API (공연장 관련)
    - 공연장 목록 조회
    - 좌표 기반 근처 공연장 목록 조회
    - 공연장 기본 정보 조회
    - 공연장 내 공연관 목록 조회
    - 공연장 편의시설 정보 조회
    - 공연장별 공연 목록 조회
============================================================ */


/* ============================================================
    🏟️ Place API
============================================================ */
import axiosInstance from "./axiosInstance";

const base = "/places";

/* 🔥 수정됨 */
export const fetchPlaceList = async (dto) => {
  try {
    const res = await axiosInstance.post(`${base}`, dto);
    if (res.data.success) return res.data.data ?? [];
    throw new Error("공연장 목록 조회 실패");
  } catch (err) {
    console.error("❌ fetchPlaceList 오류:", err);
    throw err;
  }
};

/* 🔥 수정됨 */
export const fetchNearbyPlaces = async (dto) => {
  try {
    const res = await axiosInstance.post(`${base}/nearby`, dto);
    if (res.data.success) return res.data.data ?? [];
    throw new Error("근처 공연장 목록 조회 실패");
  } catch (err) {
    console.error("❌ fetchNearbyPlaces 오류:", err);
    throw err;
  }
};

export const fetchPlaceBasic = async (placeId) => {
  try {
    const res = await axiosInstance.get(`${base}/${placeId}/basic`);
    if (res.data.success) return res.data.data;
    throw new Error("공연장 기본 정보 조회 실패");
  } catch (err) {
    console.error("❌ fetchPlaceBasic 오류:", err);
    throw err;
  }
};

export const fetchPlaceStages = async (placeId) => {
  try {
    const res = await axiosInstance.get(`${base}/${placeId}/stages`);
    if (res.data.success) return res.data.data;
    throw new Error("공연관 목록 조회 실패");
  } catch (err) {
    console.error("❌ fetchPlaceStages 오류:", err);
    throw err;
  }
};

export const fetchPlaceFacilities = async (placeId) => {
  try {
    const res = await axiosInstance.get(`${base}/${placeId}/facilities`);
    if (res.data.success) return res.data.data;
    throw new Error("공연장 편의시설 조회 실패");
  } catch (err) {
    console.error("❌ fetchPlaceFacilities 오류:", err);
    throw err;
  }
};

/* 🔥 수정됨 */
export const fetchPlacePerformances = async (placeId) => {
  try {
    const res = await axiosInstance.get(`${base}/${placeId}/performances`);
    if (res.data.success) return res.data.data ?? [];
    throw new Error("공연장별 공연 목록 조회 실패");
  } catch (err) {
    console.error("❌ fetchPlacePerformances 오류:", err);
    throw err;
  }
};

export default {
  fetchPlaceList,
  fetchNearbyPlaces,
  fetchPlaceBasic,
  fetchPlaceStages,
  fetchPlaceFacilities,
  fetchPlacePerformances,
};
