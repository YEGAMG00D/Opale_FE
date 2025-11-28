import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './DetailPerformancePage.module.css';
import PerformancePoster from '../../components/culture/PerformancePoster';
import PerformanceInfoCard from '../../components/culture/PerformanceInfoCard';
import PerformanceTrailer from '../../components/culture/PerformanceTrailer';
import PerformanceDetails from '../../components/culture/PerformanceDetails';
import BookingLinks from '../../components/culture/BookingLinks';
import OpenChatSection from '../../components/culture/OpenChatSection';
import ReviewCard from '../../components/culture/ReviewCard';
import PerformanceInfoImages from '../../components/culture/PerformanceInfoImages';
import PlaceMap from '../../components/place/PlaceMap';
import { fetchPerformanceBasic, fetchPerformanceVideos } from '../../api/performanceApi';
import { fetchPerformanceReviewsByPerformance, fetchPerformanceReview, createPerformanceReview, updatePerformanceReview, deletePerformanceReview } from '../../api/reviewApi';
import { isPerformanceLiked, togglePerformanceFavorite, isPerformanceReviewLiked, togglePerformanceReviewFavorite } from '../../api/favoriteApi';
import { normalizePerformanceDetail } from '../../services/normalizePerformanceDetail';
import { normalizePerformanceReviews } from '../../services/normalizePerformanceReview';
import { normalizePerformanceReviewRequest } from '../../services/normalizePerformanceReviewRequest';
import { normalizePerformanceVideos } from '../../services/normalizePerformanceVideos';
import { usePerformanceRelations } from '../../hooks/usePerformanceRelations';
import { usePerformanceInfoImages } from '../../hooks/usePerformanceInfoImages';
import { usePerformanceBooking } from '../../hooks/usePerformanceBooking';
import { usePlaceBasic } from '../../hooks/usePlaceBasic';
import { getTicketsByPerformanceName, getWatchedTickets, addTicket } from '../../utils/ticketUtils';
import logApi from '../../api/logApi';
import TicketSelectModal from '../../components/common/TicketSelectModal';
import wickedPoster from '../../assets/poster/wicked.gif';
import moulinRougePoster from '../../assets/poster/moulin-rouge.gif';
import kinkyBootsPoster from '../../assets/poster/kinky-boots.gif';
import hanbokManPoster from '../../assets/poster/hanbok-man.jpg';
import deathNotePoster from '../../assets/poster/death-note.gif';
import rentPoster from '../../assets/poster/rent.gif';

const DetailPerformancePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useSelector((state) => state.user);
  const currentUserId = user?.userId || user?.id || null;
  const [activeTab, setActiveTab] = useState('detail');
  const [isFavorite, setIsFavorite] = useState(false);
  const [expandedExpectations, setExpandedExpectations] = useState({});
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [writeType, setWriteType] = useState('review'); // 'review' or 'expectation'
  const [writeForm, setWriteForm] = useState({ title: '', content: '', rating: 5 });
  const [activeReviewTab, setActiveReviewTab] = useState('review'); // 'review' or 'expectation'
  
  // 수정 모달 관련 상태
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', content: '', rating: 5 });
  const [showTicketInfoModal, setShowTicketInfoModal] = useState(false);
  const [ticketStep, setTicketStep] = useState('scan'); // 'scan' or 'input'
  const [ticketInfo, setTicketInfo] = useState({
    performanceDate: '',
    performanceTime: '',
    section: '',
    row: '',
    number: ''
  });
  const [isScanning, setIsScanning] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const ticketVideoRef = useRef(null);
  const ticketFileInputRef = useRef(null);
  
  // 티켓 선택 관련 상태
  const [showTicketSelectModal, setShowTicketSelectModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null); // 선택된 티켓 정보 { ticketId, performanceId }
  
  // API 데이터 상태
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 리뷰 데이터 상태
  const [reviews, setReviews] = useState([]);
  const [expectations, setExpectations] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);
  const [expectationLikes, setExpectationLikes] = useState({}); // 기대평 관심 상태

  // 영상 데이터 상태
  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(false);

  // 예매처 목록 조회
  const performanceId = performance?.id || performance?.performanceId || id;
  const { bookingSites } = usePerformanceRelations(performanceId);
  
  // 공연 소개 이미지 조회
  const { images: infoImages, loading: imagesLoading } = usePerformanceInfoImages(performanceId);
  
  // 공연 예매 정보 조회
  const { bookingInfo, loading: bookingLoading } = usePerformanceBooking(performanceId);
  
  // 공연장 정보 조회
  const placeId = performance?.placeId;
  const { placeInfo, loading: placeLoading } = usePlaceBasic(placeId);


  // 모든 공연 데이터
  const allPerformances = {
    1: {
      id: 1,
      category: "뮤지컬",
      title: "위키드",
      englishTitle: "WICKED",
      venue: "블루스퀘어 신한카드홀",
      address: "서울 용산구 이태원로 294",
      date: "2025.07.12. (토)~2025.10.26. (일)",
      duration: "170분 (인터미션 포함)",
      ageLimit: "8세 이상 관람가(2018년 포함 이전 출생자)",
      rating: 4.6,
      reviewCount: 210,
      hashtags: ["#13년 만의 내한 공연", "#글로벌 메가 히트 뮤지컬", "#오즈의 마법사 프리퀄"],
      genre: "판타지 환상적 드라마틱",
      description: "두 소녀 엘파바와 글린다가 오즈에서 만나 경쟁과 우정을 나누며, 세상에 알려지지 않은 마녀들의 진실을 드러내는 이야기",
      image: "wicked",
      trailerImage: "wicked",
      prices: [
        { seat: "VIP석", price: "190,000원" },
        { seat: "R석", price: "160,000원" },
        { seat: "S석", price: "130,000원" },
        { seat: "A석", price: "80,000원" }
      ]
    },
    2: {
      id: 2,
      category: "뮤지컬",
      title: "물랑루즈!",
      englishTitle: "MOULIN ROUGE!",
      venue: "BLUESQUARE 신한카드홀",
      address: "서울 용산구 이태원로 294",
      date: "2025.11.27~2026.02.22",
      duration: "150분 (인터미션 포함)",
      ageLimit: "12세 이상 관람가",
      rating: 4.7,
      reviewCount: 189,
      hashtags: ["#WINNER! 10 TONY AWARDS", "#BEST MUSICAL", "#세기의 러브스토리"],
      genre: "로맨스 뮤지컬 드라마",
      description: "파리의 몽마르트 언덕, 물랑루즈라는 사랑과 열정의 무대에서 펼쳐지는 감동적인 사랑 이야기",
      image: "moulin-rouge",
      trailerImage: "moulin-rouge",
      prices: [
        { seat: "VIP석", price: "180,000원" },
        { seat: "R석", price: "150,000원" },
        { seat: "S석", price: "120,000원" },
        { seat: "A석", price: "70,000원" }
      ]
    },
    3: {
      id: 3,
      category: "뮤지컬",
      title: "킹키부츠",
      englishTitle: "KINKY BOOTS",
      venue: "샤롯데씨어터",
      address: "서울 송파구 올림픽로 240",
      date: "2025.12.17 - 2026.03.29",
      duration: "165분 (인터미션 포함)",
      ageLimit: "8세 이상 관람가",
      rating: 4.8,
      reviewCount: 156,
      hashtags: ["#토니상 최우수 뮤지컬", "#감동 코미디", "#차별화의 미학"],
      genre: "코미디 뮤지컬 드라마",
      description: "구두 공장과 드래그 퀸의 만남을 통해 진정한 자기 자신을 찾아가는 따뜻하고 유쾌한 이야기",
      image: "kinky-boots",
      trailerImage: "kinky-boots",
      prices: [
        { seat: "VIP석", price: "170,000원" },
        { seat: "R석", price: "140,000원" },
        { seat: "S석", price: "110,000원" },
        { seat: "A석", price: "70,000원" }
      ]
    },
    4: {
      id: 4,
      category: "뮤지컬",
      title: "한복입은남자",
      englishTitle: "The Man in Hanbok",
      venue: "충무아트센터 대극장",
      address: "서울 중구 퇴계로 387",
      date: "2025.12.02~2026.03.08",
      duration: "140분 (인터미션 포함)",
      ageLimit: "7세 이상 관람가",
      rating: 4.5,
      reviewCount: 98,
      hashtags: ["#창작뮤지컬", "#장영실", "#과학과 예술의 만남"],
      genre: "역사 창작 드라마",
      description: "조선의 천재 과학자 장영실과 레오나르도 다 빈치가 만난다면? 상상력 넘치는 창작 뮤지컬",
      image: "hanbok-man",
      trailerImage: "hanbok-man",
      prices: [
        { seat: "VIP석", price: "150,000원" },
        { seat: "R석", price: "120,000원" },
        { seat: "S석", price: "90,000원" },
        { seat: "A석", price: "60,000원" }
      ]
    },
    5: {
      id: 5,
      category: "뮤지컬",
      title: "데스노트",
      englishTitle: "DEATH NOTE",
      venue: "디큐브 링크아트센터",
      address: "서울 강남구 영동대로 513",
      date: "2025.10.14 ~ 2026.05.10",
      duration: "160분 (인터미션 포함)",
      ageLimit: "13세 이상 관람가",
      rating: 4.4,
      reviewCount: 167,
      hashtags: ["#일본 최고 인기작", "#스릴러 뮤지컬", "#정의와 광기의 대결"],
      genre: "스릴러 판타지 드라마",
      description: "죽음의 노트를 손에 넣은 라이토와 세계 최고의 수사관 L의 숨 막히는 두뇌 게임",
      image: "death-note",
      trailerImage: "death-note",
      prices: [
        { seat: "VIP석", price: "180,000원" },
        { seat: "R석", price: "150,000원" },
        { seat: "S석", price: "120,000원" },
        { seat: "A석", price: "80,000원" }
      ]
    },
    6: {
      id: 6,
      category: "뮤지컬",
      title: "RENT",
      englishTitle: "RENT",
      venue: "coexartium",
      address: "서울 강남구 영동대로 513",
      date: "2025.11.09 ~ 2026.02.22",
      duration: "155분 (인터미션 포함)",
      ageLimit: "15세 이상 관람가",
      rating: 4.9,
      reviewCount: 234,
      hashtags: ["#퓰리처상 수상작", "#세기의 명작", "#사랑과 삶의 순간들"],
      genre: "로큰롤 뮤지컬 드라마",
      description: "뉴욕 동쪽 마을의 젊은 예술가들의 꿈과 사랑, 그리고 삶의 의미를 그린 감동적인 명작",
      image: "rent",
      trailerImage: "rent",
      prices: [
        { seat: "VIP석", price: "190,000원" },
        { seat: "R석", price: "160,000원" },
        { seat: "S석", price: "130,000원" },
        { seat: "A석", price: "80,000원" }
      ]
    },
    7: {
      id: 7,
      category: "연극",
      title: "햄릿",
      englishTitle: "HAMLET",
      venue: "예술의전당 오페라하우스",
      address: "서울 서초구 남부순환로 2406",
      date: "2025.01.15 ~ 2025.03.30",
      duration: "180분 (인터미션 포함)",
      ageLimit: "12세 이상 관람가",
      rating: 4.5,
      reviewCount: 145,
      hashtags: ["#셰익스피어", "#비극", "#클래식 연극"],
      genre: "비극 클래식 드라마",
      description: "세상에서 가장 유명한 비극, 덴마크 왕자 햄릿의 복수 이야기",
      image: "wicked",
      trailerImage: "wicked",
      prices: [
        { seat: "VIP석", price: "120,000원" },
        { seat: "R석", price: "90,000원" },
        { seat: "S석", price: "70,000원" },
        { seat: "A석", price: "50,000원" }
      ]
    },
    8: {
      id: 8,
      category: "뮤지컬",
      title: "시카고",
      englishTitle: "CHICAGO",
      venue: "세종문화회관 대극장",
      address: "서울 종로구 세종대로 175",
      date: "2025.02.01 ~ 2025.04.15",
      duration: "150분 (인터미션 포함)",
      ageLimit: "15세 이상 관람가",
      rating: 4.7,
      reviewCount: 198,
      hashtags: ["#재즈", "#범죄", "#토니상 수상작"],
      genre: "재즈 뮤지컬 코미디",
      description: "재즈 시대의 화려한 범죄 스토리, 1920년대 시카고의 유혹적인 세계",
      image: "moulin-rouge",
      trailerImage: "moulin-rouge",
      prices: [
        { seat: "VIP석", price: "180,000원" },
        { seat: "R석", price: "150,000원" },
        { seat: "S석", price: "120,000원" },
        { seat: "A석", price: "80,000원" }
      ]
    },
    9: {
      id: 9,
      category: "뮤지컬",
      title: "오페라의 유령",
      englishTitle: "THE PHANTOM OF THE OPERA",
      venue: "블루스퀘어 신한카드홀",
      address: "서울 용산구 이태원로 294",
      date: "2025.01.20 ~ 2025.05.10",
      duration: "165분 (인터미션 포함)",
      ageLimit: "8세 이상 관람가",
      rating: 4.8,
      reviewCount: 267,
      hashtags: ["#로맨스", "#클래식", "#세기의 명작"],
      genre: "로맨스 뮤지컬 드라마",
      description: "오페라 하우스의 비밀스러운 사랑 이야기, 파리 오페라극장의 유령과 크리스틴의 이야기",
      image: "kinky-boots",
      trailerImage: "kinky-boots",
      prices: [
        { seat: "VIP석", price: "200,000원" },
        { seat: "R석", price: "170,000원" },
        { seat: "S석", price: "140,000원" },
        { seat: "A석", price: "90,000원" }
      ]
    },
    10: {
      id: 10,
      category: "연극",
      title: "리어왕",
      englishTitle: "KING LEAR",
      venue: "국립극장 해오름극장",
      address: "서울 중구 장충단로 59",
      date: "2025.02.10 ~ 2025.04.20",
      duration: "170분 (인터미션 포함)",
      ageLimit: "12세 이상 관람가",
      rating: 4.3,
      reviewCount: 112,
      hashtags: ["#셰익스피어", "#권력", "#비극"],
      genre: "비극 클래식 드라마",
      description: "권력과 가족의 비극, 리어왕과 그의 세 딸들의 이야기",
      image: "hanbok-man",
      trailerImage: "hanbok-man",
      prices: [
        { seat: "VIP석", price: "110,000원" },
        { seat: "R석", price: "80,000원" },
        { seat: "S석", price: "60,000원" },
        { seat: "A석", price: "40,000원" }
      ]
    },
    11: {
      id: 11,
      category: "뮤지컬",
      title: "레미제라블",
      englishTitle: "LES MISÉRABLES",
      venue: "충무아트센터 대극장",
      address: "서울 중구 퇴계로 387",
      date: "2025.01.25 ~ 2025.05.30",
      duration: "175분 (인터미션 포함)",
      ageLimit: "8세 이상 관람가",
      rating: 4.9,
      reviewCount: 312,
      hashtags: ["#역사", "#드라마", "#프랑스 혁명"],
      genre: "역사 뮤지컬 드라마",
      description: "프랑스 혁명의 시대를 배경으로 한 감동 드라마, 장 발장의 이야기",
      image: "rent",
      trailerImage: "rent",
      prices: [
        { seat: "VIP석", price: "190,000원" },
        { seat: "R석", price: "160,000원" },
        { seat: "S석", price: "130,000원" },
        { seat: "A석", price: "80,000원" }
      ]
    },
    12: {
      id: 12,
      category: "뮤지컬",
      title: "맘마미아!",
      englishTitle: "MAMMA MIA!",
      venue: "디큐브 링크아트센터",
      address: "서울 강남구 영동대로 513",
      date: "2024.09.01 ~ 2024.11.30",
      duration: "140분 (인터미션 포함)",
      ageLimit: "8세 이상 관람가",
      rating: 4.6,
      reviewCount: 189,
      hashtags: ["#ABBA", "#코미디", "#로맨스"],
      genre: "코미디 뮤지컬 로맨스",
      description: "ABBA의 명곡들로 만든 화려한 뮤지컬, 그리스 섬의 결혼식 이야기",
      image: "death-note",
      trailerImage: "death-note",
      prices: [
        { seat: "VIP석", price: "170,000원" },
        { seat: "R석", price: "140,000원" },
        { seat: "S석", price: "110,000원" },
        { seat: "A석", price: "70,000원" }
      ]
    },
    13: {
      id: 13,
      category: "연극",
      title: "햄릿",
      englishTitle: "HAMLET (2024)",
      venue: "예술의전당 CJ토월극장",
      address: "서울 서초구 남부순환로 2406",
      date: "2024.08.15 ~ 2024.10.20",
      duration: "180분 (인터미션 포함)",
      ageLimit: "12세 이상 관람가",
      rating: 4.4,
      reviewCount: 156,
      hashtags: ["#셰익스피어", "#비극", "#클래식"],
      genre: "비극 클래식 드라마",
      description: "셰익스피어의 대표작, 덴마크 왕자 햄릿의 복수 이야기",
      image: "wicked",
      trailerImage: "wicked",
      prices: [
        { seat: "VIP석", price: "120,000원" },
        { seat: "R석", price: "90,000원" },
        { seat: "S석", price: "70,000원" },
        { seat: "A석", price: "50,000원" }
      ]
    },
    14: {
      id: 14,
      category: "뮤지컬",
      title: "라이온킹",
      englishTitle: "THE LION KING",
      venue: "샤롯데씨어터",
      address: "서울 송파구 올림픽로 240",
      date: "2024.07.01 ~ 2024.09.30",
      duration: "165분 (인터미션 포함)",
      ageLimit: "만 5세 이상 관람가",
      rating: 4.8,
      reviewCount: 245,
      hashtags: ["#디즈니", "#가족", "#아프리카"],
      genre: "가족 뮤지컬 판타지",
      description: "디즈니의 아프리카 대자연 이야기, 심바의 성장 이야기",
      image: "moulin-rouge",
      trailerImage: "moulin-rouge",
      prices: [
        { seat: "VIP석", price: "180,000원" },
        { seat: "R석", price: "150,000원" },
        { seat: "S석", price: "120,000원" },
        { seat: "A석", price: "80,000원" }
      ]
    },
    15: {
      id: 15,
      category: "연극",
      title: "세일즈맨의 죽음",
      englishTitle: "DEATH OF A SALESMAN",
      venue: "국립극장 자유소극장",
      address: "서울 중구 장충단로 59",
      date: "2024.06.10 ~ 2024.08.15",
      duration: "160분 (인터미션 포함)",
      ageLimit: "15세 이상 관람가",
      rating: 4.5,
      reviewCount: 134,
      hashtags: ["#현대극", "#드라마", "#아서 밀러"],
      genre: "현대극 드라마 비극",
      description: "아서 밀러의 명작, 세일즈맨 윌리 로먼의 삶과 죽음",
      image: "kinky-boots",
      trailerImage: "kinky-boots",
      prices: [
        { seat: "VIP석", price: "100,000원" },
        { seat: "R석", price: "70,000원" },
        { seat: "S석", price: "50,000원" },
        { seat: "A석", price: "30,000원" }
      ]
    },
    16: {
      id: 16,
      category: "뮤지컬",
      title: "캣츠",
      englishTitle: "CATS",
      venue: "블루스퀘어 신한카드홀",
      address: "서울 용산구 이태원로 294",
      date: "2024.05.01 ~ 2024.07.20",
      duration: "150분 (인터미션 포함)",
      ageLimit: "8세 이상 관람가",
      rating: 4.7,
      reviewCount: 201,
      hashtags: ["#판타지", "#가족", "#앤드루 로이드 웨버"],
      genre: "판타지 뮤지컬 가족",
      description: "앤드루 로이드 웨버의 대표작, 재즈리 캣츠의 연례 모임",
      image: "hanbok-man",
      trailerImage: "hanbok-man",
      prices: [
        { seat: "VIP석", price: "170,000원" },
        { seat: "R석", price: "140,000원" },
        { seat: "S석", price: "110,000원" },
        { seat: "A석", price: "70,000원" }
      ]
    },
    17: {
      id: 17,
      category: "뮤지컬",
      title: "미스 사이공",
      englishTitle: "MISS SAIGON",
      venue: "세종문화회관 대극장",
      address: "서울 종로구 세종대로 175",
      date: "2025.06.01 ~ 2025.08.31",
      duration: "165분 (인터미션 포함)",
      ageLimit: "15세 이상 관람가",
      rating: 0,
      reviewCount: 0,
      hashtags: ["#로맨스", "#드라마", "#베트남 전쟁"],
      genre: "로맨스 뮤지컬 드라마",
      description: "베트남 전쟁 시대의 사랑 이야기, 사이공의 기적",
      image: "rent",
      trailerImage: "rent",
      prices: [
        { seat: "VIP석", price: "190,000원" },
        { seat: "R석", price: "160,000원" },
        { seat: "S석", price: "130,000원" },
        { seat: "A석", price: "80,000원" }
      ]
    },
    18: {
      id: 18,
      category: "연극",
      title: "햄릿",
      englishTitle: "HAMLET (2025 Summer)",
      venue: "예술의전당 오페라하우스",
      address: "서울 서초구 남부순환로 2406",
      date: "2025.07.15 ~ 2025.09.30",
      duration: "180분 (인터미션 포함)",
      ageLimit: "12세 이상 관람가",
      rating: 0,
      reviewCount: 0,
      hashtags: ["#셰익스피어", "#클래식", "#비극"],
      genre: "비극 클래식 드라마",
      description: "셰익스피어의 불멸의 명작, 덴마크 왕자 햄릿의 복수 이야기",
      image: "death-note",
      trailerImage: "death-note",
      prices: [
        { seat: "VIP석", price: "120,000원" },
        { seat: "R석", price: "90,000원" },
        { seat: "S석", price: "70,000원" },
        { seat: "A석", price: "50,000원" }
      ]
    },
    19: {
      id: 19,
      category: "뮤지컬",
      title: "에비타",
      englishTitle: "EVITA",
      venue: "충무아트센터 대극장",
      address: "서울 중구 퇴계로 387",
      date: "2025.08.01 ~ 2025.10.31",
      duration: "155분 (인터미션 포함)",
      ageLimit: "12세 이상 관람가",
      rating: 0,
      reviewCount: 0,
      hashtags: ["#역사", "#드라마", "#앤드루 로이드 웨버"],
      genre: "역사 뮤지컬 드라마",
      description: "아르헨티나의 영부인 에비타 페론의 이야기",
      image: "wicked",
      trailerImage: "wicked",
      prices: [
        { seat: "VIP석", price: "180,000원" },
        { seat: "R석", price: "150,000원" },
        { seat: "S석", price: "120,000원" },
        { seat: "A석", price: "80,000원" }
      ]
    },
    20: {
      id: 20,
      category: "연극",
      title: "오셀로",
      englishTitle: "OTHELLO",
      venue: "국립극장 해오름극장",
      address: "서울 중구 장충단로 59",
      date: "2025.09.10 ~ 2025.11.20",
      duration: "170분 (인터미션 포함)",
      ageLimit: "12세 이상 관람가",
      rating: 0,
      reviewCount: 0,
      hashtags: ["#셰익스피어", "#비극", "#질투"],
      genre: "비극 클래식 드라마",
      description: "질투와 사랑의 비극, 오셀로와 데스데모나의 이야기",
      image: "moulin-rouge",
      trailerImage: "moulin-rouge",
      prices: [
        { seat: "VIP석", price: "110,000원" },
        { seat: "R석", price: "80,000원" },
        { seat: "S석", price: "60,000원" },
        { seat: "A석", price: "40,000원" }
      ]
    },
    21: {
      id: 21,
      category: "뮤지컬",
      title: "드림걸스",
      englishTitle: "DREAMGIRLS",
      venue: "디큐브 링크아트센터",
      address: "서울 강남구 영동대로 513",
      date: "2025.10.05 ~ 2026.01.15",
      duration: "150분 (인터미션 포함)",
      ageLimit: "12세 이상 관람가",
      rating: 0,
      reviewCount: 0,
      hashtags: ["#R&B", "#드라마", "#음악"],
      genre: "R&B 뮤지컬 드라마",
      description: "1960년대 R&B 그룹의 성공 스토리, 드림걸스의 도전과 성장",
      image: "kinky-boots",
      trailerImage: "kinky-boots",
      prices: [
        { seat: "VIP석", price: "180,000원" },
        { seat: "R석", price: "150,000원" },
        { seat: "S석", price: "120,000원" },
        { seat: "A석", price: "80,000원" }
      ]
    },
    22: {
      id: 22,
      category: "콘서트",
      title: "NCT WISH 콘서트",
      englishTitle: "NCT WISH CONCERT",
      venue: "올림픽공원 올림픽홀",
      address: "서울 송파구 올림픽로 424",
      date: "2025.01.05 ~ 2025.01.07",
      duration: "120분",
      ageLimit: "전체 관람가",
      rating: 4.8,
      reviewCount: 342,
      hashtags: ["#NCT", "#K-pop", "#콘서트"],
      genre: "K-pop 콘서트",
      description: "NCT WISH의 화려한 무대와 강렬한 퍼포먼스",
      image: "rent",
      trailerImage: "rent",
      prices: [
        { seat: "VIP석", price: "180,000원" },
        { seat: "R석", price: "150,000원" },
        { seat: "S석", price: "120,000원" },
        { seat: "A석", price: "90,000원" }
      ]
    },
    23: {
      id: 23,
      category: "콘서트",
      title: "SKY FESTIVAL",
      englishTitle: "SKY FESTIVAL 2025",
      venue: "잠실종합운동장 주경기장",
      address: "서울 송파구 올림픽로 25",
      date: "2025.01.18 ~ 2025.01.19",
      duration: "300분 (2일차)",
      ageLimit: "전체 관람가",
      rating: 0,
      reviewCount: 0,
      hashtags: ["#페스티벌", "#K-pop", "#올스타"],
      genre: "K-pop 페스티벌",
      description: "올해 최고의 페스티벌, 최정상 아티스트들의 무대",
      image: "moulin-rouge",
      trailerImage: "moulin-rouge",
      prices: [
        { seat: "VIP석", price: "200,000원" },
        { seat: "R석", price: "160,000원" },
        { seat: "S석", price: "130,000원" },
        { seat: "A석", price: "100,000원" }
      ]
    },
    24: {
      id: 24,
      category: "콘서트",
      title: "아이유 콘서트",
      englishTitle: "IU CONCERT - The Golden Hour",
      venue: "잠실실내체육관",
      address: "서울 송파구 올림픽로 240",
      date: "2025.02.15 ~ 2025.02.16",
      duration: "150분",
      ageLimit: "전체 관람가",
      rating: 0,
      reviewCount: 0,
      hashtags: ["#아이유", "#K-pop", "#발라드"],
      genre: "K-pop 콘서트",
      description: "아이유의 황금빛 무대와 감동적인 라이브",
      image: "kinky-boots",
      trailerImage: "kinky-boots",
      prices: [
        { seat: "VIP석", price: "190,000원" },
        { seat: "R석", price: "160,000원" },
        { seat: "S석", price: "130,000원" },
        { seat: "A석", price: "100,000원" }
      ]
    },
    25: {
      id: 25,
      category: "콘서트",
      title: "BTS 콘서트",
      englishTitle: "BTS WORLD TOUR",
      venue: "고척스카이돔",
      address: "서울 구로구 경인로 430",
      date: "2024.12.20 ~ 2024.12.22",
      duration: "180분",
      ageLimit: "전체 관람가",
      rating: 4.9,
      reviewCount: 567,
      hashtags: ["#BTS", "#K-pop", "#월드투어"],
      genre: "K-pop 콘서트",
      description: "BTS의 글로벌 월드 투어, 전 세계를 열광시킨 무대",
      image: "wicked",
      trailerImage: "wicked",
      prices: [
        { seat: "VIP석", price: "220,000원" },
        { seat: "R석", price: "180,000원" },
        { seat: "S석", price: "150,000원" },
        { seat: "A석", price: "120,000원" }
      ]
    },
    26: {
      id: 26,
      category: "콘서트",
      title: "뉴진스 콘서트",
      englishTitle: "NewJeans LIVE",
      venue: "올림픽공원 체조경기장",
      address: "서울 송파구 올림픽로 424",
      date: "2025.03.10 ~ 2025.03.12",
      duration: "120분",
      ageLimit: "전체 관람가",
      rating: 0,
      reviewCount: 0,
      hashtags: ["#뉴진스", "#K-pop", "#라이브"],
      genre: "K-pop 콘서트",
      description: "뉴진스의 특별한 라이브 무대와 상큼한 에너지",
      image: "death-note",
      trailerImage: "death-note",
      prices: [
        { seat: "VIP석", price: "180,000원" },
        { seat: "R석", price: "150,000원" },
        { seat: "S석", price: "120,000원" },
        { seat: "A석", price: "90,000원" }
      ]
    },
    27: {
      id: 27,
      category: "콘서트",
      title: "세븐틴 콘서트",
      englishTitle: "SEVENTEEN TOUR",
      venue: "잠실종합운동장 주경기장",
      address: "서울 송파구 올림픽로 25",
      date: "2024.11.15 ~ 2024.11.17",
      duration: "150분",
      ageLimit: "전체 관람가",
      rating: 4.7,
      reviewCount: 289,
      hashtags: ["#세븐틴", "#K-pop", "#퍼포먼스"],
      genre: "K-pop 콘서트",
      description: "세븐틴의 화려한 퍼포먼스와 완벽한 무대",
      image: "hanbok-man",
      trailerImage: "hanbok-man",
      prices: [
        { seat: "VIP석", price: "190,000원" },
        { seat: "R석", price: "160,000원" },
        { seat: "S석", price: "130,000원" },
        { seat: "A석", price: "100,000원" }
      ]
    },
    28: {
      id: 28,
      category: "콘서트",
      title: "르세라핌 콘서트",
      englishTitle: "LE SSERAFIM LIVE",
      venue: "올림픽공원 올림픽홀",
      address: "서울 송파구 올림픽로 424",
      date: "2025.02.28 ~ 2025.03.02",
      duration: "120분",
      ageLimit: "전체 관람가",
      rating: 0,
      reviewCount: 0,
      hashtags: ["#르세라핌", "#K-pop", "#파워"],
      genre: "K-pop 콘서트",
      description: "르세라핌의 강렬한 무대와 파워풀한 퍼포먼스",
      image: "rent",
      trailerImage: "rent",
      prices: [
        { seat: "VIP석", price: "180,000원" },
        { seat: "R석", price: "150,000원" },
        { seat: "S석", price: "120,000원" },
        { seat: "A석", price: "90,000원" }
      ]
    }
  };

  // 포스터 이미지 매핑 (fallback용)
  const posterImages = {
    'wicked': wickedPoster,
    'moulin-rouge': moulinRougePoster,
    'kinky-boots': kinkyBootsPoster,
    'hanbok-man': hanbokManPoster,
    'death-note': deathNotePoster,
    'rent': rentPoster
  };
  
  // 포스터 이미지 가져오기 (API에서 받은 URL 우선, 없으면 fallback)
  const getPosterImage = () => {
    if (performance?.poster) {
      return performance.poster;
    }
    // fallback: 기존 로직 유지
    const imageName = performance?.image || 'wicked';
    return posterImages[imageName] || wickedPoster;
  };
  
  // 카메라 스트림이 변경될 때 video 요소 업데이트
  useEffect(() => {
    if (cameraStream && ticketVideoRef.current) {
      ticketVideoRef.current.srcObject = cameraStream;
      ticketVideoRef.current.play().catch(err => {
        console.error('비디오 재생 실패:', err);
      });
    }
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      if (ticketVideoRef.current) {
        ticketVideoRef.current.srcObject = null;
      }
    };
  }, [cameraStream]);

  // API로 공연 기본 정보 조회
  useEffect(() => {
    const loadPerformanceData = async () => {
      if (!id) {
        setError('공연 ID가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // API 호출
        const apiData = await fetchPerformanceBasic(id);
        
        // 데이터 정규화
        const normalizedData = normalizePerformanceDetail(apiData);
        
        if (normalizedData) {
          setPerformance(normalizedData);
          
          // 공연 상세 페이지 진입 시 VIEW 로그 기록 (로그인 상태일 때만)
          if (currentUserId) {
            try {
              await logApi.createLog({
                eventType: "VIEW",
                targetType: "PERFORMANCE",
                targetId: normalizedData.id || normalizedData.performanceId || id
              });
            } catch (logErr) {
              console.error('로그 기록 실패:', logErr);
            }
          }
        } else {
          throw new Error('공연 정보를 불러올 수 없습니다.');
        }
      } catch (err) {
        console.error('공연 정보 조회 실패:', err);
        setError(err.message || '공연 정보를 불러오는 중 오류가 발생했습니다.');
        
        // 에러 발생 시 fallback 데이터 사용
        const performanceId = parseInt(id, 10);
        const fallbackData = allPerformances[performanceId] || allPerformances[1];
        if (fallbackData) {
          setPerformance(fallbackData);
          
          // fallback 데이터 사용 시에도 VIEW 로그 기록 (로그인 상태일 때만)
          if (currentUserId) {
            try {
              await logApi.createLog({
                eventType: "VIEW",
                targetType: "PERFORMANCE",
                targetId: String(id)
              });
            } catch (logErr) {
              console.error('로그 기록 실패:', logErr);
            }
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadPerformanceData();
  }, [id]);

  // URL 쿼리 파라미터로 탭 활성화
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'review') {
      setActiveTab('review');
      // 후기/기대평 섹션으로 스크롤
      setTimeout(() => {
        const reviewSection = document.querySelector(`[data-tab="review"]`);
        if (reviewSection) {
          reviewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
      // 쿼리 파라미터 제거
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  // 공연 관심 여부 조회
  useEffect(() => {
    const loadFavoriteStatus = async () => {
      if (!performanceId) return;
      
      try {
        const liked = await isPerformanceLiked(performanceId);
        setIsFavorite(liked);
      } catch (err) {
        console.error('공연 관심 여부 조회 실패:', err);
        setIsFavorite(false);
      }
    };

    loadFavoriteStatus();
  }, [performanceId]);

  // 공연 영상 목록 조회
  useEffect(() => {
    const loadVideos = async () => {
      if (!performanceId) {
        setVideos([]);
        return;
      }

      try {
        setVideosLoading(true);
        console.log("📹 영상 목록 조회 시작 - performanceId:", performanceId);
        const response = await fetchPerformanceVideos(performanceId);
        console.log("📹 API 응답 원본:", response);
        const normalized = normalizePerformanceVideos(response);
        console.log("📹 정제된 영상 목록:", normalized);
        console.log("📹 영상 개수:", normalized.length);
        setVideos(normalized);
      } catch (err) {
        console.error('❌ 공연 영상 목록 조회 실패:', err);
        setVideos([]);
      } finally {
        setVideosLoading(false);
      }
    };

    loadVideos();
  }, [performanceId]);

  // 리뷰 데이터 로드 함수 (재사용 가능)
  const loadReviews = async () => {
    if (!performanceId) return;

    try {
      setReviewsLoading(true);
      setReviewsError(null);

      // 현재 활성화된 탭에 따라 reviewType 설정
      const reviewType = activeReviewTab === 'review' ? 'AFTER' : 'EXPECTATION';
      
      const apiData = await fetchPerformanceReviewsByPerformance(performanceId, reviewType);
      
      // API 응답 구조 처리: apiData는 { reviews: [...], totalCount: ... } 형태 또는 빈 배열
      const reviewsData = Array.isArray(apiData) ? { reviews: [] } : apiData;

      const normalizedReviews = normalizePerformanceReviews(reviewsData);

      if (activeReviewTab === 'review') {
        setReviews(normalizedReviews);
      } else {
        setExpectations(normalizedReviews);
        // 기대평 관심 여부 조회
        const likesMap = {};
        for (const expectation of normalizedReviews) {
          try {
            const liked = await isPerformanceReviewLiked(expectation.id);
            likesMap[expectation.id] = liked;
          } catch (err) {
            console.error(`기대평 ${expectation.id} 관심 여부 조회 실패:`, err);
            likesMap[expectation.id] = false;
          }
        }
        setExpectationLikes(likesMap);
      }
    } catch (err) {
      console.error('리뷰 조회 실패:', err);
      setReviewsError(err.message || '리뷰를 불러오는 중 오류가 발생했습니다.');
      // 에러 발생 시 빈 배열로 설정
      if (activeReviewTab === 'review') {
        setReviews([]);
      } else {
        setExpectations([]);
      }
    } finally {
      setReviewsLoading(false);
    }
  };

  // 리뷰 데이터 로드
  useEffect(() => {
    loadReviews();
  }, [performanceId, activeReviewTab]);

  const tabs = [
    { id: 'detail', label: '상세정보' },
    { id: 'reservation', label: '예매정보' },
    { id: 'review', label: '후기/기대평' },
    { id: 'venue', label: '공연장 정보' }
  ];


  const toggleFavorite = async () => {
    if (!performanceId) return;
    
    try {
      const result = await togglePerformanceFavorite(performanceId);
      setIsFavorite(result);
      
      // 공연 찜/찜해제 시 FAVORITE 로그 기록
      try {
        await logApi.createLog({
          eventType: "FAVORITE",
          targetType: "PERFORMANCE",
          targetId: String(performanceId)
        });
      } catch (logErr) {
        console.error('로그 기록 실패:', logErr);
      }
    } catch (err) {
      console.error('공연 관심 토글 실패:', err);
    }
  };

  const toggleExpectationExpansion = (expectationId) => {
    setExpandedExpectations(prev => ({
      ...prev,
      [expectationId]: !prev[expectationId]
    }));
  };

  const handleWriteClick = (type) => {
    setWriteType(type);
    // 후기 작성의 경우 항상 티켓 등록 단계부터 시작
    if (type === 'review') {
      const performanceTitle = performance?.title || '';
      // 공연 정보를 초기값으로 설정하고 티켓 등록 단계부터 시작
      navigate('/recommend/review', {
        state: {
          ticketData: {
            performanceName: performanceTitle,
            performanceDate: '',
            performanceTime: '',
            section: '',
            row: '',
            number: ''
          },
          performanceId: performanceId || id
        }
      });
    } else {
      // 기대평 작성은 기존 로직 유지
      setShowWriteModal(true);
    }
  };

  const handleTicketInfoSubmit = () => {
    if (!ticketInfo.performanceDate) {
      alert('공연일자를 입력해주세요.');
      return;
    }
    
    // 티켓 정보를 저장
    const ticketData = {
      performanceName: performance?.title || '',
      performanceDate: ticketInfo.performanceDate,
      performanceTime: ticketInfo.performanceTime,
      section: ticketInfo.section,
      row: ticketInfo.row,
      number: ticketInfo.number
    };
    
    // 티켓이 없으면 등록
    const existingTickets = getTicketsByPerformanceName(performance?.title || '');
    if (existingTickets.length === 0) {
      addTicket(ticketData);
    }
    
    // ReviewWritingPage로 이동하면서 티켓 정보와 공연 정보 전달
    navigate('/recommend/review', {
      state: {
        ticketData,
        performanceId: performanceId || id // 공연 ID 전달
      }
    });
  };

  const handleTicketInfoCancel = () => {
    setShowTicketInfoModal(false);
    setTicketStep('scan');
    setTicketInfo({
      performanceDate: '',
      performanceTime: '',
      section: '',
      row: '',
      number: ''
    });
    setCapturedImage(null);
    stopTicketCamera();
  };

  const handleTicketInfoChange = (field, value) => {
    setTicketInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 티켓 카메라 시작
  const startTicketCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      setCameraStream(stream);
      // video 요소가 준비될 때까지 약간의 지연
      setTimeout(() => {
        if (ticketVideoRef.current) {
          ticketVideoRef.current.srcObject = stream;
          // video 재생 강제
          ticketVideoRef.current.play().catch(err => {
            console.error('비디오 재생 실패:', err);
          });
        }
      }, 100);
    } catch (err) {
      console.error('카메라 접근 실패:', err);
      setIsScanning(false);
      alert('카메라 접근에 실패했습니다. 파일에서 선택해주세요.');
    }
  };

  // 티켓 카메라 중지
  const stopTicketCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    if (ticketVideoRef.current) {
      ticketVideoRef.current.srcObject = null;
    }
  };

  // 티켓 촬영
  const captureTicketPhoto = () => {
    if (ticketVideoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = ticketVideoRef.current.videoWidth;
      canvas.height = ticketVideoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(ticketVideoRef.current, 0, 0);
      
      canvas.toBlob((blob) => {
        const imageUrl = URL.createObjectURL(blob);
        setCapturedImage(imageUrl);
        stopTicketCamera();
        setIsScanning(false);
        setTicketStep('input');
      }, 'image/jpeg');
    }
  };

  // 티켓 파일 선택
  const handleTicketFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        setCapturedImage(imageUrl);
        setTicketStep('input');
      };
      reader.readAsDataURL(file);
    }
  };

  // 티켓 카메라 버튼 클릭
  const handleTicketCameraClick = async () => {
    setIsScanning(true);
    await startTicketCamera();
  };

  // 티켓 파일 선택 버튼 클릭
  const handleTicketFileClick = () => {
    ticketFileInputRef.current?.click();
  };

  // 티켓 스캔 건너뛰기
  const handleSkipTicketScan = () => {
    setTicketStep('input');
    stopTicketCamera();
  };

  const handleWriteSubmit = async (e) => {
    e.preventDefault();
    
    // 공연 후기(AFTER)인 경우 티켓 선택 필수
    if (writeType === 'review') {
      if (!selectedTicket || !selectedTicket.ticketId) {
        alert('리뷰를 작성하려면 티켓을 선택해주세요.');
        setShowTicketSelectModal(true);
        return;
      }
    }
    
    if (!performanceId) {
      alert('공연 정보가 없습니다.');
      return;
    }

    try {
      // 요청 DTO 생성
      const reviewType = writeType === 'review' ? 'AFTER' : 'EXPECTATION';
      
      // 공연 후기인 경우 선택된 티켓의 performanceId와 ticketId 사용
      // 기대평인 경우 공연 상세 페이지의 performanceId 사용 (티켓 선택 불필요)
      const reviewPerformanceId = writeType === 'review' && selectedTicket?.performanceId 
        ? selectedTicket.performanceId 
        : performanceId;
      
      const reviewTicketId = writeType === 'review' && selectedTicket?.ticketId 
        ? selectedTicket.ticketId 
        : null;
      
      const requestDto = normalizePerformanceReviewRequest(
        writeForm,
        reviewPerformanceId,
        reviewType,
        reviewTicketId
      );

      // API 호출
      await createPerformanceReview(requestDto);

      // 리뷰 작성 완료 시 REVIEW_WRITE 로그 기록
      try {
        await logApi.createLog({
          eventType: "REVIEW_WRITE",
          targetType: "PERFORMANCE",
          targetId: String(performanceId)
        });
      } catch (logErr) {
        console.error('로그 기록 실패:', logErr);
      }

      // 성공 시 모달 닫고 폼 초기화
      setShowWriteModal(false);
      setWriteForm({ title: '', content: '', rating: 5 });

      // 리뷰 목록 다시 조회
      // activeReviewTab이 현재 작성한 타입과 일치하는 경우에만 리뷰 목록 갱신
      if ((writeType === 'review' && activeReviewTab === 'review') ||
          (writeType === 'expectation' && activeReviewTab === 'expectation')) {
        await loadReviews();
      }
    } catch (err) {
      console.error('후기 작성 실패:', err);
      alert(err.response?.data?.message || err.message || '후기 작성에 실패했습니다.');
    }
  };

  const handleWriteCancel = () => {
    setShowWriteModal(false);
    setWriteForm({ title: '', content: '', rating: 5 });
    setSelectedTicket(null);
  };

  // 티켓 선택 모달 열기
  const handleOpenTicketSelectModal = () => {
    setShowTicketSelectModal(true);
  };

  // 티켓 선택 모달 닫기
  const handleCloseTicketSelectModal = () => {
    setShowTicketSelectModal(false);
  };

  // 티켓 선택 시 처리
  const handleSelectTicket = (ticket) => {
    const ticketId = ticket.ticketId || ticket.id;
    const ticketPerformanceId = ticket.performanceId;
    
    setSelectedTicket({
      ticketId: ticketId,
      performanceId: ticketPerformanceId
    });
    
    setShowTicketSelectModal(false);
  };

  // 리뷰 수정 핸들러
  const handleEditReview = async (review, reviewType) => {
    const reviewId = review.id || review.performanceReviewId || review.reviewId;
    
    if (!reviewId) {
      alert('리뷰 ID를 찾을 수 없습니다.');
      return;
    }

    try {
      // 단일 조회 API로 최신 데이터 가져오기
      const apiResponse = await fetchPerformanceReview(reviewId);
      
      // API 응답을 프론트엔드 형식으로 변환
      const normalizedReview = {
        id: apiResponse.performanceReviewId,
        performanceReviewId: apiResponse.performanceReviewId,
        performanceId: apiResponse.performanceId,
        ticketId: apiResponse.ticketId || null, // 리뷰 수정 시 ticketId 필요
        title: apiResponse.title || '',
        content: apiResponse.contents || '',
        contents: apiResponse.contents || '',
        rating: apiResponse.rating || 5,
        reviewType: apiResponse.reviewType || reviewType
      };

      setEditingReview(normalizedReview);
      setEditForm({
        title: normalizedReview.title || '',
        content: normalizedReview.content || normalizedReview.contents || '',
        rating: normalizedReview.rating || 5
      });
      setShowEditModal(true);
    } catch (err) {
      console.error('리뷰 조회 실패:', err);
      // API 조회 실패 시 목록 데이터 사용 (fallback)
      setEditingReview({ ...review, reviewType });
      setEditForm({
        title: review.title || '',
        content: review.content || review.contents || '',
        rating: review.rating || 5
      });
      setShowEditModal(true);
    }
  };

  // 수정 모달 닫기
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingReview(null);
    setEditForm({ title: '', content: '', rating: 5 });
  };

  // 리뷰 수정 제출
  const handleUpdateReview = async (e) => {
    e.preventDefault();
    
    if (!editingReview || !performanceId) return;

    try {
      const reviewId = editingReview.id || editingReview.performanceReviewId || editingReview.reviewId;
      const reviewType = editingReview.reviewType || (activeReviewTab === 'review' ? 'AFTER' : 'EXPECTATION');
      
      // 리뷰 수정 시 기존 리뷰의 ticketId 사용
      const reviewTicketId = editingReview.ticketId || null;

      const updateDto = normalizePerformanceReviewRequest(
        editForm,
        performanceId,
        reviewType,
        reviewTicketId
      );
      
      await updatePerformanceReview(reviewId, updateDto);
      
      alert('리뷰가 수정되었습니다.');
      handleCloseEditModal();
      
      // 리뷰 목록 다시 조회
      await loadReviews();
    } catch (err) {
      console.error('리뷰 수정 실패:', err);
      alert(err.response?.data?.message || err.message || '리뷰 수정에 실패했습니다.');
    }
  };

  // 리뷰 삭제 핸들러
  const handleDeleteReview = async (reviewId, reviewType) => {
    if (!window.confirm('정말 이 리뷰를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await deletePerformanceReview(reviewId);
      alert('리뷰가 삭제되었습니다.');
      
      // 리뷰 목록 다시 조회
      await loadReviews();
    } catch (err) {
      console.error('리뷰 삭제 실패:', err);
      alert(err.response?.data?.message || err.message || '리뷰 삭제에 실패했습니다.');
    }
  };

  // 로딩 중이거나 데이터가 없을 때
  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ padding: '2rem', textAlign: 'center' }}>로딩 중...</div>
      </div>
    );
  }

  if (error && !performance) {
    return (
      <div className={styles.container}>
        <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
          {error}
        </div>
      </div>
    );
  }

  if (!performance) {
    return (
      <div className={styles.container}>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          공연 정보를 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <PerformancePoster
        imageUrl={getPosterImage()}
        isFavorite={isFavorite}
        onFavoriteToggle={toggleFavorite}
      />

      <PerformanceInfoCard
        category={performance.category}
        title={performance.title}
        englishTitle={performance.englishTitle}
        venue={performance.venue}
        address={performance.address}
        date={performance.date}
        duration={performance.duration}
        ageLimit={performance.ageLimit}
      />

      <PerformanceTrailer
        englishTitle={performance.englishTitle}
        title={performance.title}
        trailerImage={performance.trailerImage || performance.image}
        videos={videos}
      />

      <PerformanceDetails
        rating={performance.rating ? parseFloat(performance.rating).toFixed(1) : '0.0'}
        reviewCount={performance.reviewCount}
        hashtags={performance.hashtags}
        genre={performance.genre}
        description={performance.description}
      />

      <BookingLinks bookingSites={bookingSites} />

      {/* 추천 버튼 */}
      <div className={styles.recommendSection}>
        <button 
          className={styles.recommendButton}
          onClick={() => navigate('/recommend')}
        >
          내가 본 공연과 잘 맞는 공연은?
        </button>
      </div>

      <OpenChatSection 
        performanceId={performance.id || performance.performanceId}
        performanceTitle={performance.title}
        performanceGenre={performance.genre}
        performancePoster={performance.poster}
      />

      {/* Tabs */}
      <div className={styles.tabSection} data-tab={activeTab}>
        <div className={styles.tabs}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {activeTab === 'reservation' && (
            <div className={styles.reservationContent}>
              <h3 className={styles.contentTitle}>가격</h3>
              <div className={styles.priceList}>
                {bookingLoading ? (
                  <div className={styles.priceItem}>
                    <span className={styles.seatType}>가격 정보를 불러오는 중...</span>
                  </div>
                ) : bookingInfo?.price ? (
                  <div className={styles.priceItem}>
                    <span className={styles.seatType}>{bookingInfo.price}</span>
                  </div>
                ) : (
                  <div className={styles.priceItem}>
                    <span className={styles.seatType}>가격 정보 없음</span>
                  </div>
                )}
              </div>
              
              {/* 할인정보 섹션 */}
              {(bookingLoading || (bookingInfo?.discountImages && bookingInfo.discountImages.length > 0)) && (
                <div className={styles.discountSection}>
                  <h3 className={styles.contentTitle}>할인정보</h3>
                  <div className={styles.infoPlaceholder}>
                    {bookingLoading ? (
                      <p className={styles.placeholderText}>정보를 불러오는 중...</p>
                    ) : (
                      <div className={styles.imageContainer}>
                        {bookingInfo.discountImages.map((image, index) => (
                          <img
                            key={image.performanceImageId || index}
                            src={image.imageUrl}
                            alt={`할인 정보 이미지 ${index + 1}`}
                            className={styles.infoImage}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 캐스팅 섹션 */}
              {(bookingLoading || (bookingInfo?.castingImages && bookingInfo.castingImages.length > 0)) && (
                <div className={styles.castingSection}>
                  <h3 className={styles.contentTitle}>캐스팅</h3>
                  <div className={styles.infoPlaceholder}>
                    {bookingLoading ? (
                      <p className={styles.placeholderText}>정보를 불러오는 중...</p>
                    ) : (
                      <div className={styles.imageContainer}>
                        {bookingInfo.castingImages.map((image, index) => (
                          <img
                            key={image.performanceImageId || index}
                            src={image.imageUrl}
                            alt={`캐스팅 정보 이미지 ${index + 1}`}
                            className={styles.infoImage}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 좌석배치도 섹션 */}
              {(bookingLoading || (bookingInfo?.seatImages && bookingInfo.seatImages.length > 0)) && (
                <div className={styles.seatingChartSection}>
                  <h3 className={styles.contentTitle}>좌석배치도</h3>
                  <div className={styles.infoPlaceholder}>
                    {bookingLoading ? (
                      <p className={styles.placeholderText}>정보를 불러오는 중...</p>
                    ) : (
                      <div className={styles.imageContainer}>
                        {bookingInfo.seatImages.map((image, index) => (
                          <img
                            key={image.performanceImageId || index}
                            src={image.imageUrl}
                            alt={`좌석배치도 이미지 ${index + 1}`}
                            className={styles.infoImage}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'detail' && (
            <div className={styles.detailContent}>
              <h3 className={styles.contentTitle}>상세 정보</h3>
              <div className={styles.detailText}>
                <p><strong>장르:</strong> {performance.genre}</p>
                <p><strong>관람 연령:</strong> {performance.ageLimit}</p>
                <p><strong>공연 시간:</strong> {performance.duration}</p>
                <p><strong>공연 기간:</strong> {performance.date}</p>
                <p><strong>공연장:</strong> {performance.venue}</p>
                <p><strong>주소:</strong> {performance.address}</p>
                <br/>
                <p>{performance.description}</p>
              </div>
              
              {/* 제작사 제공 소개 이미지 섹션 */}
              <PerformanceInfoImages images={infoImages} loading={imagesLoading} />
            </div>
          )}
          
          {activeTab === 'review' && (
            <div className={styles.reviewContent}>
              <h3 className={styles.contentTitle}>후기 / 기대평</h3>
              
              {/* 후기/기대평 탭 */}
              <div className={styles.reviewTabs}>
                <button 
                  className={`${styles.reviewTab} ${activeReviewTab === 'review' ? styles.activeReviewTab : ''}`}
                  onClick={() => setActiveReviewTab('review')}
                >
                  후기
                </button>
                <button 
                  className={`${styles.reviewTab} ${activeReviewTab === 'expectation' ? styles.activeReviewTab : ''}`}
                  onClick={() => setActiveReviewTab('expectation')}
                >
                  기대평
                </button>
              </div>

              {/* 글쓰기 버튼 */}
              <div className={styles.writeButtonContainer}>
                <button 
                  className={styles.writeButton}
                  onClick={() => handleWriteClick(activeReviewTab)}
                >
                  {activeReviewTab === 'review' ? '후기 작성하기' : '기대평 작성하기'}
                </button>
              </div>

              {/* 후기 목록 */}
              {activeReviewTab === 'review' && (
                <div className={styles.reviewList}>
                  <div className={styles.reviewListHeader}>
                    <h4>후기 목록</h4>
                    <span className={styles.sortOption}>인기순</span>
                  </div>
                  
                  {reviewsLoading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>로딩 중...</div>
                  ) : reviewsError ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                      {reviewsError}
                    </div>
                  ) : reviews.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                      등록된 후기가 없습니다.
                    </div>
                  ) : (
                    reviews.map(review => (
                      <ReviewCard
                        key={review.id}
                        id={review.id}
                        title={review.title}
                        performanceDate={review.performanceDate}
                        performanceTime={review.performanceTime}
                        seat={review.seat}
                        performanceName={review.performanceName || review.performanceTitle}
                        rating={review.rating}
                        content={review.content}
                        author={review.author}
                        date={review.date}
                        userId={review.userId}
                        currentUserId={currentUserId}
                        onEdit={() => handleEditReview(review, 'AFTER')}
                        onDelete={() => handleDeleteReview(review.id || review.performanceReviewId || review.reviewId, 'AFTER')}
                      />
                    ))
                  )}
                </div>
              )}

              {/* 기대평 목록 */}
              {activeReviewTab === 'expectation' && (
                <div className={styles.expectationList}>
                  <div className={styles.expectationListHeader}>
                    <h4>기대평 목록</h4>
                  </div>
                  
                  {reviewsLoading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>로딩 중...</div>
                  ) : reviewsError ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                      {reviewsError}
                    </div>
                  ) : expectations.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                      등록된 기대평이 없습니다.
                    </div>
                  ) : (
                    expectations.map(expectation => {
                      const isMyReview = currentUserId && expectation.userId && expectation.userId === currentUserId;
                      return (
                        <div key={expectation.id} className={styles.expectationItem}>
                          <div className={styles.expectationHeader}>
                            <h5 className={styles.expectationTitle}>{expectation.title}</h5>
                            {isMyReview && (
                              <div className={styles.expectationActions}>
                                <button
                                  className={styles.editButton}
                                  onClick={() => handleEditReview(expectation, 'EXPECTATION')}
                                >
                                  수정
                                </button>
                                <button
                                  className={styles.deleteButton}
                                  onClick={() => handleDeleteReview(expectation.id || expectation.performanceReviewId || expectation.reviewId, 'EXPECTATION')}
                                >
                                  삭제
                                </button>
                              </div>
                            )}
                          </div>
                          
                          <div className={styles.expectationContent}>
                            <p className={styles.expectationText}>
                              {expandedExpectations[expectation.id] 
                                ? expectation.content 
                                : expectation.content.length > 100 
                                  ? expectation.content.substring(0, 100) + '...' 
                                  : expectation.content
                            }
                          </p>
                            {expectation.content.length > 100 && (
                              <button 
                                className={styles.expandButton}
                                onClick={() => toggleExpectationExpansion(expectation.id)}
                              >
                                {expandedExpectations[expectation.id] ? '닫기' : '더보기'}
                              </button>
                            )}
                          </div>
                          
                          <div className={styles.expectationFooter}>
                            <div className={styles.expectationFooterLeft}>
                              <button 
                                className={`${styles.likeButton} ${expectationLikes[expectation.id] ? styles.liked : ''}`}
                                onClick={async () => {
                                  try {
                                    const result = await togglePerformanceReviewFavorite(expectation.id);
                                    setExpectationLikes(prev => ({
                                      ...prev,
                                      [expectation.id]: result
                                    }));
                                  } catch (err) {
                                    console.error('기대평 관심 토글 실패:', err);
                                  }
                                }}
                              >
                                {expectationLikes[expectation.id] ? '♥' : '♡'}
                              </button>
                              <span className={styles.expectationAuthor}>{expectation.author} | {expectation.date}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'venue' && (
            <div className={styles.venueContent}>
              <h3 className={styles.contentTitle}>공연장 정보</h3>
              {placeLoading ? (
                <div className={styles.venueLoading}>
                  <p>공연장 정보를 불러오는 중...</p>
                </div>
              ) : (
                <div className={styles.venueCard}>
                  {/* 지도 영역 */}
                  {(placeInfo?.latitude || placeInfo?.la) && (placeInfo?.longitude || placeInfo?.lo) && (
                    <div className={styles.venueMapArea}>
                      <PlaceMap
                        latitude={placeInfo?.latitude || placeInfo?.la}
                        longitude={placeInfo?.longitude || placeInfo?.lo}
                        placeName={placeInfo?.placeName || placeInfo?.name || performance?.venue || '공연장'}
                      />
                    </div>
                  )}
                  
                  <div className={styles.venueInfoItem}>
                    <div className={styles.venueInfoIcon}>🏛️</div>
                    <div className={styles.venueInfoContent}>
                      <div className={styles.venueInfoLabel}>공연장명</div>
                      <div className={styles.venueInfoValue}>
                        {placeInfo?.placeName || performance?.venue || '정보 없음'}
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.venueInfoItem}>
                    <div className={styles.venueInfoIcon}>📍</div>
                    <div className={styles.venueInfoContent}>
                      <div className={styles.venueInfoLabel}>주소</div>
                      <div className={styles.venueInfoValue}>
                        {placeInfo?.placeAddress || performance?.address || '정보 없음'}
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.venueInfoItem}>
                    <div className={styles.venueInfoIcon}>🚇</div>
                    <div className={styles.venueInfoContent}>
                      <div className={styles.venueInfoLabel}>교통편</div>
                      <div className={styles.venueInfoValue}>
                        {placeInfo?.transportation || '지하철 및 버스 이용 가능'}
                      </div>
                    </div>
                  </div>
                  
                  {placeId && (
                    <button
                      onClick={() => navigate(`/place/${placeId}`)}
                      className={styles.venueDetailButton}
                    >
                      공연장 상세 정보 보기
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 티켓 정보 입력 모달 */}
      {showTicketInfoModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>티켓 등록</h3>
              <button className={styles.closeButton} onClick={handleTicketInfoCancel}>×</button>
            </div>
            
            <div className={styles.writeForm}>
              {ticketStep === 'scan' ? (
                <>
                  {cameraStream ? (
                    <div className={styles.cameraArea}>
                      <video
                        ref={ticketVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className={styles.videoPreview}
                        onLoadedMetadata={() => {
                          if (ticketVideoRef.current) {
                            ticketVideoRef.current.play().catch(err => {
                              console.error('비디오 재생 실패:', err);
                            });
                          }
                        }}
                      />
                      <div className={styles.cameraControls}>
                        <button
                          className={styles.captureButton}
                          onClick={captureTicketPhoto}
                        >
                          촬영
                        </button>
                        <button
                          className={styles.cancelButton}
                          onClick={() => {
                            stopTicketCamera();
                            setIsScanning(false);
                          }}
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={styles.scanArea}>
                        <div className={styles.cameraIcon}>
                          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                            <circle cx="12" cy="13" r="4"/>
                          </svg>
                        </div>
                        <p className={styles.scanInstruction}>
                          티켓을 스캔하거나 사진을 업로드해주세요
                        </p>
                      </div>
                      <input
                        ref={ticketFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleTicketFileSelect}
                        style={{ display: 'none' }}
                      />
                      <button 
                        className={styles.primaryButton}
                        onClick={handleTicketCameraClick}
                        disabled={isScanning}
                      >
                        카메라로 촬영
                      </button>
                      <button 
                        className={styles.secondaryButton}
                        onClick={handleTicketFileClick}
                      >
                        파일에서 선택
                      </button>
                      <button 
                        className={styles.tertiaryButton}
                        onClick={handleSkipTicketScan}
                      >
                        직접 입력하기
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className={styles.ticketTitle}>티켓1 정보 입력</div>
                  {capturedImage && (
                    <div className={styles.imagePreview}>
                      <img src={capturedImage} alt="티켓 이미지" />
                    </div>
                  )}
                  
                  <div className={styles.ticketForm}>
                    <div className={styles.formGroup}>
                      <label>공연명</label>
                      <input
                        type="text"
                        value={performance?.title || ''}
                        disabled
                        style={{ backgroundColor: '#f9fafb', color: '#6b7280' }}
                      />
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>공연일자</label>
                        <input
                          type="date"
                          value={ticketInfo.performanceDate}
                          onChange={(e) => handleTicketInfoChange('performanceDate', e.target.value)}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>시간</label>
                        <input
                          type="time"
                          value={ticketInfo.performanceTime}
                          onChange={(e) => handleTicketInfoChange('performanceTime', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label>좌석정보</label>
                      <div className={styles.seatInputs}>
                        <input
                          type="text"
                          value={ticketInfo.section}
                          onChange={(e) => handleTicketInfoChange('section', e.target.value)}
                          placeholder="구역"
                          className={styles.seatInput}
                        />
                        <input
                          type="text"
                          value={ticketInfo.row}
                          onChange={(e) => handleTicketInfoChange('row', e.target.value)}
                          placeholder="열"
                          className={styles.seatInput}
                        />
                        <input
                          type="text"
                          value={ticketInfo.number}
                          onChange={(e) => handleTicketInfoChange('number', e.target.value)}
                          placeholder="번"
                          className={styles.seatInput}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.buttonGroup}>
                    <button 
                      type="button" 
                      className={styles.cancelButton} 
                      onClick={handleTicketInfoCancel}
                    >
                      취소
                    </button>
                    <button 
                      type="button" 
                      className={styles.primaryButton}
                      onClick={handleTicketInfoSubmit}
                    >
                      다음
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 글쓰기 모달 */}
      {showWriteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{writeType === 'review' ? '공연 후기 작성' : '기대평 작성'}</h3>
              <button className={styles.closeButton} onClick={handleWriteCancel}>×</button>
            </div>
            
            <form onSubmit={handleWriteSubmit} className={styles.writeForm}>
              <div className={styles.formGroup}>
                <label>제목</label>
                <input 
                  type="text" 
                  value={writeForm.title}
                  onChange={(e) => setWriteForm({...writeForm, title: e.target.value})}
                  placeholder="제목을 입력하세요"
                  required
                />
              </div>
              
              {writeType === 'review' && (
                <>
                  <div className={styles.formGroup}>
                    <label>티켓 선택</label>
                    <button
                      type="button"
                      className={styles.ticketSelectButton}
                      onClick={handleOpenTicketSelectModal}
                    >
                      {selectedTicket 
                        ? `선택된 티켓: ${selectedTicket.ticketId}번 티켓` 
                        : '티켓을 선택해주세요'}
                    </button>
                    {selectedTicket && (
                      <div className={styles.selectedTicketInfo}>
                        티켓 ID: {selectedTicket.ticketId}, 공연 ID: {selectedTicket.performanceId}
                      </div>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    <label>평점</label>
                    <div className={styles.ratingInput}>
                      {[1,2,3,4,5].map(star => (
                        <button 
                          key={star} 
                          type="button"
                          className={`${styles.ratingStar} ${star <= writeForm.rating ? styles.filled : ''}`}
                          onClick={() => setWriteForm({...writeForm, rating: star})}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              <div className={styles.formGroup}>
                <label>내용</label>
                <textarea 
                  value={writeForm.content}
                  onChange={(e) => setWriteForm({...writeForm, content: e.target.value})}
                  placeholder="내용을 입력하세요"
                  rows={6}
                  required
                />
              </div>
              
              <div className={styles.formActions}>
                <button type="button" className={styles.cancelButton} onClick={handleWriteCancel}>
                  취소
                </button>
                <button type="submit" className={styles.submitButton}>
                  작성하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 티켓 선택 모달 */}
      <TicketSelectModal
        isOpen={showTicketSelectModal}
        onClose={handleCloseTicketSelectModal}
        onSelectTicket={handleSelectTicket}
      />

      {/* 수정 모달 */}
      {showEditModal && editingReview && (
        <div className={styles.modalOverlay} onClick={handleCloseEditModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>리뷰 수정</h3>
              <button className={styles.closeButton} onClick={handleCloseEditModal}>×</button>
            </div>
            
            <form onSubmit={handleUpdateReview} className={styles.writeForm}>
              <div className={styles.formGroup}>
                <label>제목</label>
                <input 
                  type="text" 
                  value={editForm.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  placeholder="제목을 입력하세요"
                  required
                />
              </div>
              
              {/* 평점 - 기대평(EXPECTATION)일 때는 표시하지 않음 */}
              {editingReview.reviewType !== 'EXPECTATION' && (
                <div className={styles.formGroup}>
                  <label>평점</label>
                  <div className={styles.ratingInput}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button 
                        key={star} 
                        type="button"
                        className={`${styles.ratingStar} ${star <= editForm.rating ? styles.filled : ''}`}
                        onClick={() => setEditForm({...editForm, rating: star})}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className={styles.formGroup}>
                <label>내용</label>
                <textarea 
                  value={editForm.content}
                  onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                  placeholder="내용을 입력하세요"
                  required
                  rows={6}
                />
              </div>
              
              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={handleCloseEditModal}
                >
                  취소
                </button>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                >
                  수정하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailPerformancePage;
