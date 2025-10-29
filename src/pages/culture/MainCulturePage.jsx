import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './MainCulturePage.module.css';

const MainCulturePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const performances = [
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
      keywords: ["뮤지컬", "오리지널", "내한공연"],
      category: "musical"
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
      keywords: ["뮤지컬", "로맨스", "클래식"],
      category: "musical"
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
      keywords: ["뮤지컬", "코미디", "감동"],
      category: "musical"
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
      keywords: ["창작뮤지컬", "역사", "과학"],
      category: "musical"
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
      keywords: ["뮤지컬", "스릴러", "판타지"],
      category: "musical"
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
      keywords: ["뮤지컬", "드라마", "감동"],
      category: "musical"
    }
  ];

  const categories = [
    { id: 'all', label: '전체' },
    { id: 'musical', label: '뮤지컬' },
    { id: 'play', label: '연극' },
    { id: 'concert', label: '콘서트' }
  ];

  const filteredPerformances = selectedCategory === 'all' 
    ? performances 
    : performances.filter(performance => performance.category === selectedCategory);

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.backButton}>←</div>
          <div className={styles.headerTitle}>공연</div>
          <div className={styles.searchButton}>🔍</div>
        </div>
      </header>

      {/* Category Filter */}
      <div className={styles.categorySection}>
        <div className={styles.categoryTabs}>
          {categories.map(category => (
            <button
              key={category.id}
              className={`${styles.categoryTab} ${selectedCategory === category.id ? styles.activeCategory : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Performance Grid */}
      <div className={styles.performanceGrid}>
        {filteredPerformances.map((performance) => (
          <Link key={performance.id} to="/culture/detail" className={styles.performanceCard}>
            <div className={`${styles.posterCard} ${styles[performance.image]}`}>
              <div className={styles.posterContent}>
                <div className={styles.posterTagline}>{performance.tagline}</div>
                <div className={styles.posterTitle}>{performance.title}</div>
                <div className={styles.posterSubtitle}>{performance.subtitle}</div>
                <div className={styles.posterDescription}>{performance.description}</div>
                <div className={styles.posterDate}>{performance.date}</div>
                <div className={styles.posterVenue}>{performance.venue}</div>
              </div>
            </div>
            <div className={styles.cardInfo}>
              <div className={styles.cardTitle}>{performance.title}</div>
              <div className={styles.cardSubtitle}>{performance.subtitle}</div>
              <div className={styles.cardRating}>
                <span className={styles.star}>★</span>
                <span className={styles.ratingText}>{performance.rating} ({performance.reviewCount})</span>
              </div>
              <div className={styles.cardKeywords}>
                {performance.keywords.map((keyword, index) => (
                  <span key={index} className={styles.keyword}>#{keyword}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom Navigation */}
      <nav className={styles.bottomNav}>
        <div className={styles.navItem}>공연장</div>
        <div className={`${styles.navItem} ${styles.active}`}>공연</div>
        <div className={styles.navItem}>홈</div>
        <div className={styles.navItem}>채팅</div>
        <div className={styles.navItem}>추천</div>
      </nav>
    </div>
  );
};

export default MainCulturePage;
