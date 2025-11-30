import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PerformanceCard from '../../components/culture/PerformanceCard';
import DiscountPromotionSection from '../../components/common/DiscountPromotionSection';
import { fetchMainBanners } from '../../api/bannerApi';
import { normalizeMainBannerList } from '../../services/normalizeBanner';
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
  const [banners, setBanners] = useState([]);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [selectedContentIndex, setSelectedContentIndex] = useState(0);
  const [hoveredContentIndex, setHoveredContentIndex] = useState(null);
  const [contentBannerHeight, setContentBannerHeight] = useState('auto');
  const [displayedContentIndex, setDisplayedContentIndex] = useState(0);
  const [borderDisplayedIndex, setBorderDisplayedIndex] = useState(0);
  const contentBannerSectionRef = useRef(null);

  // 배너 데이터 로드
  useEffect(() => {
    const loadBanners = async () => {
      try {
        setLoadingBanners(true);
        const data = await fetchMainBanners();
        const normalized = normalizeMainBannerList(data);
        setBanners(normalized);
      } catch (err) {
        console.error("메인 배너 조회 실패:", err);
        // 에러 시 빈 배열로 설정
        setBanners([]);
      } finally {
        setLoadingBanners(false);
      }
    };

    loadBanners();
  }, []);

  // 배너 클릭 핸들러
  const handleBannerClick = (banner) => {
    if (banner.linkUrl) {
      // 외부 링크가 있으면 새 창에서 열기
      window.open(banner.linkUrl, '_blank');
    } else if (banner.performanceId) {
      // 공연 ID가 있으면 공연 상세 페이지로 이동
      navigate(`/culture/${banner.performanceId}`);
    }
    // 둘 다 없으면 클릭 비활성
  };

  // 기존 하드코딩된 performances (배너가 없을 때 fallback)
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

  // 배너 또는 performances 중 사용할 데이터
  const slideData = banners.length > 0 ? banners : performances;

  // 자동 슬라이드 기능
  useEffect(() => {
    if (slideData.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => 
        prevSlide === slideData.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000); // 5초마다 자동 슬라이드

    return () => clearInterval(interval);
  }, [slideData.length]);

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
    const slideIndex = Math.round(slideRatio * slideData.length);
    return Math.max(0, Math.min(slideData.length - 1, slideIndex));
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
  }, [isDraggingIndicator, indicatorContainerRef, slideData.length]);

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
    },
    {
      id: 3,
      title: "WICKED",
      subtitle: "뮤지컬 위키드",
      genre: "뮤지컬",
      description: "The untold true story of the Witches of Oz",
      rating: 4.6,
      reviewCount: 210,
      image: "wicked"
    },
    {
      id: 4,
      title: "물랑루즈!",
      subtitle: "MOULIN ROUGE!",
      genre: "뮤지컬",
      description: "TRUTH BEAUTY FREEDOM LOVE",
      rating: 4.7,
      reviewCount: 189,
      image: "moulin-rouge"
    },
    {
      id: 5,
      title: "킹키부츠",
      subtitle: "KINKY BOOTS",
      genre: "뮤지컬",
      description: "HARVEY FIERSTEIN, CYNDI LAUPER, JERRY MITCHELL",
      rating: 4.8,
      reviewCount: 156,
      image: "kinky-boots"
    },
    {
      id: 6,
      title: "한복입은남자",
      subtitle: "The Man in Hanbok",
      genre: "창작뮤지컬",
      description: "장영실, 다빈치를 만나다",
      rating: 4.5,
      reviewCount: 98,
      image: "hanbok-man"
    },
    {
      id: 7,
      title: "햄릿",
      subtitle: "HAMLET",
      genre: "연극",
      description: "셰익스피어의 불멸의 명작",
      rating: 4.3,
      reviewCount: 145,
      image: "wicked" // 임시로 wicked 이미지 사용
    }
  ];

  // Featured Performances 캐러셀 상태
  const [featuredCurrentIndex, setFeaturedCurrentIndex] = useState(0);
  const [prevSlotIndices, setPrevSlotIndices] = useState(() => {
    // 초기 슬롯 인덱스 설정
    if (featuredPerformances.length === 0) return [0, 1, 2, 3, 4];
    const getCircularIndex = (index) => {
      const length = featuredPerformances.length;
      return ((index % length) + length) % length;
    };
    return [
      getCircularIndex(0 - 2),
      getCircularIndex(0 - 1),
      0,
      getCircularIndex(0 + 1),
      getCircularIndex(0 + 2)
    ];
  }); // 이전 슬롯 인덱스 추적
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const featuredCarouselRef = useRef(null);


  // 무한 루프를 위한 인덱스 계산 함수
  const getCircularIndex = (index) => {
    const length = featuredPerformances.length;
    if (length === 0) return 0;
    return ((index % length) + length) % length;
  };

  // 5개 슬롯에 표시할 배너 인덱스 계산
  const getSlotIndices = () => {
    return [
      getCircularIndex(featuredCurrentIndex - 2), // 전전 (왼쪽에서 두 번째)
      getCircularIndex(featuredCurrentIndex - 1), // 전 (왼쪽 첫 번째)
      featuredCurrentIndex,                        // 중앙
      getCircularIndex(featuredCurrentIndex + 1), // 후 (오른쪽 첫 번째)
      getCircularIndex(featuredCurrentIndex + 2)  // 후후 (오른쪽 두 번째)
    ];
  };

  // Featured Performances 슬라이드 이동 함수
  const goToFeaturedSlide = (index) => {
    if (featuredPerformances.length === 0) return;
    
    // 현재 슬롯 인덱스 저장 (이전 값으로)
    const currentSlots = getSlotIndices();
    setPrevSlotIndices(currentSlots);
    
    // 경계 처리 (무한 루프)
    const length = featuredPerformances.length;
    const targetIndex = ((index % length) + length) % length;
    
    setFeaturedCurrentIndex(targetIndex);
  };

  // 배너의 이전 슬롯 위치 찾기
  const getPrevSlotIndex = (performanceIndex) => {
    return prevSlotIndices.findIndex(idx => idx === performanceIndex);
  };

  // 포스터 이미지 매핑
  const posterImages = {
    'wicked': wickedPoster,
    'moulin-rouge': moulinRougePoster,
    'kinky-boots': kinkyBootsPoster,
    'hanbok-man': hanbokManPoster,
    'death-note': deathNotePoster,
    'rent': rentPoster
  };

  // 컨텐츠 배너 데이터 (더미 데이터)
  const contentBannerItems = [
    {
      id: 1,
      title: "블핑 지수, 우월한 미모 감탄",
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23333'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-size='12'%3EJisoo%3C/text%3E%3C/svg%3E",
      content: "블랙핑크 지수의 우월한 미모에 감탄하는 팬들의 반응이 이어지고 있습니다.",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150'%3E%3Crect width='200' height='150' fill='%23666'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white'%3EImage1%3C/text%3E%3C/svg%3E"
    },
    {
      id: 2,
      title: "이미주 갸루 화장 변신 화제",
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23333'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-size='12'%3EMiJoo%3C/text%3E%3C/svg%3E",
      content: "이미주, 난리났다...\"예쁘다고 느낀 갸루 처음\".\"평소보다 예뻐\" 韓★... 11시간 전",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150'%3E%3Crect width='200' height='150' fill='%23666'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white'%3EImage2%3C/text%3E%3C/svg%3E",
      isNew: true
    },
    {
      id: 3,
      title: "손준호 김소현 사랑의 대화 우승",
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23333'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-size='12'%3ETalk%3C/text%3E%3C/svg%3E",
      content: "손준호와 김소현이 사랑의 대화에서 우승을 차지했습니다.",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150'%3E%3Crect width='200' height='150' fill='%23666'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white'%3EImage3%3C/text%3E%3C/svg%3E",
      isNew: true
    },
    {
      id: 4,
      title: "차은우·김재환, 군복 깜찍 투샷",
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23333'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-size='12'%3ETwoShot%3C/text%3E%3C/svg%3E",
      content: "차은우와 김재환이 군복을 입고 찍은 깜찍한 투샷이 공개되었습니다.",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150'%3E%3Crect width='200' height='150' fill='%23666'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white'%3EImage4%3C/text%3E%3C/svg%3E"
    },
    {
      id: 5,
      title: "스트레이 키즈, 마마 첫 대상 감격",
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23333'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-size='12'%3ESKZ%3C/text%3E%3C/svg%3E",
      content: "스트레이 키즈가 MAMA에서 첫 대상을 수상하며 감격의 순간을 맞이했습니다.",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150'%3E%3Crect width='200' height='150' fill='%23666'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white'%3EImage5%3C/text%3E%3C/svg%3E"
    },
    {
      id: 6,
      title: "뉴진스, 신곡 발표 예고",
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23333'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-size='12'%3ENJ%3C/text%3E%3C/svg%3E",
      content: "뉴진스가 곧 신곡을 발표할 예정이라고 발표했습니다.",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150'%3E%3Crect width='200' height='150' fill='%23666'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white'%3EImage6%3C/text%3E%3C/svg%3E"
    }
  ];

  // 컨텐츠 배너 섹션 고정 높이 계산
  useEffect(() => {
    if (!contentBannerSectionRef.current) return;
    
    // 배너 개수
    const bannerCount = contentBannerItems.length;
    // 배너 1개 높이 (padding 12px * 2 + border 2px * 2 + 내용 약 36px)
    const bannerItemHeight = 60;
    // 배너 간격 (gap: 10px)
    const bannerGap = 10;
    // 드롭다운 최대 높이 (padding + 내용 + 이미지)
    const dropdownHeight = 120;
    // 헤더 높이 (제목 + margin)
    const headerHeight = 50;
    // 섹션 padding (상하 20px * 2)
    const sectionPadding = 40;
    // 여유 공간
    const extraSpace = 20;
    
    // 총 높이 계산: padding + header + (배너 높이 * 개수) + (간격 * (개수-1)) + 드롭다운 + 여유
    const totalHeight = sectionPadding + headerHeight + (bannerCount * bannerItemHeight) + (bannerGap * (bannerCount - 1)) + dropdownHeight + extraSpace;
    
    setContentBannerHeight(`${totalHeight}px`);
  }, [contentBannerItems.length]);

  // 드롭다운 순차 처리: 이전 것이 닫힌 후 새 것이 열리도록
  useEffect(() => {
    if (selectedContentIndex === displayedContentIndex) return;
    
    // 닫는 애니메이션 시간 (0.35s) 후에 새 인덱스로 변경
    const timer = setTimeout(() => {
      setDisplayedContentIndex(selectedContentIndex);
      // 드롭다운이 열린 후 테두리 표시 (약간의 delay)
      setTimeout(() => {
        setBorderDisplayedIndex(selectedContentIndex);
      }, 50); // 드롭다운이 조금 열린 후 테두리 표시
    }, 350); // transition 시간과 동일
    
    return () => clearTimeout(timer);
  }, [selectedContentIndex, displayedContentIndex]);

  // 컨텐츠 배너 자동 슬라이드
  useEffect(() => {
    if (hoveredContentIndex !== null) return; // hover 중이면 자동 슬라이드 중지
    
    const interval = setInterval(() => {
      setSelectedContentIndex((prev) => 
        prev === contentBannerItems.length - 1 ? 0 : prev + 1
      );
    }, 5000); // 5초마다 자동 슬라이드

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoveredContentIndex]);

  return (
    <div className={styles.container}>
      {/* Main Carousel Section */}
      {loadingBanners ? (
        <section className={styles.carouselSection}>
          <div className={styles.loading}>배너를 불러오는 중...</div>
        </section>
      ) : slideData.length > 0 ? (
        <section className={styles.carouselSection}>
          <div className={styles.carouselContainer}>
            <div 
              className={styles.carouselTrack} 
              style={{ 
                transform: `translateX(-${currentSlide * (100 / slideData.length)}%)`,
                width: `${slideData.length * 100}%`
              }}
            >
              {slideData.map((item, index) => {
                // 배너 데이터인지 기존 performance 데이터인지 확인
                const isBanner = banners.length > 0;
                
                if (isBanner) {
                  // 배너 데이터 사용
                  const banner = item;
                  const hasClickAction = banner.linkUrl || banner.performanceId;
                  
                  return (
                    <div 
                      key={banner.bannerId || index} 
                      className={styles.carouselSlide}
                      style={{ 
                        width: `${100 / slideData.length}%`,
                        cursor: hasClickAction ? 'pointer' : 'default'
                      }}
                      onClick={() => hasClickAction && handleBannerClick(banner)}
                    >
                      <div className={styles.slideLink}>
                        <div className={styles.poster}>
                          <img
                            className={styles.posterImg}
                            src={banner.imageUrl || wickedPoster}
                            alt={banner.titleText || '배너'}
                          />
                          <div className={styles.posterOverlay}></div>
                          <div className={styles.posterContent}>
                            {banner.titleText && (
                              <div className={styles.posterTagline}>{banner.titleText}</div>
                            )}
                            {banner.subtitleText && (
                              <div className={styles.posterTitle}>{banner.subtitleText}</div>
                            )}
                            {banner.descriptionText && (
                              <div className={styles.posterDescription}>{banner.descriptionText}</div>
                            )}
                            {banner.dateText && (
                              <div className={styles.posterDate}>{banner.dateText}</div>
                            )}
                            {banner.placeText && (
                              <div className={styles.posterVenue}>{banner.placeText}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  // 기존 performance 데이터 사용 (fallback)
                  const performance = item;
                  return (
                    <div 
                      key={performance.id} 
                      className={styles.carouselSlide}
                      style={{ width: `${100 / slideData.length}%` }}
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
                  );
                }
              })}
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
            {slideData.map((_, index) => (
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
      ) : null}

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


      {/* Content Banner Section */}
      <section 
        ref={contentBannerSectionRef}
        className={styles.contentBannerSection}
        style={{ height: contentBannerHeight }}
      >
        <div className={styles.contentBannerHeader}>
          <h2 className={styles.contentBannerTitle}>함께 보는 공연 숏텐츠</h2>
        </div>
        
        <div className={styles.contentBannerList}>
          {contentBannerItems.map((item, index) => {
            const isSelected = hoveredContentIndex === index || (hoveredContentIndex === null && selectedContentIndex === index);
            const isDisplayed = displayedContentIndex === index;
            // hover 시에는 즉시 테두리 표시, 자동 슬라이드 시에는 borderDisplayedIndex 사용
            const showBorder = hoveredContentIndex === index || (hoveredContentIndex === null && borderDisplayedIndex === index);
            
            return (
              <div key={item.id}>
                <div
                  className={`${styles.contentBannerItem} ${showBorder ? styles.selected : ''}`}
                  onMouseEnter={() => {
                    setHoveredContentIndex(index);
                    setSelectedContentIndex(index);
                    setDisplayedContentIndex(index); // hover 시 즉시 표시
                    setBorderDisplayedIndex(index); // hover 시 즉시 테두리 표시
                  }}
                  onMouseLeave={() => setHoveredContentIndex(null)}
                >
                  <div className={styles.contentBannerItemLeft}>
                    <div className={styles.contentBannerItemContent}>
                      <div className={styles.contentBannerItemTitle}>
                        {item.title}
                      </div>
                    </div>
                  </div>
                  {/* 선택 안된 항목만 title 옆에 썸네일 표시 */}
                  {!isDisplayed && (
                    <div className={styles.contentBannerItemRight}>
                      <img 
                        src={item.thumbnail} 
                        alt={item.title}
                        className={styles.contentBannerThumbnail}
                      />
                    </div>
                  )}
                </div>
                
                {/* 드롭다운 상세 내용 */}
                <div className={`${styles.contentBannerDetail} ${isDisplayed ? styles.show : ''}`}>
                  <div className={styles.contentBannerDetailContent}>
                    <div className={styles.contentBannerDetailText}>
                      {item.content}
                    </div>
                    <div className={styles.contentBannerDetailImage}>
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className={styles.contentBannerDetailImg}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* Featured Performances */}
      <section className={styles.featuredSection}>
        <h2 className={styles.featuredTitle}>추천 공연</h2>
        <div 
          className={styles.featuredCarouselContainer}
          ref={featuredCarouselRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={(e) => {
            // 화살표 버튼으로 이동하는 경우 호버 상태 유지
            const relatedTarget = e.relatedTarget;
            if (relatedTarget && (
              relatedTarget.closest(`.${styles.featuredPrevButton}`) ||
              relatedTarget.closest(`.${styles.featuredNextButton}`)
            )) {
              return;
            }
            setIsHovered(false);
            if (isDragging) {
              setIsDragging(false);
              setDragOffset(0);
            }
          }}
          onMouseDown={(e) => {
            setIsDragging(true);
            setDragStartX(e.clientX);
            setDragOffset(0);
          }}
          onMouseMove={(e) => {
            if (isDragging) {
              const diff = e.clientX - dragStartX;
              setDragOffset(diff);
            }
          }}
          onMouseUp={() => {
            if (isDragging) {
              const threshold = 50; // 슬라이드 임계값
              if (Math.abs(dragOffset) > threshold) {
                if (dragOffset > 0) {
                  goToFeaturedSlide(featuredCurrentIndex - 1);
                } else {
                  goToFeaturedSlide(featuredCurrentIndex + 1);
                }
              }
              setIsDragging(false);
              setDragOffset(0);
            }
          }}
          onTouchStart={(e) => {
            setIsDragging(true);
            setDragStartX(e.touches[0].clientX);
            setDragOffset(0);
          }}
          onTouchMove={(e) => {
            if (isDragging) {
              const diff = e.touches[0].clientX - dragStartX;
              setDragOffset(diff);
            }
          }}
          onTouchEnd={() => {
            if (isDragging) {
              const threshold = 50;
              if (Math.abs(dragOffset) > threshold) {
                if (dragOffset > 0) {
                  goToFeaturedSlide(featuredCurrentIndex - 1);
                } else {
                  goToFeaturedSlide(featuredCurrentIndex + 1);
                }
              }
              setIsDragging(false);
              setDragOffset(0);
            }
          }}
        >
          <div 
            className={styles.featuredCarouselTrack}
            style={{
              transform: `translateX(calc(50% - ${2 * (100 / 2.5)}% - ${100 / 2.5 / 2}% - ${2 * 16}px + ${isDragging && featuredCarouselRef.current ? dragOffset : 0}px))`,
              transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            {getSlotIndices().map((performanceIndex, slotIndex) => {
              const performance = featuredPerformances[performanceIndex];
              if (!performance) return null;
              
              const isCenter = slotIndex === 2; // 중앙 슬롯
              const distance = Math.abs(slotIndex - 2);
              
              return (
                <div
                  key={performance.id}
                  className={`${styles.featuredCarouselItem} ${isCenter ? styles.center : ''}`}
                  style={{
                    transform: isCenter ? 'scale(1.1)' : 'scale(0.85)',
                    opacity: distance > 1 ? 0.5 : (isCenter ? 1 : 0.8),
                    zIndex: isCenter ? 10 : 5 - distance,
                    transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <PerformanceCard
                    id={performance.id}
                    title={performance.title}
                    image={performance.image}
                    rating={performance.rating}
                    reviewCount={performance.reviewCount}
                    description={performance.description}
                    genre={performance.genre}
                    variant="featured"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* 좌우 화살표 버튼 */}
        {isHovered && (
          <>
            <button
              className={styles.featuredPrevButton}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={(e) => {
                // 배너 영역으로 다시 이동하는 경우 호버 상태 유지
                const relatedTarget = e.relatedTarget;
                if (relatedTarget && relatedTarget.closest(`.${styles.featuredCarouselContainer}`)) {
                  return;
                }
                setIsHovered(false);
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToFeaturedSlide(featuredCurrentIndex - 1);
              }}
              aria-label="이전 슬라이드"
            >
              ‹
            </button>
            <button
              className={styles.featuredNextButton}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={(e) => {
                // 배너 영역으로 다시 이동하는 경우 호버 상태 유지
                const relatedTarget = e.relatedTarget;
                if (relatedTarget && relatedTarget.closest(`.${styles.featuredCarouselContainer}`)) {
                  return;
                }
                setIsHovered(false);
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToFeaturedSlide(featuredCurrentIndex + 1);
              }}
              aria-label="다음 슬라이드"
            >
              ›
            </button>
          </>
        )}
        
        {/* 인디케이터 */}
        <div className={styles.featuredIndicators}>
          {featuredPerformances.map((_, index) => (
            <button
              key={index}
              className={`${styles.featuredIndicator} ${index === featuredCurrentIndex ? styles.active : ''}`}
              onClick={() => goToFeaturedSlide(index)}
              aria-label={`슬라이드 ${index + 1}`}
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
