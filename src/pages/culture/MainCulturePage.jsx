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
      category: "musical",
      status: "ongoing" // 진행중
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
      category: "musical",
      status: "ongoing" // 진행중
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
      category: "musical",
      status: "ongoing" // 진행중
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
      category: "musical",
      status: "ongoing" // 진행중
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
      category: "musical",
      status: "ongoing" // 진행중
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
      category: "musical",
      status: "ongoing" // 진행중
    },
    // 진행중인 공연 5개 추가
    {
      id: 7,
      title: "햄릿",
      subtitle: "HAMLET",
      description: "세상에서 가장 유명한 비극",
      date: "2025.01.15 ~ 2025.03.30",
      venue: "예술의전당 오페라하우스",
      image: "wicked", // 임시 이미지
      rating: 4.5,
      reviewCount: 145,
      keywords: ["연극", "클래식", "셰익스피어"],
      category: "play",
      status: "ongoing"
    },
    {
      id: 8,
      title: "시카고",
      subtitle: "CHICAGO",
      description: "재즈 시대의 화려한 범죄 스토리",
      date: "2025.02.01 ~ 2025.04.15",
      venue: "세종문화회관 대극장",
      image: "moulin-rouge", // 임시 이미지
      rating: 4.7,
      reviewCount: 198,
      keywords: ["뮤지컬", "재즈", "범죄"],
      category: "musical",
      status: "ongoing"
    },
    {
      id: 9,
      title: "오페라의 유령",
      subtitle: "THE PHANTOM OF THE OPERA",
      description: "오페라 하우스의 비밀스러운 사랑 이야기",
      date: "2025.01.20 ~ 2025.05.10",
      venue: "블루스퀘어 신한카드홀",
      image: "kinky-boots", // 임시 이미지
      rating: 4.8,
      reviewCount: 267,
      keywords: ["뮤지컬", "로맨스", "클래식"],
      category: "musical",
      status: "ongoing"
    },
    {
      id: 10,
      title: "리어왕",
      subtitle: "KING LEAR",
      description: "권력과 가족의 비극",
      date: "2025.02.10 ~ 2025.04.20",
      venue: "국립극장 해오름극장",
      image: "hanbok-man", // 임시 이미지
      rating: 4.3,
      reviewCount: 112,
      keywords: ["연극", "비극", "셰익스피어"],
      category: "play",
      status: "ongoing"
    },
    {
      id: 11,
      title: "레미제라블",
      subtitle: "LES MISÉRABLES",
      description: "프랑스 혁명의 시대를 배경으로 한 감동 드라마",
      date: "2025.01.25 ~ 2025.05.30",
      venue: "충무아트센터 대극장",
      image: "rent", // 임시 이미지
      rating: 4.9,
      reviewCount: 312,
      keywords: ["뮤지컬", "드라마", "역사"],
      category: "musical",
      status: "ongoing"
    },
    // 종료된 공연 5개 추가
    {
      id: 12,
      title: "맘마미아!",
      subtitle: "MAMMA MIA!",
      description: "ABBA의 명곡들로 만든 화려한 뮤지컬",
      date: "2024.09.01 ~ 2024.11.30",
      venue: "디큐브 링크아트센터",
      image: "death-note", // 임시 이미지
      rating: 4.6,
      reviewCount: 189,
      keywords: ["뮤지컬", "코미디", "ABBA"],
      category: "musical",
      status: "ended"
    },
    {
      id: 13,
      title: "햄릿",
      subtitle: "HAMLET (2024)",
      description: "셰익스피어의 대표작",
      date: "2024.08.15 ~ 2024.10.20",
      venue: "예술의전당 CJ토월극장",
      image: "wicked", // 임시 이미지
      rating: 4.4,
      reviewCount: 156,
      keywords: ["연극", "클래식", "셰익스피어"],
      category: "play",
      status: "ended"
    },
    {
      id: 14,
      title: "라이온킹",
      subtitle: "THE LION KING",
      description: "디즈니의 아프리카 대자연 이야기",
      date: "2024.07.01 ~ 2024.09.30",
      venue: "샤롯데씨어터",
      image: "moulin-rouge", // 임시 이미지
      rating: 4.8,
      reviewCount: 245,
      keywords: ["뮤지컬", "디즈니", "가족"],
      category: "musical",
      status: "ended"
    },
    {
      id: 15,
      title: "세일즈맨의 죽음",
      subtitle: "DEATH OF A SALESMAN",
      description: "아서 밀러의 명작",
      date: "2024.06.10 ~ 2024.08.15",
      venue: "국립극장 자유소극장",
      image: "kinky-boots", // 임시 이미지
      rating: 4.5,
      reviewCount: 134,
      keywords: ["연극", "드라마", "현대극"],
      category: "play",
      status: "ended"
    },
    {
      id: 16,
      title: "캣츠",
      subtitle: "CATS",
      description: "앤드루 로이드 웨버의 대표작",
      date: "2024.05.01 ~ 2024.07.20",
      venue: "블루스퀘어 신한카드홀",
      image: "hanbok-man", // 임시 이미지
      rating: 4.7,
      reviewCount: 201,
      keywords: ["뮤지컬", "판타지", "가족"],
      category: "musical",
      status: "ended"
    },
    // 진행 예정인 공연 5개 추가
    {
      id: 17,
      title: "미스 사이공",
      subtitle: "MISS SAIGON",
      description: "베트남 전쟁 시대의 사랑 이야기",
      date: "2025.06.01 ~ 2025.08.31",
      venue: "세종문화회관 대극장",
      image: "rent", // 임시 이미지
      rating: 0,
      reviewCount: 0,
      keywords: ["뮤지컬", "로맨스", "드라마"],
      category: "musical",
      status: "upcoming"
    },
    {
      id: 18,
      title: "햄릿",
      subtitle: "HAMLET (2025 Summer)",
      description: "셰익스피어의 불멸의 명작",
      date: "2025.07.15 ~ 2025.09.30",
      venue: "예술의전당 오페라하우스",
      image: "death-note", // 임시 이미지
      rating: 0,
      reviewCount: 0,
      keywords: ["연극", "클래식", "셰익스피어"],
      category: "play",
      status: "upcoming"
    },
    {
      id: 19,
      title: "에비타",
      subtitle: "EVITA",
      description: "아르헨티나의 영부인 에비타 페론의 이야기",
      date: "2025.08.01 ~ 2025.10.31",
      venue: "충무아트센터 대극장",
      image: "wicked", // 임시 이미지
      rating: 0,
      reviewCount: 0,
      keywords: ["뮤지컬", "역사", "드라마"],
      category: "musical",
      status: "upcoming"
    },
    {
      id: 20,
      title: "오셀로",
      subtitle: "OTHELLO",
      description: "질투와 사랑의 비극",
      date: "2025.09.10 ~ 2025.11.20",
      venue: "국립극장 해오름극장",
      image: "moulin-rouge", // 임시 이미지
      rating: 0,
      reviewCount: 0,
      keywords: ["연극", "비극", "셰익스피어"],
      category: "play",
      status: "upcoming"
    },
    {
      id: 21,
      title: "드림걸스",
      subtitle: "DREAMGIRLS",
      description: "1960년대 R&B 그룹의 성공 스토리",
      date: "2025.10.05 ~ 2026.01.15",
      venue: "디큐브 링크아트센터",
      image: "kinky-boots", // 임시 이미지
      rating: 0,
      reviewCount: 0,
      keywords: ["뮤지컬", "R&B", "드라마"],
      category: "musical",
      status: "upcoming"
    },
    // 콘서트 추가
    {
      id: 22,
      title: "NCT WISH 콘서트",
      subtitle: "NCT WISH CONCERT",
      description: "NCT WISH의 화려한 무대",
      date: "2025.01.05 ~ 2025.01.07",
      venue: "올림픽공원 올림픽홀",
      image: "rent", // 임시 이미지
      rating: 4.8,
      reviewCount: 342,
      keywords: ["콘서트", "K-pop", "NCT"],
      category: "concert",
      status: "ended"
    },
    {
      id: 23,
      title: "SKY FESTIVAL",
      subtitle: "SKY FESTIVAL 2025",
      description: "올해 최고의 페스티벌, SKY FESTIVAL",
      date: "2025.01.18 ~ 2025.01.19",
      venue: "잠실종합운동장 주경기장",
      image: "moulin-rouge", // 임시 이미지
      rating: 0,
      reviewCount: 0,
      keywords: ["콘서트", "페스티벌", "K-pop"],
      category: "concert",
      status: "upcoming"
    },
    {
      id: 24,
      title: "아이유 콘서트",
      subtitle: "IU CONCERT - The Golden Hour",
      description: "아이유의 황금빛 무대",
      date: "2025.02.15 ~ 2025.02.16",
      venue: "잠실실내체육관",
      image: "kinky-boots", // 임시 이미지
      rating: 0,
      reviewCount: 0,
      keywords: ["콘서트", "K-pop", "아이유"],
      category: "concert",
      status: "upcoming"
    },
    {
      id: 25,
      title: "BTS 콘서트",
      subtitle: "BTS WORLD TOUR",
      description: "BTS의 글로벌 월드 투어",
      date: "2024.12.20 ~ 2024.12.22",
      venue: "고척스카이돔",
      image: "wicked", // 임시 이미지
      rating: 4.9,
      reviewCount: 567,
      keywords: ["콘서트", "K-pop", "BTS"],
      category: "concert",
      status: "ended"
    },
    {
      id: 26,
      title: "뉴진스 콘서트",
      subtitle: "NewJeans LIVE",
      description: "뉴진스의 특별한 라이브 무대",
      date: "2025.03.10 ~ 2025.03.12",
      venue: "올림픽공원 체조경기장",
      image: "death-note", // 임시 이미지
      rating: 0,
      reviewCount: 0,
      keywords: ["콘서트", "K-pop", "뉴진스"],
      category: "concert",
      status: "upcoming"
    },
    {
      id: 27,
      title: "세븐틴 콘서트",
      subtitle: "SEVENTEEN TOUR",
      description: "세븐틴의 화려한 퍼포먼스",
      date: "2024.11.15 ~ 2024.11.17",
      venue: "잠실종합운동장 주경기장",
      image: "hanbok-man", // 임시 이미지
      rating: 4.7,
      reviewCount: 289,
      keywords: ["콘서트", "K-pop", "세븐틴"],
      category: "concert",
      status: "ended"
    },
    {
      id: 28,
      title: "르세라핌 콘서트",
      subtitle: "LE SSERAFIM LIVE",
      description: "르세라핌의 강렬한 무대",
      date: "2025.02.28 ~ 2025.03.02",
      venue: "올림픽공원 올림픽홀",
      image: "rent", // 임시 이미지
      rating: 0,
      reviewCount: 0,
      keywords: ["콘서트", "K-pop", "르세라핌"],
      category: "concert",
      status: "upcoming"
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
