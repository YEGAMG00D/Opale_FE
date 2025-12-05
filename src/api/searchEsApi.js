/* ============================================================
    🔍 Elasticsearch Search API (공연 검색 & 자동완성 전용)
    - 오타 허용 공연 검색
    - 공연명 자동완성
    ※ 비로그인 상태에서도 사용 가능
============================================================ */

import axiosInstance from "./axiosInstance";

const base = "/search";

/* ============================================================
    1️⃣ 오타 허용 + 정확도 기반 공연 검색
    GET /api/search/performances?keyword=
    - 검색 버튼 클릭 시 사용
    - 실제 검색 결과 리스트용
============================================================ */
export const fetchEsPerformanceSearch = async (keyword) => {
  try {
    const res = await axiosInstance.get(`${base}/performances`, {
      params: { keyword },
    });

    if (res.data.success) return res.data.data;
    throw new Error("ES 공연 검색 실패");
  } catch (err) {
    console.error("❌ fetchEsPerformanceSearch 오류:", err);
    throw err;
  }
};

/* ============================================================
    2️⃣ 공연 자동완성 (검색창 타이핑 도중 호출)
    GET /api/search/performances/suggest?keyword=
    - 타이핑 중 실시간 자동완성
    - [performanceId, title] 형태 반환
============================================================ */
export const fetchEsPerformanceAutoComplete = async (keyword) => {
  try {
    // ✅ 빈 문자열이면 호출 안 함 (불필요한 ES 요청 방지)
    if (!keyword || keyword.trim() === "") return [];

    const res = await axiosInstance.get(
      `${base}/performances/suggest`,
      { params: { keyword } }
    );

    if (res.data.success) return res.data.data ?? [];
    throw new Error("ES 자동완성 조회 실패");
  } catch (err) {
    console.error("❌ fetchEsPerformanceAutoComplete 오류:", err);
    throw err;
  }
};

/* ============================================================
    ✅ Export 모음
============================================================ */
export default {
  fetchEsPerformanceSearch,
  fetchEsPerformanceAutoComplete,
};
