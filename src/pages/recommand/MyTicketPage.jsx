import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyTicketPage.module.css';
import wickedPoster from '../../assets/poster/wicked.gif';
import moulinRougePoster from '../../assets/poster/moulin-rouge.gif';
import kinkyBootsPoster from '../../assets/poster/kinky-boots.gif';
import hanbokManPoster from '../../assets/poster/hanbok-man.jpg';
import deathNotePoster from '../../assets/poster/death-note.gif';
import rentPoster from '../../assets/poster/rent.gif';

const MyTicketPage = () => {
  const navigate = useNavigate();
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketStep, setTicketStep] = useState('scan'); // 'scan' or 'manual'
  const [ticketData, setTicketData] = useState({
    performanceName: '',
    performanceDate: '',
    performanceTime: '',
    section: '',
    row: '',
    number: ''
  });
  const [isScanning, setIsScanning] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [flippedTickets, setFlippedTickets] = useState({});

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

  // 로컬 스토리지에서 티켓 목록 불러오기
  useEffect(() => {
    const savedTickets = localStorage.getItem('myTickets');
    if (savedTickets) {
      setTickets(JSON.parse(savedTickets));
    }
  }, []);

  // 티켓 등록 관련 핸들러
  const handleTicketScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setTicketData({
        performanceName: '뮤지컬 위키드 내한공연',
        performanceDate: '2025-10-23',
        performanceTime: '19:00',
        section: '나 구역',
        row: '15',
        number: '23'
      });
      setTicketStep('manual');
      setIsScanning(false);
    }, 2000);
  };

  const handleTicketManualInput = () => {
    setTicketStep('manual');
  };

  const handleTicketInputChange = (field, value) => {
    setTicketData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTicketRegister = () => {
    if (!ticketData.performanceName || !ticketData.performanceDate) {
      alert('공연명과 공연일자를 입력해주세요.');
      return;
    }

    const newTicket = {
      id: Date.now(),
      ...ticketData,
      registeredDate: new Date().toISOString().split('T')[0]
    };

    const updatedTickets = [newTicket, ...tickets];
    setTickets(updatedTickets);
    localStorage.setItem('myTickets', JSON.stringify(updatedTickets));
    
    setShowTicketModal(false);
    setTicketStep('scan');
    setTicketData({
      performanceName: '',
      performanceDate: '',
      performanceTime: '',
      section: '',
      row: '',
      number: ''
    });
  };

  const handleOpenTicketModal = () => {
    setShowTicketModal(true);
    setTicketStep('scan');
    setTicketData({
      performanceName: '',
      performanceDate: '',
      performanceTime: '',
      section: '',
      row: '',
      number: ''
    });
  };

  const handleCloseTicketModal = () => {
    setShowTicketModal(false);
    setTicketStep('scan');
  };

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

  return (
    <div className={styles.container}>
      {/* 상단 헤더 */}
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>MY 티켓</h2>
        <button 
          className={styles.registerButton}
          onClick={handleOpenTicketModal}
        >
          티켓 등록하기
        </button>
      </div>

      {/* 티켓 목록 */}
      <div className={styles.ticketList}>
        {tickets.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🎫</div>
            <p className={styles.emptyText}>등록된 티켓이 없습니다</p>
            <p className={styles.emptySubText}>티켓 등록하기 버튼을 눌러 티켓을 등록해보세요</p>
          </div>
        ) : (
          <div className={styles.ticketGrid}>
            {tickets.map((ticket) => {
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
                        {ticket.section && ticket.row && ticket.number && (
                          <div className={styles.ticketInfoRow}>
                            <span className={styles.ticketLabel}>좌석정보</span>
                            <span className={styles.ticketValue}>
                              {ticket.section} {ticket.row}열 {ticket.number}번
                            </span>
                          </div>
                        )}
                        <div className={styles.ticketInfoRow}>
                          <span className={styles.ticketLabel}>등록일</span>
                          <span className={styles.ticketValue}>{ticket.registeredDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button 
                    className={styles.reviewButton}
                    onClick={() => navigate('/recommend/review', { state: { ticketData: ticket } })}
                  >
                    리뷰 작성하기
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 티켓 등록 모달 */}
      {showTicketModal && (
        <div className={styles.modalOverlay} onClick={handleCloseTicketModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <button className={styles.closeButton} onClick={handleCloseTicketModal}>×</button>
            </div>
            <div className={styles.ticketCard}>
              {ticketStep === 'scan' ? (
                <>
                  <div className={styles.ticketTitle}>Frame 298</div>
                  <div className={styles.scanArea}>
                    <div className={styles.cameraIcon}>
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                    </div>
                    <p className={styles.scanInstruction}>
                      상자 안에 티켓의 위치를 맞춰주세요
                    </p>
                  </div>
                  <button 
                    className={styles.primaryButton}
                    onClick={handleTicketScan}
                    disabled={isScanning}
                  >
                    {isScanning ? '스캔 중...' : '스캔하기'}
                  </button>
                  <button 
                    className={styles.secondaryButton}
                    onClick={handleTicketManualInput}
                  >
                    직접 등록하기
                  </button>
                </>
              ) : (
                <>
                  <div className={styles.ticketTitle}>Frame 296</div>
                  <div className={styles.imagePlaceholder}>
                    {/* 티켓 이미지 영역 */}
                  </div>
                  <div className={styles.ticketForm}>
                    <div className={styles.formGroup}>
                      <label>공연명</label>
                      <input
                        type="text"
                        value={ticketData.performanceName}
                        onChange={(e) => handleTicketInputChange('performanceName', e.target.value)}
                        placeholder="공연명을 입력하세요"
                      />
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>공연일자</label>
                        <input
                          type="date"
                          value={ticketData.performanceDate}
                          onChange={(e) => handleTicketInputChange('performanceDate', e.target.value)}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>시간</label>
                        <input
                          type="time"
                          value={ticketData.performanceTime}
                          onChange={(e) => handleTicketInputChange('performanceTime', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label>좌석정보</label>
                      <div className={styles.seatInputs}>
                        <input
                          type="text"
                          value={ticketData.section}
                          onChange={(e) => handleTicketInputChange('section', e.target.value)}
                          placeholder="구역"
                          className={styles.seatInput}
                        />
                        <input
                          type="text"
                          value={ticketData.row}
                          onChange={(e) => handleTicketInputChange('row', e.target.value)}
                          placeholder="열"
                          className={styles.seatInput}
                        />
                        <input
                          type="text"
                          value={ticketData.number}
                          onChange={(e) => handleTicketInputChange('number', e.target.value)}
                          placeholder="번"
                          className={styles.seatInput}
                        />
                      </div>
                    </div>
                  </div>
                  <button 
                    className={styles.primaryButton}
                    onClick={handleTicketRegister}
                  >
                    티켓 등록
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTicketPage;

