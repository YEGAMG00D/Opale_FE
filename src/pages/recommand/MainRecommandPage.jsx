import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PerformanceCard from '../../components/culture/PerformanceCard';
import styles from './MainRecommandPage.module.css';

const MainRecommandPage = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

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

  // 슬라이드 이동 함수
  const goToSlide = (index) => {
    if (index < 0) {
      setCurrentIndex(recommendedSeries.length - 1);
    } else if (index >= recommendedSeries.length) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(index);
    }
  };

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

  // 공연시그널 테스트로 이동
  const handleTestClick = () => {
    // 추후 테스트 페이지로 이동할 경로 추가
    navigate('/recommend/test');
  };

  return (
    <div className={styles.container}>
      {/* 추천 영화 시리즈 슬라이드 섹션 */}
      <section className={styles.seriesSection}>
        <h2 className={styles.sectionTitle}>추천 영화 시리즈</h2>
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
            style={{ transform: `translateX(-${currentIndex * (100 / 2.5)}%)` }}
          >
            {recommendedSeries.map((series) => (
              <div key={series.id} className={styles.slideCard}>
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
    </div>
  );
};

export default MainRecommandPage;
