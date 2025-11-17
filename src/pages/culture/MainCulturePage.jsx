import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './MainCulturePage.module.css';
import { usePerformanceList } from '../../hooks/usePerformanceList';
import PerformanceApiCard from '../../components/cards/PerformanceApiCard';
import { normalizePerformance } from '../../services/normalizePerformance';

const MainCulturePage = () => {
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const { performances, sentinelRef, loading } = usePerformanceList({
    genre: selectedCategory === "all" ? null : selectedCategory,
    sortType: "인기",
  });

  const parsed = performances.map(normalizePerformance);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/culture/search?q=${searchQuery}`);
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setShowSuggestions(false);
      return;
    }

    const filtered = parsed.filter((p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredSuggestions(filtered.slice(0, 5));
    setShowSuggestions(true);
  }, [searchQuery, parsed]);

  const categories = [
    { id: 'all', label: '전체' },
    { id: 'musical', label: '뮤지컬' },
    { id: 'play', label: '연극' },
    { id: 'concert', label: '콘서트' }
  ];

  return (
    <div className={styles.container}>

      {/* 검색창 (원래 UI 그대로) */}
      <div className={styles.searchSection} ref={searchRef}>
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <input
            type="text"
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      {/* 장르 탭 (원상 복구된 UI 그대로) */}
      <div className={styles.categorySection}>
        <div className={styles.categoryTabs}>
          {categories.map((c) => (
            <button
              key={c.id}
              className={`${styles.categoryTab} ${
                selectedCategory === c.id ? styles.activeCategory : ""
              }`}
              onClick={() => setSelectedCategory(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 카드 그리드 */}
      <div className={styles.performanceGrid}>
        {parsed.map((p, index) => (
          <PerformanceApiCard
            key={p.id + "_" + index}
            {...p}
            onClick={() => navigate(`/culture/${p.id}`)}
          />
        ))}
      </div>


      <div ref={sentinelRef} style={{ height: 40 }} />
      {loading && <p>불러오는 중...</p>}
    </div>
  );
};

export default MainCulturePage;
