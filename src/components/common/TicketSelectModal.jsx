import React, { useState, useEffect } from 'react';
import { getTicketDetailList, getTicketReviews } from '../../api/reservationApi';
import { normalizeTicketDetailList, categorizeTickets } from '../../services/normalizeTicketDetailList';
import { normalizeTicketReviews } from '../../services/normalizeTicketReviews';
import styles from './TicketSelectModal.module.css';

const TicketSelectModal = ({ isOpen, onClose, onSelectTicket, filterPerformanceId = null, filterPlaceId = null }) => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 리뷰를 안 쓴 티켓만 필터링
  useEffect(() => {
    const loadTicketsWithoutReview = async () => {
      if (!isOpen) return;

      setIsLoading(true);
      setError(null);

      try {
        // 티켓 상세 목록 가져오기 (performanceId, placeId 포함)
        const response = await getTicketDetailList(1, 100); // 충분히 많은 티켓 가져오기
        const normalized = normalizeTicketDetailList(response);
        
        // 관람한 공연만 필터링
        const { watched } = categorizeTickets(normalized.tickets);
        
        // performanceId 또는 placeId 필터링 적용
        let filteredByIds = watched;
        if (filterPerformanceId) {
          // performanceId가 정확히 일치하는 티켓만 필터링 (null, undefined 제외)
          const filterIdStr = String(filterPerformanceId);
          filteredByIds = filteredByIds.filter(ticket => {
            const ticketPerformanceId = ticket.performanceId;
            // null, undefined, 빈 문자열 제외
            if (!ticketPerformanceId) {
              return false;
            }
            // 문자열로 변환하여 비교 (타입 불일치 방지)
            const ticketIdStr = String(ticketPerformanceId);
            const matches = ticketIdStr === filterIdStr;
            
            // 디버깅 로그 (필요시 제거)
            if (!matches) {
              console.log(`[TicketSelectModal] 티켓 ${ticket.ticketId} 필터링 제외: performanceId 불일치`, {
                ticketPerformanceId: ticketIdStr,
                filterPerformanceId: filterIdStr
              });
            }
            
            return matches;
          });
        }
        if (filterPlaceId) {
          // placeId가 정확히 일치하는 티켓만 필터링 (null, undefined 제외)
          const filterIdStr = String(filterPlaceId);
          filteredByIds = filteredByIds.filter(ticket => {
            const ticketPlaceId = ticket.placeId;
            // null, undefined, 빈 문자열 제외
            if (!ticketPlaceId) {
              return false;
            }
            // 문자열로 변환하여 비교 (타입 불일치 방지)
            const ticketIdStr = String(ticketPlaceId);
            return ticketIdStr === filterIdStr;
          });
        }
        
        // 각 티켓에 대해 리뷰 여부 확인
        const ticketsWithoutReview = [];
        
        for (const ticket of filteredByIds) {
          try {
            const ticketId = ticket.ticketId || ticket.id;
            if (!ticketId) continue;

            // 티켓의 리뷰 확인
            const reviewsResponse = await getTicketReviews(ticketId);
            const normalizedReviews = normalizeTicketReviews(reviewsResponse);
            
            // 필터링 조건에 따라 리뷰 존재 여부 확인
            let shouldInclude = false;
            
            if (filterPerformanceId) {
              // 공연 상세 페이지: 공연 후기가 없는 티켓만
              shouldInclude = !normalizedReviews.hasPerformanceReview;
            } else if (filterPlaceId) {
              // 공연장 상세 페이지: 공연장 리뷰가 없는 티켓만
              shouldInclude = !normalizedReviews.hasPlaceReview;
            } else {
              // 일반 모달: 공연 후기 또는 공연장 리뷰 중 하나라도 없는 티켓
              shouldInclude = !normalizedReviews.hasPerformanceReview || !normalizedReviews.hasPlaceReview;
            }
            
            if (shouldInclude) {
              ticketsWithoutReview.push({
                ...ticket,
                ticketId: ticketId,
                performanceId: ticket.performanceId || null,
                placeId: ticket.placeId || null
              });
            }
          } catch (err) {
            // 리뷰 조회 실패 시 (404 등) 리뷰가 없는 것으로 간주
            // 하지만 filterPerformanceId나 filterPlaceId가 있으면 해당 필터 조건을 만족하는 경우만 추가
            console.log(`티켓 ${ticket.ticketId || ticket.id} 리뷰 확인 실패 (리뷰 없음으로 간주):`, err);
            
            // 필터링 조건 확인
            let shouldIncludeOnError = true;
            
            if (filterPerformanceId) {
              // performanceId가 일치하고 null이 아닌 경우만
              const ticketPerformanceId = ticket.performanceId;
              if (!ticketPerformanceId || String(ticketPerformanceId) !== String(filterPerformanceId)) {
                shouldIncludeOnError = false;
              }
            }
            
            if (filterPlaceId) {
              // placeId가 일치하고 null이 아닌 경우만
              const ticketPlaceId = ticket.placeId;
              if (!ticketPlaceId || String(ticketPlaceId) !== String(filterPlaceId)) {
                shouldIncludeOnError = false;
              }
            }
            
            if (shouldIncludeOnError) {
              ticketsWithoutReview.push({
                ...ticket,
                ticketId: ticket.ticketId || ticket.id,
                performanceId: ticket.performanceId || null,
                placeId: ticket.placeId || null
              });
            }
          }
        }
        
        setFilteredTickets(ticketsWithoutReview);
        setTickets(ticketsWithoutReview);
      } catch (err) {
        console.error('티켓 목록 조회 실패:', err);
        setError('티켓 목록을 불러오는데 실패했습니다.');
        setFilteredTickets([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTicketsWithoutReview();
  }, [isOpen, filterPerformanceId, filterPlaceId]);

  const handleSelectTicket = (ticket) => {
    // 티켓 정보를 프론트엔드 형식으로 변환
    const ticketData = {
      id: ticket.ticketId || ticket.id,
      ticketId: ticket.ticketId || ticket.id,
      performanceName: ticket.performanceName || '',
      performanceDate: ticket.performanceDate || '',
      performanceTime: ticket.performanceTime || '',
      seatFront: ticket.seatFront || '',
      seatNumber: ticket.seatNumber || '',
      placeName: ticket.placeName || '',
      ticketImageUrl: ticket.ticketImageUrl || null,
      performanceId: ticket.performanceId || null,
      placeId: ticket.placeId || null
    };
    
    onSelectTicket(ticketData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>등록한 예매 내역에서 선택</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.content}>
          {isLoading ? (
            <div className={styles.loading}>
              <p>티켓 목록을 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className={styles.error}>
              <p>{error}</p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className={styles.empty}>
              <p>리뷰를 작성하지 않은 티켓이 없습니다.</p>
            </div>
          ) : (
            <div className={styles.ticketList}>
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.ticketId || ticket.id}
                  className={styles.ticketItem}
                  onClick={() => handleSelectTicket(ticket)}
                >
                  <div className={styles.ticketInfo}>
                    <div className={styles.performanceName}>
                      {ticket.performanceName || '공연명 없음'}
                    </div>
                    <div className={styles.ticketDetails}>
                      {ticket.performanceDate && (
                        <span className={styles.detailItem}>
                          {ticket.performanceDate}
                          {ticket.performanceTime && ` ${ticket.performanceTime}`}
                        </span>
                      )}
                      {(ticket.seatFront || ticket.seatNumber) && (
                        <span className={styles.detailItem}>
                          {ticket.seatFront && ticket.seatNumber 
                            ? `${ticket.seatFront}-${ticket.seatNumber}번`
                            : ticket.seatFront || ticket.seatNumber ? `${ticket.seatFront || ''}${ticket.seatNumber ? `${ticket.seatNumber}번` : ''}`.trim()
                            : ''}
                        </span>
                      )}
                      {ticket.placeName && (
                        <span className={styles.detailItem}>{ticket.placeName}</span>
                      )}
                    </div>
                  </div>
                  <div className={styles.selectArrow}>→</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketSelectModal;

