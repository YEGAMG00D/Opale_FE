import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PerformanceCard from '../../components/culture/PerformanceCard';
import styles from './MainRecommandPage.module.css';

const MainRecommandPage = () => {
  const navigate = useNavigate();
  
  // 추천 영화 시리즈 데이터
  const recommendedSeries = [
    {
      id: 1,
      title: "WICKED",
      subtitle: "뮤지컬 위키드",
      description: "The untold true story of the Witches of Oz",
      tagline: "12년을 기다린 오리지널 내한공연",
      date: "2025.7.12 Flying Soon",
      venue: "BLUESQUARE 신한카드홀",
      image: "wicked",
      rating: 4.6,
      reviewCount: 210,
      keywords: ["뮤지컬", "오리지널", "내한공연"]
    },
    {
      id: 2,
      title: "물랑루즈!",
      subtitle: "MOULIN ROUGE!",
      description: "TRUTH BEAUTY FREEDOM LOVE",
      tagline: "WINNER! 10 TONY AWARDS BEST MUSICAL!",
      date: "2025.11.27~2026.02.22",
      venue: "BLUESQUARE 신한카드홀",
      image: "moulin-rouge",
      rating: 4.7,
      reviewCount: 189,
      keywords: ["뮤지컬", "로맨스", "클래식"]
    },
    {
      id: 3,
      title: "킹키부츠",
      subtitle: "KINKY BOOTS",
      description: "HARVEY FIERSTEIN, CYNDI LAUPER, JERRY MITCHELL",
      date: "2025.12.17 - 2026.03.29",
      venue: "샤롯데씨어터",
      image: "kinky-boots",
      rating: 4.8,
      reviewCount: 156,
      keywords: ["뮤지컬", "코미디", "감동"]
    },
    {
      id: 4,
      title: "한복입은남자",
      subtitle: "The Man in Hanbok",
      description: "장영실, 다빈치를 만나다",
      date: "2025.12.02~2026.03.08",
      venue: "충무아트센터 대극장",
      image: "hanbok-man",
      rating: 4.5,
      reviewCount: 98,
      keywords: ["창작뮤지컬", "역사", "과학"]
    },
    {
      id: 5,
      title: "데스노트",
      subtitle: "DEATH NOTE",
      description: "누군가 이 세상을 바로잡아야 한다",
      date: "2025.10.14 ~ 2026.05.10",
      venue: "디큐브 링크아트센터",
      image: "death-note",
      rating: 4.4,
      reviewCount: 167,
      keywords: ["뮤지컬", "스릴러", "판타지"]
    },
    {
      id: 6,
      title: "RENT",
      subtitle: "뮤지컬 렌트",
      description: "BOOK, MUSIC AND LYRICS BY JONATHAN LARSON",
      date: "2025.11.09 ~ 2026.02.22",
      venue: "coexartium",
      image: "rent",
      rating: 4.9,
      reviewCount: 234,
      keywords: ["뮤지컬", "드라마", "감동"]
    }
  ];

  // 상태 관리
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(recommendedSeries.length * 2); // 두 번째 복제본 영역에서 시작
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const sliderRef = useRef(null);
  
  // 티켓 등록 모달 상태
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

  // 슬라이드 이동 함수 (무한 루프)
  const goToSlide = (index) => {
    setIsTransitioning(true);
    
    let targetIndex = index;
    
    // 경계 처리
    if (index < 0) {
      targetIndex = recommendedSeries.length - 1;
    } else if (index >= recommendedSeries.length) {
      targetIndex = 0;
    }
    
    const seriesLength = recommendedSeries.length;
    
    // 현재 displayIndex를 기준으로 자연스럽게 이동
    let newDisplayIndex = displayIndex;
    const direction = index - currentIndex;
    
    if (direction < 0) {
      // 뒤로 이동
      newDisplayIndex = displayIndex - 1;
    } else if (direction > 0) {
      // 앞으로 이동
      newDisplayIndex = displayIndex + 1;
    }
    // direction === 0이면 같은 위치이므로 newDisplayIndex 유지
    
    // 경계를 넘어가면 자연스럽게 다른 복제본 영역으로 이동
    // 슬라이드가 충분히 복제되어 있으므로 경계를 넘어가도 계속 이동 가능
    // 다만 너무 멀리 가면 중간 영역으로 조정
    const maxIndex = seriesLength * 5 - 1; // 전체 슬라이드 개수 - 1
    const minIndex = 0;
    
    if (newDisplayIndex < minIndex) {
      // 음수 방향으로 너무 가면 마지막으로
      newDisplayIndex = maxIndex;
    } else if (newDisplayIndex > maxIndex) {
      // 양수 방향으로 너무 가면 처음으로
      newDisplayIndex = minIndex;
    }
    
    setDisplayIndex(newDisplayIndex);
    setCurrentIndex(targetIndex);
  };

  // 무한 루프를 위한 슬라이드 배열 생성 (충분히 복제하여 자연스러운 루프 구현)
  const infiniteSlides = [
    ...recommendedSeries, // 원본 슬라이드들 (0-5)
    ...recommendedSeries, // 첫 번째 복제본 (6-11)
    ...recommendedSeries, // 두 번째 복제본 (12-17)
    ...recommendedSeries, // 세 번째 복제본 (18-23)
    ...recommendedSeries  // 네 번째 복제본 (24-29)
  ];

  // 터치/드래그 이벤트 핸들러
  const handleStart = (e) => {
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };

  const handleMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
  };

  const handleEnd = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const diffX = startX - clientX;
    
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // 왼쪽으로 스와이프 - 다음 슬라이드
        goToSlide(currentIndex + 1);
      } else {
        // 오른쪽으로 스와이프 - 이전 슬라이드
        goToSlide(currentIndex - 1);
      }
    }
  };

  // 공연시그널로 이동
  const handleTestClick = () => {
    navigate('/recommend/signal');
  };

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
    console.log('티켓 등록:', ticketData);
    setShowTicketModal(false);
    navigate('/recommend/review', { state: { ticketData } });
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

  return (
    <div className={styles.container}>
      {/* 상단 헤더 */}
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>추천</h2>
        <div className={styles.headerButtons}>
          <button 
            className={styles.myTicketButton}
            onClick={() => navigate('/recommend/my-ticket')}
          >
            MY 티켓
          </button>
          <button 
            className={styles.ticketButton}
            onClick={handleOpenTicketModal}
          >
            티켓 등록하기
          </button>
        </div>
      </div>

      {/* 추천 영화 시리즈 슬라이드 섹션 */}
      <section className={styles.seriesSection}>
        <h2 className={styles.sectionTitle}>추천하는 공연</h2>
        <div 
          className={styles.sliderContainer}
          ref={sliderRef}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
        >
          <div 
            className={styles.sliderTrack}
            style={{ 
              transform: `translateX(-${displayIndex * (100 / 2.5)}%)`,
              transition: isTransitioning ? 'transform 0.3s ease' : 'none'
            }}
            onTransitionEnd={() => {
              // transition이 끝난 후 경계를 넘어갔는지 확인하고 조정
              const seriesLength = recommendedSeries.length;
              const totalSlides = seriesLength * 5;
              
              // 경계를 넘어가면 자연스럽게 다른 복제본 영역으로 이동
              // 하지만 너무 멀리 가면 중간 영역으로 조정하여 메모리 효율성 유지
              if (displayIndex < seriesLength) {
                // 원본 영역에 있으면 두 번째 복제본 영역으로 이동 (transition 없이)
                setIsTransitioning(false);
                setDisplayIndex(seriesLength * 2 + currentIndex);
              } else if (displayIndex >= seriesLength * 4) {
                // 네 번째 복제본 영역 이상이면 두 번째 복제본 영역으로 이동 (transition 없이)
                setIsTransitioning(false);
                setDisplayIndex(seriesLength * 2 + currentIndex);
              }
            }}
          >
            {infiniteSlides.map((series, index) => (
              <div key={`${series.id}-${index}`} className={styles.slideCard}>
                <PerformanceCard
                  id={series.id}
                  title={series.title}
                  image={series.image}
                  rating={series.rating}
                  reviewCount={series.reviewCount}
                  date={series.date}
                  keywords={series.keywords}
                  variant="default"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* 슬라이드 인디케이터 */}
        <div className={styles.sliderIndicators}>
          {recommendedSeries.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${currentIndex === index ? styles.active : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`슬라이드 ${index + 1}`}
            />
          ))}
        </div>

        {/* 좌우 화살표 버튼 */}
        <button
          className={styles.prevButton}
          onClick={() => goToSlide(currentIndex - 1)}
          aria-label="이전 슬라이드"
        >
          ‹
        </button>
        <button
          className={styles.nextButton}
          onClick={() => goToSlide(currentIndex + 1)}
          aria-label="다음 슬라이드"
        >
          ›
        </button>
      </section>

      {/* 공연시그널 퍼스널 성향 테스트 섹션 */}
      <section className={styles.testSection}>
        <div className={styles.testCard} onClick={handleTestClick}>
          <div className={styles.testContent}>
            <h2 className={styles.testTitle}>공연시그널</h2>
            <p className={styles.testDescription}>
              나와 찰떡인 공연을 찾아보세요
            </p>
            <p className={styles.testSubDescription}>
              간단한 질문으로 당신만의 공연을 추천받아보세요
            </p>
            <div className={styles.testButton}>
              시작하기 →
            </div>
          </div>
        </div>
      </section>

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

export default MainRecommandPage;
