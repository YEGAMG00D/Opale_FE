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
    6) 티켓 기반 공연 리뷰 + 공연장 리뷰 조회
    GET /api/reservations/{ticketId}/reviews
============================================================ */
export const getTicketReviews = async (ticketId) => {
  try {
    const res = await axiosInstance.get(`${base}/${ticketId}/reviews`);

    if (res.data.success) return res.data.data; // TicketReviewBundleResponseDto
    throw new Error("티켓 기반 리뷰 조회 실패");
  } catch (err) {
    console.error("❌ getTicketReviews 오류:", err);
    throw err;
  }
};


/* ============================================================
    7) 티켓 이미지 OCR
    POST /api/reservations/ocr
============================================================ */
export const extractTicketByOcr = async (file) => {
  try {
    console.log('🌐 [extractTicketByOcr] API 호출 시작, 파일:', {
      name: file.name || 'blob',
      size: file.size,
      type: file.type
    });
    
    const formData = new FormData();
    formData.append("file", file);
    
    console.log('📦 [extractTicketByOcr] FormData 생성 완료');

    const res = await axiosInstance.post(
      `${base}/ocr`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log('✅ [extractTicketByOcr] API 응답 받음:', res.data);
    
    if (res.data.success) {
      console.log('✅ [extractTicketByOcr] 성공, 데이터:', res.data.data);
      return res.data.data;
    }
    
    throw new Error("티켓 OCR 실패");
  } catch (err) {
    console.error("❌ [extractTicketByOcr] 오류:", err);
    console.error("❌ [extractTicketByOcr] 에러 상세:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      statusText: err.response?.statusText
    });
    throw err;
  }
};


/* ============================================================
    8) 티켓 상세 목록 조회
    GET /api/reservations/list/detail?page=1&size=10
============================================================ */
export const getTicketDetailList = async (page = 1, size = 10) => {
  try {
    const res = await axiosInstance.get(`${base}/list/detail`, {
      params: { page, size },
    });

    if (res.data.success) return res.data.data; // TicketDetailListResponseDto
    throw new Error("티켓 인증 상세 목록 조회 실패");
  } catch (err) {
    console.error("❌ getTicketDetailList 오류:", err);
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
  getTicketDetailList, 
  getTicketReviews, 
  extractTicketByOcr,
};
