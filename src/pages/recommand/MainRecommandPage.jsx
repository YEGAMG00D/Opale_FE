import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PerformanceCard from '../../components/culture/PerformanceCard';
import { fetchFavoritePerformances } from '../../api/favoriteApi';
import { getUserRecommendations, getRecentViewedPerformance, getRecentSimilarRecommendations, getPopularRecommendations, getGenreRecommendations } from '../../api/recommendationApi';
import { fetchPerformanceBasic } from '../../api/performanceApi';
import { normalizeRecommendation } from '../../services/normalizeRecommendation';
import { normalizePerformanceDetail } from '../../services/normalizePerformanceDetail';
import { hasUserTickets } from '../../utils/ticketUtils';
import { hasUserReviews } from '../../utils/reviewUtils';
import styles from './MainRecommandPage.module.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const MainRecommandPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector((state) => state.user);
  const [myKeywords, setMyKeywords] = useState([]);
  
  // 새 사용자 확인 상태
  const [isNewUser, setIsNewUser] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  
  // 로그인한 사용자용
  // 개인 맞춤 추천 공연 목록
  const [userRecommendations, setUserRecommendations] = useState([]);
  const [userRecommendationsLoading, setUserRecommendationsLoading] = useState(true);
  
  // 최근 본 공연과 유사한 공연 목록
  const [recentPerformance, setRecentPerformance] = useState(null);
  const [similarPerformances, setSimilarPerformances] = useState([]);
  const [similarPerformancesLoading, setSimilarPerformancesLoading] = useState(false);
  
  // 로그인하지 않은 사용자용
  // 인기 공연 추천
  const [popularPerformances, setPopularPerformances] = useState([]);
  const [popularPerformancesLoading, setPopularPerformancesLoading] = useState(true);
  
  // 장르 기반 추천 (랜덤 3개)
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genreRecommendations, setGenreRecommendations] = useState({}); // { '뮤지컬': [...], '연극': [...] }
  const [genreRecommendationsLoading, setGenreRecommendationsLoading] = useState({});
  
  // 개인 맞춤 추천 슬라이더 상태
  const [userRecCurrentIndex, setUserRecCurrentIndex] = useState(0);
  const [userRecDisplayIndex, setUserRecDisplayIndex] = useState(0);
  const [userRecIsTransitioning, setUserRecIsTransitioning] = useState(true);
  const [userRecStartX, setUserRecStartX] = useState(0);
  const [userRecIsDragging, setUserRecIsDragging] = useState(false);
  const userRecSliderRef = useRef(null);
  
  // 유사 공연 슬라이더 상태
  const [similarCurrentIndex, setSimilarCurrentIndex] = useState(0);
  const [similarDisplayIndex, setSimilarDisplayIndex] = useState(0);
  const [similarIsTransitioning, setSimilarIsTransitioning] = useState(true);
  const [similarStartX, setSimilarStartX] = useState(0);
  const [similarIsDragging, setSimilarIsDragging] = useState(false);
  const similarSliderRef = useRef(null);
  
  // 인기 공연 슬라이더 상태
  const [popularCurrentIndex, setPopularCurrentIndex] = useState(0);
  const [popularDisplayIndex, setPopularDisplayIndex] = useState(0);
  const [popularIsTransitioning, setPopularIsTransitioning] = useState(true);
  const [popularStartX, setPopularStartX] = useState(0);
  const [popularIsDragging, setPopularIsDragging] = useState(false);
  const popularSliderRef = useRef(null);
  
  // 장르별 슬라이더 상태 (각 장르마다 독립적으로 관리)
  const [genreSliderStates, setGenreSliderStates] = useState({});
  
  // 장르별 슬라이더 상태 초기화 함수
  const initializeGenreSliderState = (genre) => {
    if (!genreSliderStates[genre]) {
      setGenreSliderStates((prev) => ({
        ...prev,
        [genre]: {
          currentIndex: 0,
          displayIndex: 0,
          isTransitioning: true,
          startX: 0,
          isDragging: false
        }
      }));
    }
  };
  
  // 추천 영화 시리즈 데이터 (기존 하드코딩 데이터 - 필요시 제거 가능)
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
  


  // 로그인한 사용자: 새 사용자인지 확인
  useEffect(() => {
    const checkNewUser = async () => {
      if (!isLoggedIn) {
        setIsNewUser(false);
        setIsCheckingUser(false);
        return;
      }

      try {
        setIsCheckingUser(true);
        const userId = user?.userId || user?.id;
        
        if (!userId) {
          setIsNewUser(false);
          setIsCheckingUser(false);
          return;
        }

        // 티켓 확인 (localStorage)
        const hasTickets = hasUserTickets(userId);
        
        // 리뷰 확인 (서버 API)
        let hasReviews = false;
        try {
          hasReviews = await hasUserReviews(userId);
        } catch (error) {
          console.warn('리뷰 확인 실패 (새 사용자로 간주):', error);
          hasReviews = false;
        }

        // 티켓도 없고 리뷰도 없으면 새 사용자
        const isNew = !hasTickets && !hasReviews;
        setIsNewUser(isNew);
      } catch (err) {
        console.error('새 사용자 확인 실패:', err);
        // 에러 발생 시 새 사용자로 간주 (안전한 기본값)
        setIsNewUser(true);
      } finally {
        setIsCheckingUser(false);
      }
    };

    checkNewUser();
  }, [isLoggedIn, user]);

  // 로그인한 사용자: 관심 공연 기반 키워드 추출 (기존 사용자만)
  useEffect(() => {
    if (!isLoggedIn || isNewUser || isCheckingUser) return;
    
    const extractMyKeywords = async () => {
      try {
        const favoritePerformances = await fetchFavoritePerformances();
        if (!favoritePerformances || favoritePerformances.length === 0) {
          setMyKeywords([]);
          return;
        }

        // 모든 키워드 수집
        const keywordCount = {};
        favoritePerformances.forEach((performance) => {
          const keywords = performance.keywords || [];
          keywords.forEach((keyword) => {
            if (keyword) {
              keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
            }
          });
        });

        // 빈도순으로 정렬하고 상위 5개 추출
        const sortedKeywords = Object.entries(keywordCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([keyword]) => keyword);

        setMyKeywords(sortedKeywords);
      } catch (err) {
        console.error('관심 공연 키워드 추출 실패:', err);
        setMyKeywords([]);
      }
    };

    extractMyKeywords();
  }, [isLoggedIn, isNewUser, isCheckingUser]);

  // 로그인한 사용자: 개인 맞춤 추천 공연 목록 조회 (기존 사용자만)
  useEffect(() => {
    if (!isLoggedIn || isNewUser || isCheckingUser) return;
    
    const loadUserRecommendations = async () => {
      try {
        setUserRecommendationsLoading(true);
        const response = await getUserRecommendations({ size: 10 });
        const normalized = normalizeRecommendation(response);
        setUserRecommendations(normalized.recommendations || []);
      } catch (err) {
        console.error('개인 맞춤 추천 조회 실패:', err);
        setUserRecommendations([]);
      } finally {
        setUserRecommendationsLoading(false);
      }
    };

    loadUserRecommendations();
  }, [isLoggedIn, isNewUser, isCheckingUser]);

  // 로그인한 사용자: 최근 본 공연 조회 및 유사 공연 추천 (기존 사용자만)
  useEffect(() => {
    if (!isLoggedIn || isNewUser || isCheckingUser) return;
    
    const loadRecentAndSimilar = async () => {
      try {
        // 최근 본 공연 ID 조회
        const recentResponse = await getRecentViewedPerformance();
        const recentPerformanceId = recentResponse?.recentPerformanceId;
        
        if (!recentPerformanceId) {
          // 최근 본 공연이 없으면 섹션을 표시하지 않음
          setRecentPerformance(null);
          setSimilarPerformances([]);
          return;
        }
        
        // 최근 본 공연 상세 정보 가져오기 (타이틀용)
        try {
          const performanceData = await fetchPerformanceBasic(recentPerformanceId);
          const normalized = normalizePerformanceDetail(performanceData);
          
          // title이 있으면 최근 본 공연 정보 저장
          if (normalized && normalized.title && normalized.title.trim()) {
            setRecentPerformance(normalized);
          } else {
            console.warn('공연 제목이 없습니다:', normalized);
            setRecentPerformance(null);
            return;
          }
        } catch (perfErr) {
          console.error('최근 본 공연 정보 조회 실패:', perfErr);
          setRecentPerformance(null);
          return;
        }

        // 최근 본 공연 기반 유사 공연 추천 조회
        setSimilarPerformancesLoading(true);
        try {
          const similarResponse = await getRecentSimilarRecommendations({ size: 10 });
          const normalized = normalizeRecommendation(similarResponse);
          setSimilarPerformances(normalized.recommendations || []);
        } catch (similarErr) {
          console.error('유사 공연 추천 조회 실패:', similarErr);
          setSimilarPerformances([]);
        } finally {
          setSimilarPerformancesLoading(false);
        }
      } catch (err) {
        console.error('최근 본 공연 조회 실패:', err);
        setRecentPerformance(null);
        setSimilarPerformances([]);
      }
    };

    loadRecentAndSimilar();
  }, [isLoggedIn, isNewUser, isCheckingUser]);

  // 로그인하지 않은 사용자 또는 새 사용자: 인기 공연 추천 조회
  useEffect(() => {
    if (isLoggedIn && !isNewUser && !isCheckingUser) return;
    
    const loadPopularRecommendations = async () => {
      try {
        setPopularPerformancesLoading(true);
        const response = await getPopularRecommendations({ size: 10 });
        const normalized = normalizeRecommendation(response);
        setPopularPerformances(normalized.recommendations || []);
      } catch (err) {
        console.error('인기 공연 추천 조회 실패:', err);
        setPopularPerformances([]);
      } finally {
        setPopularPerformancesLoading(false);
      }
    };

    loadPopularRecommendations();
  }, [isLoggedIn, isNewUser, isCheckingUser]);

  // 로그인하지 않은 사용자 또는 새 사용자: 장르 랜덤 선택 및 장르별 추천 조회
  useEffect(() => {
    if (isLoggedIn && !isNewUser && !isCheckingUser) return;
    
    const genres = ['뮤지컬', '연극', '대중음악', '서양음악(클래식)', '한국음악(국악)'];
    
    // 랜덤으로 3개 장르 선택
    const shuffle = [...genres].sort(() => Math.random() - 0.5);
    const selected = shuffle.slice(0, 3);
    setSelectedGenres(selected);
    
    // 각 장르별로 슬라이더 상태 초기화
    selected.forEach((genre) => {
      initializeGenreSliderState(genre);
    });
    
    // 각 장르별로 추천 조회
    selected.forEach((genre) => {
      const loadGenreRecommendations = async () => {
        try {
          setGenreRecommendationsLoading((prev) => ({ ...prev, [genre]: true }));
          const response = await getGenreRecommendations({ genre, size: 10 });
          const normalized = normalizeRecommendation(response);
          setGenreRecommendations((prev) => ({
            ...prev,
            [genre]: normalized.recommendations || []
          }));
        } catch (err) {
          console.error(`${genre} 장르 추천 조회 실패:`, err);
          setGenreRecommendations((prev) => ({
            ...prev,
            [genre]: []
          }));
        } finally {
          setGenreRecommendationsLoading((prev) => ({ ...prev, [genre]: false }));
        }
      };
      
      loadGenreRecommendations();
    });
  }, [isLoggedIn, isNewUser, isCheckingUser]);

  // 이미지 URL 처리 헬퍼 함수
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    if (imageUrl.startsWith('/')) {
      return `${API_BASE_URL}${imageUrl}`;
    }
    return imageUrl;
  };

  // 날짜 포맷팅 함수
  const formatDateRange = (startDate, endDate) => {
    if (!startDate && !endDate) return '';
    if (!endDate) return startDate;
    return `${startDate} ~ ${endDate}`;
  };

  // 개인 맞춤 추천 슬라이드 이동 함수
  const goToUserRecSlide = (index) => {
    if (userRecommendations.length === 0) return;
    
    setUserRecIsTransitioning(true);
    let targetIndex = index;
    
    if (index < 0) {
      targetIndex = userRecommendations.length - 1;
    } else if (index >= userRecommendations.length) {
      targetIndex = 0;
    }
    
    const seriesLength = userRecommendations.length;
    let newDisplayIndex = userRecDisplayIndex;
    const direction = index - userRecCurrentIndex;
    
    if (direction < 0) {
      newDisplayIndex = userRecDisplayIndex - 1;
    } else if (direction > 0) {
      newDisplayIndex = userRecDisplayIndex + 1;
    }
    
    const maxIndex = seriesLength * 5 - 1;
    const minIndex = 0;
    
    if (newDisplayIndex < minIndex) {
      newDisplayIndex = maxIndex;
    } else if (newDisplayIndex > maxIndex) {
      newDisplayIndex = minIndex;
    }
    
    setUserRecDisplayIndex(newDisplayIndex);
    setUserRecCurrentIndex(targetIndex);
  };

  // 유사 공연 슬라이드 이동 함수
  const goToSimilarSlide = (index) => {
    if (similarPerformances.length === 0) return;
    
    setSimilarIsTransitioning(true);
    let targetIndex = index;
    
    if (index < 0) {
      targetIndex = similarPerformances.length - 1;
    } else if (index >= similarPerformances.length) {
      targetIndex = 0;
    }
    
    const seriesLength = similarPerformances.length;
    let newDisplayIndex = similarDisplayIndex;
    const direction = index - similarCurrentIndex;
    
    if (direction < 0) {
      newDisplayIndex = similarDisplayIndex - 1;
    } else if (direction > 0) {
      newDisplayIndex = similarDisplayIndex + 1;
    }
    
    const maxIndex = seriesLength * 5 - 1;
    const minIndex = 0;
    
    if (newDisplayIndex < minIndex) {
      newDisplayIndex = maxIndex;
    } else if (newDisplayIndex > maxIndex) {
      newDisplayIndex = minIndex;
    }
    
    setSimilarDisplayIndex(newDisplayIndex);
    setSimilarCurrentIndex(targetIndex);
  };

  // 인기 공연 슬라이드 이동 함수
  const goToPopularSlide = (index) => {
    if (popularPerformances.length === 0) return;
    
    setPopularIsTransitioning(true);
    let targetIndex = index;
    
    if (index < 0) {
      targetIndex = popularPerformances.length - 1;
    } else if (index >= popularPerformances.length) {
      targetIndex = 0;
    }
    
    const seriesLength = popularPerformances.length;
    let newDisplayIndex = popularDisplayIndex;
    const direction = index - popularCurrentIndex;
    
    if (direction < 0) {
      newDisplayIndex = popularDisplayIndex - 1;
    } else if (direction > 0) {
      newDisplayIndex = popularDisplayIndex + 1;
    }
    
    const maxIndex = seriesLength * 5 - 1;
    const minIndex = 0;
    
    if (newDisplayIndex < minIndex) {
      newDisplayIndex = maxIndex;
    } else if (newDisplayIndex > maxIndex) {
      newDisplayIndex = minIndex;
    }
    
    setPopularDisplayIndex(newDisplayIndex);
    setPopularCurrentIndex(targetIndex);
  };

  // 장르별 슬라이드 이동 함수
  const goToGenreSlide = (genre, index) => {
    const performances = genreRecommendations[genre] || [];
    if (performances.length === 0) return;
    
    const currentState = genreSliderStates[genre] || { currentIndex: 0, displayIndex: 0 };
    
    setGenreSliderStates((prev) => ({
      ...prev,
      [genre]: {
        ...prev[genre],
        isTransitioning: true
      }
    }));
    
    let targetIndex = index;
    
    if (index < 0) {
      targetIndex = performances.length - 1;
    } else if (index >= performances.length) {
      targetIndex = 0;
    }
    
    const seriesLength = performances.length;
    let newDisplayIndex = currentState.displayIndex;
    const direction = index - currentState.currentIndex;
    
    if (direction < 0) {
      newDisplayIndex = currentState.displayIndex - 1;
    } else if (direction > 0) {
      newDisplayIndex = currentState.displayIndex + 1;
    }
    
    const maxIndex = seriesLength * 5 - 1;
    const minIndex = 0;
    
    if (newDisplayIndex < minIndex) {
      newDisplayIndex = maxIndex;
    } else if (newDisplayIndex > maxIndex) {
      newDisplayIndex = minIndex;
    }
    
    setGenreSliderStates((prev) => ({
      ...prev,
      [genre]: {
        ...prev[genre],
        currentIndex: targetIndex,
        displayIndex: newDisplayIndex
      }
    }));
  };

  // 기존 슬라이드 이동 함수 (기존 하드코딩 데이터용)
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

  // 개인 맞춤 추천 터치/드래그 이벤트 핸들러
  const handleUserRecStart = (e) => {
    setUserRecIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setUserRecStartX(clientX);
  };

  const handleUserRecMove = (e) => {
    if (!userRecIsDragging) return;
    e.preventDefault();
  };

  const handleUserRecEnd = (e) => {
    if (!userRecIsDragging) return;
    setUserRecIsDragging(false);
    
    const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const diffX = userRecStartX - clientX;
    
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        goToUserRecSlide(userRecCurrentIndex + 1);
      } else {
        goToUserRecSlide(userRecCurrentIndex - 1);
      }
    }
  };

  // 유사 공연 터치/드래그 이벤트 핸들러
  const handleSimilarStart = (e) => {
    setSimilarIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setSimilarStartX(clientX);
  };

  const handleSimilarMove = (e) => {
    if (!similarIsDragging) return;
    e.preventDefault();
  };

  const handleSimilarEnd = (e) => {
    if (!similarIsDragging) return;
    setSimilarIsDragging(false);
    
    const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const diffX = similarStartX - clientX;
    
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        goToSimilarSlide(similarCurrentIndex + 1);
      } else {
        goToSimilarSlide(similarCurrentIndex - 1);
      }
    }
  };

  // 인기 공연 터치/드래그 이벤트 핸들러
  const handlePopularStart = (e) => {
    setPopularIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setPopularStartX(clientX);
  };

  const handlePopularMove = (e) => {
    if (!popularIsDragging) return;
    e.preventDefault();
  };

  const handlePopularEnd = (e) => {
    if (!popularIsDragging) return;
    setPopularIsDragging(false);
    
    const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const diffX = popularStartX - clientX;
    
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        goToPopularSlide(popularCurrentIndex + 1);
      } else {
        goToPopularSlide(popularCurrentIndex - 1);
      }
    }
  };

  // 장르별 터치/드래그 이벤트 핸들러
  const handleGenreStart = (genre) => (e) => {
    setGenreSliderStates((prev) => ({
      ...prev,
      [genre]: {
        ...prev[genre],
        isDragging: true,
        startX: e.touches ? e.touches[0].clientX : e.clientX
      }
    }));
  };

  const handleGenreMove = (genre) => (e) => {
    const state = genreSliderStates[genre];
    if (!state?.isDragging) return;
    e.preventDefault();
  };

  const handleGenreEnd = (genre) => (e) => {
    const state = genreSliderStates[genre];
    if (!state?.isDragging) return;
    
    const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const diffX = state.startX - clientX;
    
    setGenreSliderStates((prev) => ({
      ...prev,
      [genre]: {
        ...prev[genre],
        isDragging: false
      }
    }));
    
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        goToGenreSlide(genre, state.currentIndex + 1);
      } else {
        goToGenreSlide(genre, state.currentIndex - 1);
      }
    }
  };

  // 기존 터치/드래그 이벤트 핸들러 (기존 하드코딩 데이터용)
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
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(currentIndex - 1);
      }
    }
  };

  // 공연시그널로 이동
  const handleTestClick = () => {
    navigate('/recommend/signal');
  };

  return (
    <div className={styles.container}>
      {/* 상단 헤더 */}
      <div className={styles.header}>
        <div></div>
        <div className={styles.headerButtons}>
          <button 
            className={styles.ticketButton}
            onClick={() => navigate('/my/tickets')}
          >
            MY 티켓
          </button>
        </div>
      </div>

      {/* 사용자 확인 중 로딩 */}
      {isCheckingUser ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          추천 공연을 준비하는 중...
        </div>
      ) : (
        <>
      {/* 로그인한 사용자: 내 키워드 섹션 (기존 사용자만) */}
      {isLoggedIn && !isNewUser && myKeywords.length > 0 && (
        <section className={styles.myKeywordsSection}>
          <h2 className={styles.sectionTitle}>내 키워드</h2>
          <div className={styles.keywordsContainer}>
            {myKeywords.map((keyword, index) => (
              <div 
                key={index} 
                className={styles.keywordTag}
                onClick={() => navigate(`/recommend/keyword?keyword=${encodeURIComponent(keyword)}`)}
              >
                #{keyword}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 로그인한 사용자: 개인 맞춤 추천 공연 섹션 (기존 사용자만) */}
      {isLoggedIn && !isNewUser && !isCheckingUser && (
        <section className={styles.seriesSection}>
          <h2 className={styles.sectionTitle}>추천하는 공연</h2>
          {userRecommendationsLoading ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>추천 공연을 불러오는 중...</div>
          ) : userRecommendations.length > 0 ? (
          <>
            <div 
              className={styles.sliderContainer}
              ref={userRecSliderRef}
              onTouchStart={handleUserRecStart}
              onTouchMove={handleUserRecMove}
              onTouchEnd={handleUserRecEnd}
              onMouseDown={handleUserRecStart}
              onMouseMove={handleUserRecMove}
              onMouseUp={handleUserRecEnd}
              onMouseLeave={handleUserRecEnd}
            >
              <div 
                className={styles.sliderTrack}
                style={{ 
                  transform: `translateX(-${userRecDisplayIndex * (100 / 2.5)}%)`,
                  transition: userRecIsTransitioning ? 'transform 0.3s ease' : 'none'
                }}
                onTransitionEnd={() => {
                  const seriesLength = userRecommendations.length;
                  const totalSlides = seriesLength * 5;
                  
                  if (userRecDisplayIndex < seriesLength) {
                    setUserRecIsTransitioning(false);
                    setUserRecDisplayIndex(seriesLength * 2 + userRecCurrentIndex);
                  } else if (userRecDisplayIndex >= seriesLength * 4) {
                    setUserRecIsTransitioning(false);
                    setUserRecDisplayIndex(seriesLength * 2 + userRecCurrentIndex);
                  }
                }}
              >
                {(() => {
                  const infiniteSlides = [
                    ...userRecommendations,
                    ...userRecommendations,
                    ...userRecommendations,
                    ...userRecommendations,
                    ...userRecommendations
                  ];
                  
                  return infiniteSlides.map((performance, index) => {
                    const imageUrl = getImageUrl(performance.poster || performance.image);
                    const dateStr = formatDateRange(performance.startDate, performance.endDate);
                    
                    return (
                      <div key={`${performance.id || performance.performanceId}-${index}`} className={styles.slideCard}>
                        <PerformanceCard
                          id={performance.id || performance.performanceId}
                          title={performance.title}
                          image={imageUrl || 'wicked'}
                          rating={parseFloat(performance.rating || 0).toFixed(1)}
                          reviewCount={performance.reviewCount || 0}
                          date={dateStr}
                          keywords={performance.keywords || []}
                          variant="default"
                        />
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
            
            {/* 슬라이드 인디케이터 */}
            <div className={styles.sliderIndicators}>
              {userRecommendations.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.indicator} ${userRecCurrentIndex === index ? styles.active : ''}`}
                  onClick={() => goToUserRecSlide(index)}
                  aria-label={`슬라이드 ${index + 1}`}
                />
              ))}
            </div>

            {/* 좌우 화살표 버튼 */}
            <button
              className={styles.prevButton}
              onClick={() => goToUserRecSlide(userRecCurrentIndex - 1)}
              aria-label="이전 슬라이드"
            >
              ‹
            </button>
            <button
              className={styles.nextButton}
              onClick={() => goToUserRecSlide(userRecCurrentIndex + 1)}
              aria-label="다음 슬라이드"
            >
              ›
            </button>
          </>
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            추천할 공연이 없습니다.
          </div>
        )}
        </section>
      )}

      {/* 로그인한 사용자: 최근 본 공연과 유사한 공연 섹션 (기존 사용자만) */}
      {isLoggedIn && !isNewUser && !isCheckingUser && recentPerformance && (
        <section className={styles.seriesSection}>
          <h2 className={styles.sectionTitle}>
            {recentPerformance.title ? `'${recentPerformance.title}'과 비슷한 공연은` : '최근 본 공연과 비슷한 공연은'}
          </h2>
          {similarPerformancesLoading ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>유사 공연을 불러오는 중...</div>
          ) : similarPerformances.length > 0 ? (
            <>
              <div 
                className={styles.sliderContainer}
                ref={similarSliderRef}
                onTouchStart={handleSimilarStart}
                onTouchMove={handleSimilarMove}
                onTouchEnd={handleSimilarEnd}
                onMouseDown={handleSimilarStart}
                onMouseMove={handleSimilarMove}
                onMouseUp={handleSimilarEnd}
                onMouseLeave={handleSimilarEnd}
              >
                <div 
                  className={styles.sliderTrack}
                  style={{ 
                    transform: `translateX(-${similarDisplayIndex * (100 / 2.5)}%)`,
                    transition: similarIsTransitioning ? 'transform 0.3s ease' : 'none'
                  }}
                  onTransitionEnd={() => {
                    const seriesLength = similarPerformances.length;
                    const totalSlides = seriesLength * 5;
                    
                    if (similarDisplayIndex < seriesLength) {
                      setSimilarIsTransitioning(false);
                      setSimilarDisplayIndex(seriesLength * 2 + similarCurrentIndex);
                    } else if (similarDisplayIndex >= seriesLength * 4) {
                      setSimilarIsTransitioning(false);
                      setSimilarDisplayIndex(seriesLength * 2 + similarCurrentIndex);
                    }
                  }}
                >
                  {(() => {
                    const infiniteSlides = [
                      ...similarPerformances,
                      ...similarPerformances,
                      ...similarPerformances,
                      ...similarPerformances,
                      ...similarPerformances
                    ];
                    
                    return infiniteSlides.map((performance, index) => {
                      const imageUrl = getImageUrl(performance.poster || performance.image);
                      const dateStr = formatDateRange(performance.startDate, performance.endDate);
                      
                      return (
                        <div key={`${performance.id || performance.performanceId}-${index}`} className={styles.slideCard}>
                          <PerformanceCard
                            id={performance.id || performance.performanceId}
                            title={performance.title}
                            image={imageUrl || performance.poster || performance.image || 'wicked'}
                            rating={parseFloat(performance.rating || 0).toFixed(1)}
                            reviewCount={performance.reviewCount || 0}
                            date={dateStr}
                            keywords={performance.keywords || []}
                            variant="default"
                          />
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
              
              {/* 슬라이드 인디케이터 */}
              <div className={styles.sliderIndicators}>
                {similarPerformances.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.indicator} ${similarCurrentIndex === index ? styles.active : ''}`}
                    onClick={() => goToSimilarSlide(index)}
                    aria-label={`슬라이드 ${index + 1}`}
                  />
                ))}
              </div>

              {/* 좌우 화살표 버튼 */}
              <button
                className={styles.prevButton}
                onClick={() => goToSimilarSlide(similarCurrentIndex - 1)}
                aria-label="이전 슬라이드"
              >
                ‹
              </button>
              <button
                className={styles.nextButton}
                onClick={() => goToSimilarSlide(similarCurrentIndex + 1)}
                aria-label="다음 슬라이드"
              >
                ›
              </button>
            </>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              유사한 공연이 없습니다.
            </div>
          )}
        </section>
      )}

      {/* 로그인하지 않은 사용자 또는 새 사용자: 인기 공연 추천 섹션 */}
      {(!isLoggedIn || (isLoggedIn && isNewUser && !isCheckingUser)) && (
        <section className={styles.seriesSection}>
          <h2 className={styles.sectionTitle}>인기 공연</h2>
          {popularPerformancesLoading ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>인기 공연을 불러오는 중...</div>
          ) : popularPerformances.length > 0 ? (
            <>
              <div 
                className={styles.sliderContainer}
                ref={popularSliderRef}
                onTouchStart={handlePopularStart}
                onTouchMove={handlePopularMove}
                onTouchEnd={handlePopularEnd}
                onMouseDown={handlePopularStart}
                onMouseMove={handlePopularMove}
                onMouseUp={handlePopularEnd}
                onMouseLeave={handlePopularEnd}
              >
                <div 
                  className={styles.sliderTrack}
                  style={{ 
                    transform: `translateX(-${popularDisplayIndex * (100 / 2.5)}%)`,
                    transition: popularIsTransitioning ? 'transform 0.3s ease' : 'none'
                  }}
                  onTransitionEnd={() => {
                    const seriesLength = popularPerformances.length;
                    
                    if (popularDisplayIndex < seriesLength) {
                      setPopularIsTransitioning(false);
                      setPopularDisplayIndex(seriesLength * 2 + popularCurrentIndex);
                    } else if (popularDisplayIndex >= seriesLength * 4) {
                      setPopularIsTransitioning(false);
                      setPopularDisplayIndex(seriesLength * 2 + popularCurrentIndex);
                    }
                  }}
                >
                  {(() => {
                    const infiniteSlides = [
                      ...popularPerformances,
                      ...popularPerformances,
                      ...popularPerformances,
                      ...popularPerformances,
                      ...popularPerformances
                    ];
                    
                    return infiniteSlides.map((performance, index) => {
                      const imageUrl = getImageUrl(performance.poster || performance.image);
                      const dateStr = formatDateRange(performance.startDate, performance.endDate);
                      
                      return (
                        <div key={`${performance.id || performance.performanceId}-${index}`} className={styles.slideCard}>
                          <PerformanceCard
                            id={performance.id || performance.performanceId}
                            title={performance.title}
                            image={imageUrl || performance.poster || performance.image || 'wicked'}
                            rating={parseFloat(performance.rating || 0).toFixed(1)}
                            reviewCount={performance.reviewCount || 0}
                            date={dateStr}
                            keywords={performance.keywords || []}
                            variant="default"
                          />
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
              
              {/* 슬라이드 인디케이터 */}
              <div className={styles.sliderIndicators}>
                {popularPerformances.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.indicator} ${popularCurrentIndex === index ? styles.active : ''}`}
                    onClick={() => goToPopularSlide(index)}
                    aria-label={`슬라이드 ${index + 1}`}
                  />
                ))}
              </div>

              {/* 좌우 화살표 버튼 */}
              <button
                className={styles.prevButton}
                onClick={() => goToPopularSlide(popularCurrentIndex - 1)}
                aria-label="이전 슬라이드"
              >
                ‹
              </button>
              <button
                className={styles.nextButton}
                onClick={() => goToPopularSlide(popularCurrentIndex + 1)}
                aria-label="다음 슬라이드"
              >
                ›
              </button>
            </>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              인기 공연이 없습니다.
            </div>
          )}
        </section>
      )}

      {/* 로그인하지 않은 사용자 또는 새 사용자: 장르별 추천 섹션 */}
      {(!isLoggedIn || (isLoggedIn && isNewUser && !isCheckingUser)) && selectedGenres.map((genre) => {
        const performances = genreRecommendations[genre] || [];
        const loading = genreRecommendationsLoading[genre] || false;
        const state = genreSliderStates[genre] || { currentIndex: 0, displayIndex: 0, isTransitioning: true };
        
        return (
          <section key={genre} className={styles.seriesSection}>
            <h2 className={styles.sectionTitle}>{genre} 인기 공연</h2>
            {loading ? (
              <div style={{ padding: '20px', textAlign: 'center' }}>{genre} 공연을 불러오는 중...</div>
            ) : performances.length > 0 ? (
              <>
                <div 
                  className={styles.sliderContainer}
                  onTouchStart={handleGenreStart(genre)}
                  onTouchMove={handleGenreMove(genre)}
                  onTouchEnd={handleGenreEnd(genre)}
                  onMouseDown={handleGenreStart(genre)}
                  onMouseMove={handleGenreMove(genre)}
                  onMouseUp={handleGenreEnd(genre)}
                  onMouseLeave={handleGenreEnd(genre)}
                >
                  <div 
                    className={styles.sliderTrack}
                    style={{ 
                      transform: `translateX(-${state.displayIndex * (100 / 2.5)}%)`,
                      transition: state.isTransitioning ? 'transform 0.3s ease' : 'none'
                    }}
                    onTransitionEnd={() => {
                      const seriesLength = performances.length;
                      const currentState = genreSliderStates[genre] || { currentIndex: 0, displayIndex: 0 };
                      
                      if (currentState.displayIndex < seriesLength) {
                        setGenreSliderStates((prev) => ({
                          ...prev,
                          [genre]: {
                            ...prev[genre],
                            isTransitioning: false,
                            displayIndex: seriesLength * 2 + currentState.currentIndex
                          }
                        }));
                      } else if (currentState.displayIndex >= seriesLength * 4) {
                        setGenreSliderStates((prev) => ({
                          ...prev,
                          [genre]: {
                            ...prev[genre],
                            isTransitioning: false,
                            displayIndex: seriesLength * 2 + currentState.currentIndex
                          }
                        }));
                      }
                    }}
                  >
                    {(() => {
                      const infiniteSlides = [
                        ...performances,
                        ...performances,
                        ...performances,
                        ...performances,
                        ...performances
                      ];
                      
                      return infiniteSlides.map((performance, index) => {
                        const imageUrl = getImageUrl(performance.poster || performance.image);
                        const dateStr = formatDateRange(performance.startDate, performance.endDate);
                        
                        return (
                          <div key={`${performance.id || performance.performanceId}-${index}`} className={styles.slideCard}>
                            <PerformanceCard
                              id={performance.id || performance.performanceId}
                              title={performance.title}
                              image={imageUrl || performance.poster || performance.image || 'wicked'}
                              rating={performance.rating || 0}
                              reviewCount={performance.reviewCount || 0}
                              date={dateStr}
                              keywords={performance.keywords || []}
                              variant="default"
                            />
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
                
                {/* 슬라이드 인디케이터 */}
                <div className={styles.sliderIndicators}>
                  {performances.map((_, index) => (
                    <button
                      key={index}
                      className={`${styles.indicator} ${state.currentIndex === index ? styles.active : ''}`}
                      onClick={() => goToGenreSlide(genre, index)}
                      aria-label={`슬라이드 ${index + 1}`}
                    />
                  ))}
                </div>

                {/* 좌우 화살표 버튼 */}
                <button
                  className={styles.prevButton}
                  onClick={() => goToGenreSlide(genre, state.currentIndex - 1)}
                  aria-label="이전 슬라이드"
                >
                  ‹
                </button>
                <button
                  className={styles.nextButton}
                  onClick={() => goToGenreSlide(genre, state.currentIndex + 1)}
                  aria-label="다음 슬라이드"
                >
                  ›
                </button>
              </>
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                {genre} 공연이 없습니다.
              </div>
            )}
          </section>
        );
      })}

      {/* 기존 추천 영화 시리즈 슬라이드 섹션 (필요시 제거 가능) */}
      <section className={styles.seriesSection} style={{ display: 'none' }}>
        <h2 className={styles.sectionTitle}>추천하는 공연 (기존)</h2>
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
        </>
      )}

    </div>
  );
};

export default MainRecommandPage;
