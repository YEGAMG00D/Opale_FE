/* ===================================================================
    📊 User Event Log API (Analytics)

    ⚠️ 매우 중요!!!
    ⚠️ 프론트에서 사용자가 행동할 때마다
       직접 createLog() 를 호출해야 로그가 저장됨.
    ⚠️ 서버에서 자동으로 기록되지 않음!!!!

    사용 예)
      logApi.createLog({
        eventType: "VIEW",
        targetType: "PERFORMANCE",
        targetId: performanceId
      })

=================================================================== */

import axiosInstance from "./axiosInstance";

const base = "/logs";

/* ============================================================
    1) 사용자 행동 로그 생성
    POST /api/logs
============================================================ */
export const createLog = async (dto) => {
  try {
    const res = await axiosInstance.post(base, dto);

    if (res.data.success) return res.data.data; // UserEventLogResponseDto
    throw new Error("사용자 행동 로그 저장 실패");
  } catch (err) {
    console.error("❌ createLog 오류:", err);
    throw err;
  }
};

/* ============================================================
    2) 사용자 행동 로그 조회 (검색 + 페이지)
    GET /api/logs?eventType=VIEW&targetId=PF123&page=1&size=20
============================================================ */
export const getLogs = async (params = {}) => {
  try {
    const res = await axiosInstance.get(base, { params });

    if (res.data.success) return res.data.data; // UserEventLogListResponseDto
    throw new Error("사용자 행동 로그 조회 실패");
  } catch (err) {
    console.error("❌ getLogs 오류:", err);
    throw err;
  }
};

/* ============================================================
    Export
============================================================ */
const logApi = {
  createLog,
  getLogs,
};

export default logApi;
