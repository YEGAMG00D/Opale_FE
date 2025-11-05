import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PerformanceCard from '../../components/culture/PerformanceCard';
import styles from './MainCulturePage.module.css';

const MainCulturePage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const searchRef = useRef(null);

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

  // 검색 제안 데이터 - 실제 공연 + 추가 제안
  const allSearchSuggestions = useMemo(() => {
    const iconColors = ["#FFC0CB", "#FFFACD", "#90EE90", "#ADD8E6"];
    
    const performanceSuggestions = performances.map((perf, index) => ({
      id: perf.id,
      title: perf.title,
      subtitle: perf.subtitle,
      iconColor: iconColors[index % iconColors.length]
    }));

    const additionalSuggestions = [
      { id: 100, title: "위아이", iconColor: "#FFFACD" },
      { id: 101, title: "위대한쇼맨", iconColor: "#90EE90" },
      { id: 102, title: "위대한개츠비", iconColor: "#ADD8E6" },
      { id: 103, title: "위플래시", iconColor: "#FFC0CB" },
      { id: 104, title: "위스퍼", iconColor: "#FFFACD" }
    ];

    return [...performanceSuggestions, ...additionalSuggestions];
  }, []); // 빈 배열로 변경 - performances는 정적 데이터이므로 의존성에서 제거

  const categories = [
    { id: 'all', label: '전체' },
    { id: 'musical', label: '뮤지컬' },
    { id: 'play', label: '연극' },
    { id: 'concert', label: '콘서트' }
  ];

  // 검색어 변경 시 제안 필터링
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = allSearchSuggestions.filter(suggestion =>
      suggestion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (suggestion.subtitle && suggestion.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredSuggestions(filtered);
    setShowSuggestions(true);
  }, [searchQuery]); // allSearchSuggestions 의존성 제거 - 무한 랜더링 방지

  // 외부 클릭 시 제안 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 검색 페이지로 이동
      navigate(`/culture/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.title);
    setShowSuggestions(false);
    // 검색 페이지로 이동
    navigate(`/culture/search?q=${encodeURIComponent(suggestion.title)}`);
  };

  const filteredPerformances = selectedCategory === 'all' 
    ? performances 
    : performances.filter(performance => performance.category === selectedCategory);

  return (
    <div className={styles.container}>
      {/* Search Bar */}
      <div className={styles.searchSection} ref={searchRef}>
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder=""
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery && setShowSuggestions(true)}
          />
          <button type="submit" className={styles.searchIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#FFC0CB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 21L16.65 16.65" stroke="#FFC0CB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>

        {/* Search Suggestions */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className={styles.suggestionsContainer}>
            <div className={styles.suggestionsDivider}></div>
            <div className={styles.suggestionsList}>
              {filteredSuggestions.slice(0, 4).map((suggestion) => (
                <div
                  key={suggestion.id}
                  className={styles.suggestionItem}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: suggestion.iconColor }}>
                    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className={styles.suggestionText}>{suggestion.title}</span>
                </div>
              ))}
              {filteredSuggestions.length > 4 && (
                <div 
                  className={styles.viewAllResults}
                  onClick={() => navigate(`/culture/search?q=${encodeURIComponent(searchQuery)}`)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: "#FFC0CB" }}>
                    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className={styles.viewAllText}>"{searchQuery}"에 대한 모든 결과 보기</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

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
          <PerformanceCard
            key={performance.id}
            id={performance.id}
            title={performance.title}
            image={performance.image}
            rating={performance.rating}
            reviewCount={performance.reviewCount}
            date={performance.date}
            keywords={performance.keywords}
            variant="default"
          />
        ))}
      </div>
    </div>
  );
};

export default MainCulturePage;
