import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import styles from './DetailPerformancePage.module.css';
import PerformancePoster from '../../components/culture/PerformancePoster';
import PerformanceInfoCard from '../../components/culture/PerformanceInfoCard';
import PerformanceTrailer from '../../components/culture/PerformanceTrailer';
import PerformanceDetails from '../../components/culture/PerformanceDetails';
import BookingLinks from '../../components/culture/BookingLinks';
import OpenChatSection from '../../components/culture/OpenChatSection';
import ReviewCard from '../../components/culture/ReviewCard';
import wickedPoster from '../../assets/poster/wicked.gif';
import moulinRougePoster from '../../assets/poster/moulin-rouge.gif';
import kinkyBootsPoster from '../../assets/poster/kinky-boots.gif';
import hanbokManPoster from '../../assets/poster/hanbok-man.jpg';
import deathNotePoster from '../../assets/poster/death-note.gif';
import rentPoster from '../../assets/poster/rent.gif';

const DetailPerformancePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('reservation');
  const [isFavorite, setIsFavorite] = useState(false);
  const [expandedExpectations, setExpandedExpectations] = useState({});
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [writeType, setWriteType] = useState('review'); // 'review' or 'expectation'
  const [writeForm, setWriteForm] = useState({ title: '', content: '', rating: 5 });
  const [activeReviewTab, setActiveReviewTab] = useState('review'); // 'review' or 'expectation'

  // 샘플 후기 데이터
  const sampleReviews = [
    {
      id: 1,
      title: '위키드 관람 후기',
      content: '중력을 거슬러 저도 올라가고 싶어지네요. 엘파바의 목소리가 정말 감동적이었고, 글린다와의 우정도 아름다웠습니다. 특히 Defying Gravity 장면에서는 정말 소름이 돋았어요. 13년 만의 내한 공연이라 더욱 특별했던 것 같습니다. 외국인 관객들도 많아서 국제적인 분위기도 느낄 수 있었고, 뮤지컬을 통해 새로운 친구들도 만날 수 있어서 정말 좋았습니다.',
      rating: 4.5,
      author: '닉네임',
      date: '2025.11.20',
      performanceDate: '2025.11.05 19:00',
      seat: '1층-15열-중간'
    },
    {
      id: 2,
      title: '위키드 2차 관람 후기',
      content: '두 번째 관람이었는데도 여전히 감동적이었습니다. 이번에는 다른 배우분들의 연기를 보게 되어서 더욱 흥미로웠어요. 특히 글린다 역할의 배우분이 정말 귀여우면서도 깊이가 있었습니다.',
      rating: 5,
      author: '뮤지컬러버',
      date: '2025.11.18',
      performanceDate: '2025.11.10 14:00',
      seat: '2층-8열-왼쪽'
    }
  ];

  // 샘플 기대평 데이터
  const sampleExpectations = [
    {
      id: 1,
      title: '위키드 너무 기다렸어...',
      content: '위키드 너무 기다렸어... 중력을 거슬러 저도 올라가고 싶어지네요. It\'s time to fly defying gravity--- 정말 오랜만에 한국에서 공연한다고 해서 벌써부터 설레요. 원작 위키드를 한국에서 볼 수 있다니 꿈만 같아요. 엘파바와 글린다의 이야기가 어떻게 펼쳐질지 정말 기대됩니다!',
      author: '위키드팬',
      date: '2025.11.20'
    },
    {
      id: 2,
      title: '13년 만의 내한 공연!',
      content: '13년 만의 내한 공연이라니! 이번 기회를 놓치면 언제 또 볼 수 있을지 모르니까 꼭 가야겠어요. 특히 Defying Gravity 장면을 직접 보고 싶어요.',
      author: '뮤지컬매니아',
      date: '2025.11.19'
    }
  ];

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

  // ID를 숫자로 변환하고 공연 데이터 찾기
  const performanceId = parseInt(id, 10);
  const performance = allPerformances[performanceId] || allPerformances[1];
  
  // 포스터 이미지 매핑
  const posterImages = {
    'wicked': wickedPoster,
    'moulin-rouge': moulinRougePoster,
    'kinky-boots': kinkyBootsPoster,
    'hanbok-man': hanbokManPoster,
    'death-note': deathNotePoster,
    'rent': rentPoster
  };
  
  // 포스터 이미지가 없는 경우 기본 이미지 사용
  const getPosterImage = (imageName) => {
    return posterImages[imageName] || wickedPoster;
  };
  
  // 페이지 로드 시 로그 (디버깅용)
  useEffect(() => {
    console.log('DetailPerformancePage mounted with id:', id);
  }, [id]);

  const tabs = [
    { id: 'reservation', label: '예매정보' },
    { id: 'detail', label: '상세정보' },
    { id: 'review', label: '후기/기대평' },
    { id: 'venue', label: '공연장 정보' }
  ];

  const bookingSites = [
    { name: "티켓링크", logo: "TL" },
    { name: "네이버 예약", logo: "N", color: "#03C75A" },
    { name: "yes24", logo: "Y" },
    { name: "NOL", logo: "N" }
  ];

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const toggleExpectationExpansion = (expectationId) => {
    setExpandedExpectations(prev => ({
      ...prev,
      [expectationId]: !prev[expectationId]
    }));
  };

  const handleWriteClick = (type) => {
    setWriteType(type);
    setShowWriteModal(true);
  };

  const handleWriteSubmit = (e) => {
    e.preventDefault();
    // 여기서 실제 글 업로드 로직을 구현
    console.log('글 작성:', writeForm);
    setShowWriteModal(false);
    setWriteForm({ title: '', content: '', rating: 5 });
  };

  const handleWriteCancel = () => {
    setShowWriteModal(false);
    setWriteForm({ title: '', content: '', rating: 5 });
  };

  return (
    <div className={styles.container}>
      <PerformancePoster
        imageUrl={getPosterImage(performance.image)}
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
        trailerImage={performance.trailerImage}
      />

      <PerformanceDetails
        rating={performance.rating}
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

      <OpenChatSection performanceId={performanceId} />

      {/* Tabs */}
      <div className={styles.tabSection}>
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
                {performance.prices.map((price, index) => (
                  <div key={index} className={styles.priceItem}>
                    <span className={styles.seatType}>{price.seat}</span>
                    <span className={styles.seatPrice}>{price.price}</span>
                  </div>
                ))}
              </div>
              
              {/* 할인정보 섹션 */}
              <div className={styles.discountSection}>
                <h3 className={styles.contentTitle}>할인정보</h3>
                <div className={styles.infoPlaceholder}>
                  {/* 크롤링 정보 또는 이미지가 들어갈 공간 */}
                  <p className={styles.placeholderText}>할인 정보가 여기에 표시됩니다</p>
                </div>
              </div>

              {/* 캐스팅 섹션 */}
              <div className={styles.castingSection}>
                <h3 className={styles.contentTitle}>캐스팅</h3>
                <div className={styles.infoPlaceholder}>
                  {/* 크롤링 정보 또는 이미지가 들어갈 공간 */}
                  <p className={styles.placeholderText}>캐스팅 정보가 여기에 표시됩니다</p>
                </div>
              </div>

              {/* 좌석배치도 섹션 */}
              <div className={styles.seatingChartSection}>
                <h3 className={styles.contentTitle}>좌석배치도</h3>
                <div className={styles.infoPlaceholder}>
                  {/* 크롤링 정보 또는 이미지가 들어갈 공간 */}
                  <p className={styles.placeholderText}>좌석배치도 이미지가 여기에 표시됩니다</p>
                </div>
              </div>
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
              <div className={styles.productionImagesSection}>
                <h3 className={styles.contentTitle}>공연 소개</h3>
                <div className={styles.productionImagesContainer}>
                  {/* 제작사에서 제공하는 소개 이미지들이 들어갈 공간 */}
                  <div className={styles.imagePlaceholder}>
                    <p className={styles.placeholderText}>제작사 제공 소개 이미지가 여기에 표시됩니다</p>
                  </div>
                </div>
              </div>
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
                  
                  {sampleReviews.map(review => (
                    <ReviewCard
                      key={review.id}
                      id={review.id}
                      title={review.title}
                      performanceDate={review.performanceDate}
                      seat={review.seat}
                      rating={review.rating}
                      content={review.content}
                      author={review.author}
                      date={review.date}
                    />
                  ))}
                </div>
              )}

              {/* 기대평 목록 */}
              {activeReviewTab === 'expectation' && (
                <div className={styles.expectationList}>
                  <div className={styles.expectationListHeader}>
                    <h4>기대평 목록</h4>
                  </div>
                  
                  {sampleExpectations.map(expectation => (
                    <div key={expectation.id} className={styles.expectationItem}>
                      <div className={styles.expectationHeader}>
                        <h5 className={styles.expectationTitle}>{expectation.title}</h5>
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
                        <button className={styles.likeButton}>♡</button>
                        <span className={styles.expectationAuthor}>{expectation.author} | {expectation.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'venue' && (
            <div className={styles.venueContent}>
              <h3 className={styles.contentTitle}>공연장 정보</h3>
              <div className={styles.venueInfo}>
                <p><strong>공연장명:</strong> {performance.venue}</p>
                <p><strong>주소:</strong> {performance.address}</p>
                <p><strong>교통편:</strong> 지하철 및 버스 이용 가능</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 글쓰기 모달 */}
      {showWriteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{writeType === 'review' ? '후기 작성' : '기대평 작성'}</h3>
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
    </div>
  );
};

export default DetailPerformancePage;
