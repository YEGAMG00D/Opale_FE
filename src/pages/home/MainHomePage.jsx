import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './MainHomePage.module.css';
import Header from '../../layouts/Header';

const MainHomePage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

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

  const featuredPerformances = [
    {
      id: 1,
      title: "데스노트",
      subtitle: "DEATH NOTE",
      genre: "뮤지컬",
      description: "누군가 이 세상을 바로잡아야 한다",
      rating: "4.4",
      reviewCount: "167",
      image: "death-note"
    },
    {
      id: 2,
      title: "RENT",
      subtitle: "뮤지컬 렌트",
      genre: "뮤지컬", 
      description: "BOOK, MUSIC AND LYRICS BY JONATHAN LARSON",
      rating: "4.9",
      reviewCount: "234",
      image: "rent"
    }
  ];

  // 포스터 확장자 매핑
  const posterExt = {
    'wicked': 'gif',
    'moulin-rouge': 'gif',
    'kinky-boots': 'gif',
    'hanbok-man': 'jpg',
    'death-note': 'gif',
    'rent': 'gif'
  };

  return (
    <div className={styles.container}>
      <Header />

      {/* Main Carousel Section */}
      <section className={styles.carouselSection}>
        <div className={styles.carouselContainer}>
          <div className={styles.carouselTrack} style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {performances.map((performance) => (
              <div 
                key={performance.id} 
                className={styles.carouselSlide}
                onClick={() => navigate(`/culture/${performance.id + 1}`)}
              >
                <div className={styles.slideLink}>
                  <div className={styles.poster}>
                    <img
                      className={styles.posterImg}
                      src={`/poster/${performance.image}.${posterExt[performance.image] || 'jpg'}`}
                      alt={`${performance.title} 포스터`}
                    />
                    <div className={styles.posterOverlay}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Carousel Indicators */}
        <div className={styles.carouselIndicators}>
          {performances.map((_, index) => (
            <div 
              key={index}
              className={`${styles.indicator} ${currentSlide === index ? styles.active : ''}`}
              onClick={() => goToSlide(index)}
            ></div>
          ))}
        </div>
      </section>

      {/* CTA Sections */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaButton} style={{ backgroundColor: '#EAF0F5' }}>
          <div className={styles.ctaText}>나랑 가까운 공연 바로가기</div>
        </div>
        
        <div className={styles.ctaButton} style={{ backgroundColor: '#EAF5E0' }}>
          <div className={styles.ctaTitle}>나와 맞는 공연은?</div>
          <div className={styles.ctaSubtitle}>나랑 찰떡콩떡 공연 찾으러 가기</div>
        </div>
      </section>

      {/* Featured Performances */}
      <section className={styles.featuredSection}>
        <div className={styles.featuredGrid}>
          {featuredPerformances.map((performance) => (
            <Link key={performance.id} to="/culture/detail" className={styles.featuredCard}>
              <div className={styles.featuredPoster}>
                <img
                  className={styles.featuredPosterImg}
                  src={`/poster/${performance.image}.${posterExt[performance.image] || 'jpg'}`}
                  alt={`${performance.title} 포스터`}
                />
              </div>
              <div className={styles.featuredInfo}>
                <div className={styles.featuredGenre}>{performance.genre}</div>
                <div className={styles.featuredTitleText}>{performance.title}</div>
                <div className={styles.featuredDescription}>{performance.description}</div>
                <div className={styles.featuredRating}>
                  <span className={styles.star}>★</span>
                  <span className={styles.ratingText}>{performance.rating} ({performance.reviewCount})</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MainHomePage;
