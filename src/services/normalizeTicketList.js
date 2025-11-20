/**
 * 티켓 목록 API 응답을 프론트엔드 형식으로 정제
 */

import { transformTicketDataFromApi } from '../utils/ticketDataTransform';

/**
 * 티켓 목록 API 응답을 프론트엔드 형식으로 변환
 * @param {Object} apiResponse - API 응답 (TicketSimpleListResponseDto)
 * @param {number} apiResponse.totalCount - 총 티켓 수
 * @param {number} apiResponse.currentPage - 현재 페이지
 * @param {number} apiResponse.pageSize - 페이지당 티켓 수
 * @param {number} apiResponse.totalPages - 전체 페이지 수
 * @param {boolean} apiResponse.hasNext - 다음 페이지 존재 여부
 * @param {boolean} apiResponse.hasPrev - 이전 페이지 존재 여부
 * @param {Array} apiResponse.tickets - 티켓 목록 (TicketSimpleResponseDto[])
 * @returns {Object} - 정제된 티켓 목록 데이터
 */
export const normalizeTicketList = (apiResponse) => {
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
  const normalizedTickets = apiResponse.tickets.map((ticket) => {
    // TicketSimpleResponseDto를 프론트엔드 형식으로 변환
    // performanceDate는 LocalDateTime 형식이므로 변환 필요
    const frontendData = transformTicketDataFromApi({
      performanceName: ticket.performanceName,
      performanceDate: ticket.performanceDate,
      seatInfo: ticket.seatInfo,
      placeName: ticket.placeName
    });

    return {
      id: ticket.ticketId,
      ticketId: ticket.ticketId,
      performanceName: ticket.performanceName || '',
      performanceDate: frontendData?.performanceDate || '',
      performanceTime: frontendData?.performanceTime || '',
      section: frontendData?.section || '',
      row: frontendData?.row || '',
      number: frontendData?.number || '',
      placeName: ticket.placeName || '',
      // 등록일은 API 응답에 없으므로 현재 날짜로 설정하거나 null
      registeredDate: new Date().toLocaleDateString('ko-KR')
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

