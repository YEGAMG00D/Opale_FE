import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyTicketPage.module.css';
import wickedPoster from '../../../assets/poster/wicked.gif';
import moulinRougePoster from '../../../assets/poster/moulin-rouge.gif';
import kinkyBootsPoster from '../../../assets/poster/kinky-boots.gif';
import hanbokManPoster from '../../../assets/poster/hanbok-man.jpg';
import deathNotePoster from '../../../assets/poster/death-note.gif';
import rentPoster from '../../../assets/poster/rent.gif';

const MyTicketPage = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [flippedTickets, setFlippedTickets] = useState({});
  const [activeTab, setActiveTab] = useState('booked'); // 'booked' (예매한 공연) or 'watched' (관람한 공연)

  // 포스터 이미지 매핑
  const posterImages = {
    'wicked': wickedPoster,
    '위키드': wickedPoster,
    'moulin-rouge': moulinRougePoster,
    '물랑루즈': moulinRougePoster,
    'kinky-boots': kinkyBootsPoster,
    '킹키부츠': kinkyBootsPoster,
    'hanbok-man': hanbokManPoster,
    '한복입은남자': hanbokManPoster,
    'death-note': deathNotePoster,
    '데스노트': deathNotePoster,
    'rent': rentPoster,
    '렌트': rentPoster
  };

  // 공연명에서 포스터 찾기
  const getPosterImage = (performanceName) => {
    if (!performanceName) return null;
    
    const nameLower = performanceName.toLowerCase();
    for (const [key, image] of Object.entries(posterImages)) {
      if (nameLower.includes(key.toLowerCase())) {
        return image;
      }
    }
    // 기본값으로 위키드 포스터 반환
    return wickedPoster;
  };

  // 티켓이 예매한 공연인지 관람한 공연인지 판단
  const isTicketWatched = (ticket) => {
    if (!ticket.performanceDate) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const ticketDate = new Date(ticket.performanceDate);
    ticketDate.setHours(0, 0, 0, 0);
    
    return ticketDate < today;
  };

  // 로컬 스토리지에서 티켓 목록 불러오기
  useEffect(() => {
    const savedTickets = localStorage.getItem('myTickets');
    if (savedTickets) {
      setTickets(JSON.parse(savedTickets));
    }
  }, []);

  // 티켓 목록 업데이트를 위한 이벤트 리스너
  useEffect(() => {
    const handleStorageChange = () => {
      const savedTickets = localStorage.getItem('myTickets');
      if (savedTickets) {
        setTickets(JSON.parse(savedTickets));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    // 같은 탭에서도 업데이트되도록 커스텀 이벤트 사용
    window.addEventListener('ticketUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('ticketUpdated', handleStorageChange);
    };
  }, []);

  const handleDeleteTicket = (ticketId) => {
    if (window.confirm('티켓을 삭제하시겠습니까?')) {
      const updatedTickets = tickets.filter(ticket => ticket.id !== ticketId);
      setTickets(updatedTickets);
      localStorage.setItem('myTickets', JSON.stringify(updatedTickets));
      // 플립 상태도 제거
      setFlippedTickets(prev => {
        const newState = { ...prev };
        delete newState[ticketId];
        return newState;
      });
    }
  };

  const handleFlipTicket = (ticketId) => {
    setFlippedTickets(prev => ({
      ...prev,
      [ticketId]: !prev[ticketId]
    }));
  };

  // 탭별 티켓 필터링
  const filteredTickets = activeTab === 'booked'
    ? tickets.filter(ticket => !isTicketWatched(ticket))
    : tickets.filter(ticket => isTicketWatched(ticket));

  return (
    <div className={styles.container}>
      {/* 상단 헤더 */}
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>MY 티켓</h2>
        <button 
          className={styles.registerButton}
          onClick={() => navigate('/my/tickets/register')}
        >
          티켓 등록하기
        </button>
      </div>

      {/* 탭 메뉴 */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'booked' ? styles.active : ''}`}
          onClick={() => setActiveTab('booked')}
        >
          예매한 공연
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'watched' ? styles.active : ''}`}
          onClick={() => setActiveTab('watched')}
        >
          관람한 공연
        </button>
      </div>

      {/* 티켓 목록 */}
      <div className={styles.ticketList}>
        {filteredTickets.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🎫</div>
            <p className={styles.emptyText}>
              {activeTab === 'booked' 
                ? '예매한 공연이 없습니다'
                : '관람한 공연이 없습니다'}
            </p>
            <p className={styles.emptySubText}>티켓 등록하기 버튼을 눌러 티켓을 등록해보세요</p>
          </div>
        ) : (
          <div className={styles.ticketGrid}>
            {filteredTickets.map((ticket) => {
              const isFlipped = flippedTickets[ticket.id] || false;
              const posterImage = getPosterImage(ticket.performanceName);
              
              return (
                <div key={ticket.id} className={styles.ticketCardWrapper}>
                  <div 
                    className={`${styles.ticketCard} ${isFlipped ? styles.flipped : ''}`}
                    onClick={() => handleFlipTicket(ticket.id)}
                  >
                    {/* 앞면: 포스터 + 제목 */}
                    <div className={styles.ticketFront}>
                      <button 
                        className={styles.deleteButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTicket(ticket.id);
                        }}
                      >
                        ×
                      </button>
                      {posterImage && (
                        <div className={styles.ticketPoster}>
                          <img 
                            src={posterImage} 
                            alt={ticket.performanceName}
                            className={styles.posterImage}
                          />
                          <div className={styles.posterOverlay}></div>
                        </div>
                      )}
                      <div className={styles.ticketTitleSection}>
                        <h3 className={styles.ticketPerformanceName}>{ticket.performanceName}</h3>
                        <div className={styles.ticketDateInfo}>
                          {ticket.performanceDate} {ticket.performanceTime && ticket.performanceTime}
                        </div>
                      </div>
                    </div>
                    
                    {/* 뒷면: 좌석 정보 */}
                    <div className={styles.ticketBack}>
                      <div className={styles.ticketBackHeader}>
                        <h3 className={styles.ticketBackTitle}>{ticket.performanceName}</h3>
                        <button 
                          className={styles.deleteButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTicket(ticket.id);
                          }}
                        >
                          ×
                        </button>
                      </div>
                      <div className={styles.ticketBackBody}>
                        <div className={styles.ticketInfoRow}>
                          <span className={styles.ticketLabel}>공연일자</span>
                          <span className={styles.ticketValue}>
                            {ticket.performanceDate} {ticket.performanceTime && ticket.performanceTime}
                          </span>
                        </div>
                        {(ticket.section || ticket.row || ticket.number) && (
                          <div className={styles.ticketInfoRow}>
                            <span className={styles.ticketLabel}>좌석정보</span>
                            <span className={styles.ticketValue}>
                              {ticket.section || ''} {ticket.row ? `${ticket.row}열` : ''} {ticket.number ? `${ticket.number}번` : ''}
                            </span>
                          </div>
                        )}
                        <div className={styles.ticketInfoRow}>
                          <span className={styles.ticketLabel}>등록일</span>
                          <span className={styles.ticketValue}>{ticket.registeredDate}</span>
                        </div>
                        <button
                          className={styles.editButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/my/tickets/edit', { state: { ticket } });
                          }}
                        >
                          수정하기
                        </button>
                      </div>
                    </div>
                  </div>
                  {activeTab === 'watched' && (
                    <button 
                      className={styles.reviewButton}
                      onClick={() => navigate('/recommend/review', { state: { ticketData: ticket } })}
                    >
                      리뷰 작성하기
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default MyTicketPage;

