/**
 * 티켓 데이터 관리 유틸리티
 * 모든 페이지에서 동일한 티켓 데이터를 사용하도록 통합
 */

const TICKET_STORAGE_KEY = 'myTickets';

/**
 * localStorage에서 티켓 목록 가져오기
 */
export const getTickets = () => {
  try {
    const savedTickets = localStorage.getItem(TICKET_STORAGE_KEY);
    return savedTickets ? JSON.parse(savedTickets) : [];
  } catch (error) {
    console.error('티켓 데이터 로드 실패:', error);
    return [];
  }
};

/**
 * localStorage에 티켓 목록 저장하기
 */
export const saveTickets = (tickets) => {
  try {
    localStorage.setItem(TICKET_STORAGE_KEY, JSON.stringify(tickets));
    // 다른 탭/컴포넌트에 변경사항 알림
    window.dispatchEvent(new Event('ticketUpdated'));
    return true;
  } catch (error) {
    console.error('티켓 데이터 저장 실패:', error);
    return false;
  }
};

/**
 * 티켓 추가
 */
export const addTicket = (ticket) => {
  const tickets = getTickets();
  const newTicket = {
    id: ticket.id || Date.now(),
    ...ticket,
    registeredDate: ticket.registeredDate || new Date().toISOString().split('T')[0]
  };
  const updatedTickets = [newTicket, ...tickets];
  saveTickets(updatedTickets);
  return newTicket;
};

/**
 * 티켓 수정
 */
export const updateTicket = (ticketId, updatedData) => {
  const tickets = getTickets();
  const updatedTickets = tickets.map(ticket => 
    ticket.id === ticketId 
      ? { ...ticket, ...updatedData }
      : ticket
  );
  saveTickets(updatedTickets);
  return updatedTickets.find(t => t.id === ticketId);
};

/**
 * 티켓 삭제
 */
export const deleteTicket = (ticketId) => {
  const tickets = getTickets();
  const updatedTickets = tickets.filter(ticket => ticket.id !== ticketId);
  saveTickets(updatedTickets);
  return true;
};

/**
 * 티켓이 관람한 공연인지 판단 (공연일자가 오늘 이전인지)
 */
export const isTicketWatched = (ticket) => {
  if (!ticket.performanceDate) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const ticketDate = new Date(ticket.performanceDate);
  ticketDate.setHours(0, 0, 0, 0);
  
  return ticketDate < today;
};

/**
 * 예매한 공연 목록 가져오기
 */
export const getBookedTickets = () => {
  const tickets = getTickets();
  return tickets.filter(ticket => !isTicketWatched(ticket));
};

/**
 * 관람한 공연 목록 가져오기
 */
export const getWatchedTickets = () => {
  const tickets = getTickets();
  return tickets.filter(ticket => isTicketWatched(ticket));
};

/**
 * 공연 ID로 티켓 찾기
 */
export const getTicketsByPerformanceId = (performanceId) => {
  const tickets = getTickets();
  // performanceId가 직접 매칭되거나, performanceName으로 매칭
  return tickets.filter(ticket => 
    ticket.performanceId === performanceId || 
    ticket.performanceName?.includes(performanceId)
  );
};

/**
 * 공연명으로 티켓 찾기
 */
export const getTicketsByPerformanceName = (performanceName) => {
  const tickets = getTickets();
  if (!performanceName) return [];
  return tickets.filter(ticket => 
    ticket.performanceName && 
    ticket.performanceName.includes(performanceName)
  );
};

