import React, { useState, useEffect } from 'react';
import { getTicketList, getTicketReviews } from '../../api/reservationApi';
import { normalizeTicketList, categorizeTickets } from '../../services/normalizeTicketList';
import { normalizeTicketReviews } from '../../services/normalizeTicketReviews';
import styles from './TicketSelectModal.module.css';

const TicketSelectModal = ({ isOpen, onClose, onSelectTicket }) => {
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
        // 티켓 목록 가져오기
        const response = await getTicketList(1, 100); // 충분히 많은 티켓 가져오기
        const normalized = normalizeTicketList(response);
        
        // 관람한 공연만 필터링
        const { watched } = categorizeTickets(normalized.tickets);
        
        // 각 티켓에 대해 리뷰 여부 확인
        const ticketsWithoutReview = [];
        
        for (const ticket of watched) {
          try {
            const ticketId = ticket.ticketId || ticket.id;
            if (!ticketId) continue;

            // 티켓의 리뷰 확인
            const reviewsResponse = await getTicketReviews(ticketId);
            const normalizedReviews = normalizeTicketReviews(reviewsResponse);
            
            // 공연 후기와 공연장 리뷰 둘 다 작성된 티켓은 제외
            // 둘 다 작성되지 않은 티켓만 추가 (하나라도 없으면 추가)
            if (!normalizedReviews.hasPerformanceReview || !normalizedReviews.hasPlaceReview) {
              ticketsWithoutReview.push({
                ...ticket,
                ticketId: ticketId,
                performanceId: ticket.performanceId || null,
                placeId: ticket.placeId || null
              });
            }
          } catch (err) {
            // 리뷰 조회 실패 시 (404 등) 리뷰가 없는 것으로 간주하고 추가
            console.log(`티켓 ${ticket.ticketId || ticket.id} 리뷰 확인 실패 (리뷰 없음으로 간주):`, err);
            
            ticketsWithoutReview.push({
              ...ticket,
              ticketId: ticket.ticketId || ticket.id,
              performanceId: ticket.performanceId || null,
              placeId: ticket.placeId || null
            });
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
  }, [isOpen]);

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

