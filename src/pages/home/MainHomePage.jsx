import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PerformanceCard from '../../components/culture/PerformanceCard';
import DiscountPromotionSection from '../../components/common/DiscountPromotionSection';
import styles from './MainHomePage.module.css';
import wickedPoster from '../../assets/poster/wicked.gif';
import moulinRougePoster from '../../assets/poster/moulin-rouge.gif';
import kinkyBootsPoster from '../../assets/poster/kinky-boots.gif';
import hanbokManPoster from '../../assets/poster/hanbok-man.jpg';
import deathNotePoster from '../../assets/poster/death-note.gif';
import rentPoster from '../../assets/poster/rent.gif';

const MainHomePage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDraggingIndicator, setIsDraggingIndicator] = useState(false);
  const [indicatorStartX, setIndicatorStartX] = useState(0);
  const [indicatorContainerRef, setIndicatorContainerRef] = useState(null);

  const performances = [
    {
      id: 0,
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
      id: 1,
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
      id: 2,
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
      id: 3,
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
      id: 4,
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
      id: 5,
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

  // 자동 슬라이드 기능
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => 
        prevSlide === performances.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000); // 5초마다 자동 슬라이드

    return () => clearInterval(interval);
  }, [performances.length]);

  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  // 인디케이터 드래그 핸들러
  const handleIndicatorMouseDown = (e, index) => {
    e.preventDefault();
    setIsDraggingIndicator(true);
    setIndicatorStartX(e.clientX);
    setCurrentSlide(index);
  };

  const handleIndicatorMouseUp = () => {
    setIsDraggingIndicator(false);
  };

  // 인디케이터 영역에서 마우스 위치를 슬라이드 인덱스로 변환
  const getSlideIndexFromMouseX = (clientX, containerRect) => {
    const x = clientX - containerRect.left;
    const containerWidth = containerRect.width;
    const slideRatio = x / containerWidth;
    const slideIndex = Math.round(slideRatio * performances.length);
    return Math.max(0, Math.min(performances.length - 1, slideIndex));
  };

  useEffect(() => {
    if (!isDraggingIndicator) return;

    const handleIndicatorMouseMove = (e) => {
      if (!indicatorContainerRef) return;
      
      const rect = indicatorContainerRef.getBoundingClientRect();
      const newIndex = getSlideIndexFromMouseX(e.clientX, rect);
      setCurrentSlide(newIndex);
    };

    const handleMouseUp = () => {
      setIsDraggingIndicator(false);
    };

    document.addEventListener('mousemove', handleIndicatorMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleIndicatorMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [isDraggingIndicator, indicatorContainerRef, performances.length]);

  const featuredPerformances = [
    {
      id: 1,
      title: "데스노트",
      subtitle: "DEATH NOTE",
      genre: "뮤지컬",
      description: "누군가 이 세상을 바로잡아야 한다",
      rating: 4.4,
      reviewCount: 167,
      image: "death-note"
    },
    {
      id: 2,
      title: "RENT",
      subtitle: "뮤지컬 렌트",
      genre: "뮤지컬", 
      description: "BOOK, MUSIC AND LYRICS BY JONATHAN LARSON",
      rating: 4.9,
      reviewCount: 234,
      image: "rent"
    }
  ];

  // 포스터 이미지 매핑
  const posterImages = {
    'wicked': wickedPoster,
    'moulin-rouge': moulinRougePoster,
    'kinky-boots': kinkyBootsPoster,
    'hanbok-man': hanbokManPoster,
    'death-note': deathNotePoster,
    'rent': rentPoster
  };

  return (
    <div className={styles.container}>
      {/* Main Carousel Section */}
      <section className={styles.carouselSection}>
        <div className={styles.carouselContainer}>
          <div 
            className={styles.carouselTrack} 
            style={{ 
              transform: `translateX(-${currentSlide * (100 / performances.length)}%)`,
              width: `${performances.length * 100}%`
            }}
          >
            {performances.map((performance) => (
              <div 
                key={performance.id} 
                className={styles.carouselSlide}
                style={{ width: `${100 / performances.length}%` }}
                onClick={() => navigate(`/culture/${performance.id + 1}`)}
              >
                <div className={styles.slideLink}>
                  <div className={styles.poster}>
                    <img
                      className={styles.posterImg}
                      src={posterImages[performance.image] || wickedPoster}
                      alt={`${performance.title} 포스터`}
                    />
                    <div className={styles.posterOverlay}></div>
                    <div className={styles.posterContent}>
                      <div className={styles.posterTagline}>{performance.tagline}</div>
                      <div className={styles.posterTitle}>{performance.title}</div>
                      <div className={styles.posterSubtitle}>{performance.subtitle}</div>
                      <div className={styles.posterDescription}>{performance.description}</div>
                      <div className={styles.posterDate}>{performance.date}</div>
                      <div className={styles.posterVenue}>{performance.venue}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Carousel Indicators */}
        <div 
          ref={setIndicatorContainerRef}
          className={styles.carouselIndicators}
          onMouseDown={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickedIndex = getSlideIndexFromMouseX(e.clientX, rect);
            handleIndicatorMouseDown(e, clickedIndex);
          }}
          onMouseUp={handleIndicatorMouseUp}
          onMouseLeave={handleIndicatorMouseUp}
        >
          {performances.map((_, index) => (
            <div 
              key={index}
              className={`${styles.indicator} ${currentSlide === index ? styles.active : ''}`}
              onClick={() => goToSlide(index)}
              onMouseDown={(e) => {
                e.stopPropagation();
                handleIndicatorMouseDown(e, index);
              }}
            ></div>
          ))}
        </div>
      </section>

      {/* CTA Sections */}
      <section className={styles.ctaSection}>
        <div 
          className={styles.ctaButton} 
          style={{ backgroundColor: '#EAF0F5' }}
          onClick={() => navigate('/place')}
        >
          <div className={styles.ctaText}>나랑 가까운 공연 바로가기</div>
        </div>
        
        <div 
          className={styles.ctaButton} 
          style={{ backgroundColor: '#EAF5E0' }}
          onClick={() => navigate('/recommend/signal')}
        >
          <div className={styles.ctaTitle}>나와 맞는 공연은?</div>
          <div className={styles.ctaSubtitle}>나랑 찰떡콩떡 공연 찾으러 가기</div>
        </div>
      </section>

      {/* Featured Performances */}
      <section className={styles.featuredSection}>
        <div className={styles.featuredGrid}>
          {featuredPerformances.map((performance) => (
            <PerformanceCard
              key={performance.id}
              id={performance.id}
              title={performance.title}
              image={performance.image}
              rating={performance.rating}
              reviewCount={performance.reviewCount}
              description={performance.description}
              genre={performance.genre}
              variant="featured"
            />
          ))}
        </div>
      </section>

      {/* Discount Promotion Section */}
      <DiscountPromotionSection />
    </div>
  );
};

export default MainHomePage;
