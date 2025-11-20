/**
 * 티켓 데이터 관리 유틸리티
 * 사용자별로 티켓 데이터를 분리하여 관리
 */

const TICKET_STORAGE_KEY_PREFIX = 'myTickets_';

/**
 * 현재 로그인한 사용자 ID 가져오기
 */
const getCurrentUserId = () => {
  try {
    const userRaw = localStorage.getItem('user');
    if (userRaw) {
      const user = JSON.parse(userRaw);
      return user?.userId || user?.id || null;
    }
  } catch (error) {
    console.error('사용자 정보 파싱 실패:', error);
  }
  return null;
};

/**
 * 사용자별 티켓 스토리지 키 생성
 */
const getTicketStorageKey = (userId = null) => {
  const targetUserId = userId || getCurrentUserId();
  if (!targetUserId) {
    // 사용자 ID가 없으면 임시 키 사용 (비로그인 상태)
    return `${TICKET_STORAGE_KEY_PREFIX}guest`;
  }
  return `${TICKET_STORAGE_KEY_PREFIX}${targetUserId}`;
};

/**
 * 현재 사용자의 티켓 데이터 초기화 (빈 배열로 설정)
 */
export const initializeUserTickets = (userId = null) => {
  try {
    const storageKey = getTicketStorageKey(userId);
    localStorage.setItem(storageKey, JSON.stringify([]));
    // 다른 탭/컴포넌트에 변경사항 알림
    window.dispatchEvent(new Event('ticketUpdated'));
    return true;
  } catch (error) {
    console.error('티켓 데이터 초기화 실패:', error);
    return false;
  }
};

/**
 * 사용자의 티켓 데이터가 존재하는지 확인
 */
export const hasUserTickets = (userId = null) => {
  try {
    const storageKey = getTicketStorageKey(userId);
    const tickets = localStorage.getItem(storageKey);
    if (!tickets) return false;
    const parsedTickets = JSON.parse(tickets);
    return Array.isArray(parsedTickets) && parsedTickets.length > 0;
  } catch (error) {
    return false;
  }
};

/**
 * 이전 사용자의 티켓 데이터 정리 (선택적)
 */
export const clearPreviousUserTickets = (currentUserId) => {
  try {
    // 모든 티켓 관련 키 찾기
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(TICKET_STORAGE_KEY_PREFIX)) {
        // 현재 사용자 키가 아니면 제거
        const currentUserKey = getTicketStorageKey(currentUserId);
        if (key !== currentUserKey) {
          keysToRemove.push(key);
        }
      }
    }
    
    // 이전 사용자 데이터 제거
    keysToRemove.forEach(key => localStorage.removeItem(key));
    return true;
  } catch (error) {
    console.error('이전 사용자 티켓 데이터 정리 실패:', error);
    return false;
  }
};

/**
 * localStorage에서 티켓 목록 가져오기 (현재 사용자)
 */
export const getTickets = () => {
  try {
    const storageKey = getTicketStorageKey();
    const savedTickets = localStorage.getItem(storageKey);
    return savedTickets ? JSON.parse(savedTickets) : [];
  } catch (error) {
    console.error('티켓 데이터 로드 실패:', error);
    return [];
  }
};

/**
 * localStorage에 티켓 목록 저장하기 (현재 사용자)
 */
export const saveTickets = (tickets) => {
  try {
    const storageKey = getTicketStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(tickets));
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

