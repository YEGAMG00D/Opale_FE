/**
 * 티켓 상세 목록 API 응답을 프론트엔드 형식으로 정제
 */

import { normalizeTicketDetail } from './normalizeTicketDetail';

/**
 * 티켓 상세 목록 API 응답을 프론트엔드 형식으로 변환
 * @param {Object} apiResponse - API 응답 (TicketDetailListResponseDto)
 * @param {number} apiResponse.totalCount - 총 티켓 수
 * @param {number} apiResponse.currentPage - 현재 페이지
 * @param {number} apiResponse.pageSize - 페이지당 티켓 수
 * @param {number} apiResponse.totalPages - 전체 페이지 수
 * @param {boolean} apiResponse.hasNext - 다음 페이지 존재 여부
 * @param {boolean} apiResponse.hasPrev - 이전 페이지 존재 여부
 * @param {Array} apiResponse.tickets - 티켓 목록 (TicketDetailResponseDto[])
 * @returns {Object} - 정제된 티켓 상세 목록 데이터
 */
export const normalizeTicketDetailList = (apiResponse) => {
  if (!apiResponse || !apiResponse.tickets) {
    return {
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
      tickets: []
    };
  }

  // 각 티켓을 프론트엔드 형식으로 변환
  // TicketDetailResponseDto는 normalizeTicketDetail을 재사용
  const normalizedTickets = apiResponse.tickets.map((ticket) => {
    const normalized = normalizeTicketDetail(ticket);
    
    // 등록일 추가 (requestedAt이 있으면 사용, 없으면 현재 날짜)
    const registeredDate = ticket.requestedAt 
      ? new Date(ticket.requestedAt).toLocaleDateString('ko-KR')
      : new Date().toLocaleDateString('ko-KR');
    
    return {
      ...normalized,
      registeredDate
    };
  });

  return {
    totalCount: apiResponse.totalCount || 0,
    currentPage: apiResponse.currentPage || 1,
    pageSize: apiResponse.pageSize || 10,
    totalPages: apiResponse.totalPages || 0,
    hasNext: apiResponse.hasNext || false,
    hasPrev: apiResponse.hasPrev || false,
    tickets: normalizedTickets
  };
};

/**
 * 티켓을 예매한 공연/관람한 공연으로 분류
 * @param {Array} tickets - 티켓 목록
 * @returns {Object} - { booked: [], watched: [] }
 */
export const categorizeTickets = (tickets) => {
  if (!tickets || !Array.isArray(tickets)) {
    return { booked: [], watched: [] };
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const booked = [];
  const watched = [];

  tickets.forEach((ticket) => {
    if (!ticket.performanceDate) {
      // 날짜가 없으면 예매한 공연으로 분류
      booked.push(ticket);
      return;
    }

    // performanceDate를 Date 객체로 변환
    // performanceDate는 "yyyy-MM-dd" 형식
    const ticketDate = new Date(ticket.performanceDate);
    const ticketDateOnly = new Date(
      ticketDate.getFullYear(),
      ticketDate.getMonth(),
      ticketDate.getDate()
    );

    // 오늘 날짜와 비교
    if (ticketDateOnly >= today) {
      // 오늘 이후면 예매한 공연
      booked.push(ticket);
    } else {
      // 오늘 이전이면 관람한 공연
      watched.push(ticket);
    }
  });

  return { booked, watched };
};

