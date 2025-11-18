/* ============================================================
    🎫 Reservation API (티켓 인증 관련 전체)
    - 티켓 등록
    - 티켓 수정
    - 티켓 삭제
    - 단일 조회
    - 목록 조회
============================================================ */

import axiosInstance from "./axiosInstance";

const base = "/reservations";

/* ============================================================
    1) 티켓 등록
    POST /api/reservations
============================================================ */
export const createTicket = async (dto) => {
  try {
    const res = await axiosInstance.post(`${base}`, dto);

    if (res.data.success) return res.data.data; // TicketDetailResponseDto
    throw new Error("티켓 인증 등록 실패");
  } catch (err) {
    console.error("❌ createTicket 오류:", err);
    throw err;
  }
};

/* ============================================================
    2) 티켓 수정
    PATCH /api/reservations/{ticketId}
============================================================ */
export const updateTicket = async (ticketId, dto) => {
  try {
    const res = await axiosInstance.patch(`${base}/${ticketId}`, dto);

    if (res.data.success) return res.data.data; // TicketDetailResponseDto
    throw new Error("티켓 인증 수정 실패");
  } catch (err) {
    console.error("❌ updateTicket 오류:", err);
    throw err;
  }
};

/* ============================================================
    3) 티켓 삭제
    DELETE /api/reservations/{ticketId}
============================================================ */
export const deleteTicket = async (ticketId) => {
  try {
    const res = await axiosInstance.delete(`${base}/${ticketId}`);

    if (res.data.success) return true;
    throw new Error("티켓 인증 삭제 실패");
  } catch (err) {
    console.error("❌ deleteTicket 오류:", err);
    throw err;
  }
};

/* ============================================================
    4) 티켓 단일 조회
    GET /api/reservations/{ticketId}
============================================================ */
export const getTicket = async (ticketId) => {
  try {
    const res = await axiosInstance.get(`${base}/${ticketId}`);

    if (res.data.success) return res.data.data; // TicketDetailResponseDto
    throw new Error("티켓 인증 정보 조회 실패");
  } catch (err) {
    console.error("❌ getTicket 오류:", err);
    throw err;
  }
};

/* ============================================================
    5) 티켓 목록 조회
    GET /api/reservations/list?page=1&size=10
============================================================ */
export const getTicketList = async (page = 1, size = 10) => {
  try {
    const res = await axiosInstance.get(`${base}/list`, {
      params: { page, size },
    });

    if (res.data.success) return res.data.data; // TicketSimpleListResponseDto
    throw new Error("티켓 인증 목록 조회 실패");
  } catch (err) {
    console.error("❌ getTicketList 오류:", err);
    throw err;
  }
};

/* ============================================================
    Export 묶음
============================================================ */
export default {
  createTicket,
  updateTicket,
  deleteTicket,
  getTicket,
  getTicketList,
};
