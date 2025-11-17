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
  const [showOngoingOnly, setShowOngoingOnly] = useState(false);
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
      category: "popular",
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
      category: "popular",
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
      category: "popular",
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
      category: "popular",
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
      category: "popular",
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
      category: "popular",
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
      category: "popular",
      status: "upcoming"
    },
    // 클래식/오페라 추가
    {
      id: 29,
      title: "베토벤 교향곡 9번",
      subtitle: "BEETHOVEN SYMPHONY NO.9",
      description: "베토벤의 불멸의 명작",
      date: "2025.03.15 ~ 2025.03.16",
      venue: "예술의전당 콘서트홀",
      image: "wicked", // 임시 이미지
      rating: 4.6,
      reviewCount: 178,
      keywords: ["클래식", "교향곡", "베토벤"],
      category: "classical",
      status: "upcoming"
    },
    {
      id: 30,
      title: "카르멘",
      subtitle: "CARMEN",
      description: "비제의 대표 오페라",
      date: "2025.04.10 ~ 2025.04.13",
      venue: "예술의전당 오페라하우스",
      image: "moulin-rouge", // 임시 이미지
      rating: 4.7,
      reviewCount: 201,
      keywords: ["오페라", "비제", "클래식"],
      category: "classical",
      status: "upcoming"
    },
    {
      id: 31,
      title: "모차르트 레퀴엠",
      subtitle: "MOZART REQUIEM",
      description: "모차르트의 마지막 작품",
      date: "2025.05.20 ~ 2025.05.21",
      venue: "세종문화회관 대극장",
      image: "kinky-boots", // 임시 이미지
      rating: 4.8,
      reviewCount: 156,
      keywords: ["클래식", "모차르트", "레퀴엠"],
      category: "classical",
      status: "upcoming"
    },
    {
      id: 32,
      title: "차이콥스키 발레 갈라",
      subtitle: "TCHAIKOVSKY BALLET GALA",
      description: "차이콥스키의 발레 명작 모음",
      date: "2024.12.10 ~ 2024.12.12",
      venue: "예술의전당 오페라하우스",
      image: "hanbok-man", // 임시 이미지
      rating: 4.9,
      reviewCount: 234,
      keywords: ["발레", "차이콥스키", "클래식"],
      category: "classical",
      status: "ended"
    },
    // 댄스/발레 추가
    {
      id: 33,
      title: "호두까기 인형",
      subtitle: "THE NUTCRACKER",
      description: "크리스마스의 대표 발레",
      date: "2025.12.15 ~ 2025.12.25",
      venue: "세종문화회관 대극장",
      image: "death-note", // 임시 이미지
      rating: 0,
      reviewCount: 0,
      keywords: ["발레", "크리스마스", "차이콥스키"],
      category: "classical",
      status: "upcoming"
    },
    {
      id: 34,
      title: "백조의 호수",
      subtitle: "SWAN LAKE",
      description: "차이콥스키의 대표 발레",
      date: "2025.06.01 ~ 2025.06.08",
      venue: "예술의전당 오페라하우스",
      image: "rent", // 임시 이미지
      rating: 0,
      reviewCount: 0,
      keywords: ["발레", "차이콥스키", "클래식"],
      category: "classical",
      status: "upcoming"
    },
    {
      id: 35,
      title: "현대무용 갈라",
      subtitle: "MODERN DANCE GALA",
      description: "한국 현대무용의 정수",
      date: "2025.03.20 ~ 2025.03.22",
      venue: "국립극장 달오름극장",
      image: "wicked", // 임시 이미지
      rating: 4.5,
      reviewCount: 123,
      keywords: ["현대무용", "댄스", "한국"],
      category: "traditional",
      status: "upcoming"
    },
    // 코미디 추가
    {
      id: 36,
      title: "코미디 페스티벌",
      subtitle: "COMEDY FESTIVAL 2025",
      description: "한국 최고의 코미디언들이 모인다",
      date: "2025.04.01 ~ 2025.04.06",
      venue: "올림픽공원 올림픽홀",
      image: "moulin-rouge", // 임시 이미지
      rating: 0,
      reviewCount: 0,
      keywords: ["코미디", "스탠드업", "페스티벌"],
      category: "play",
      status: "upcoming"
    },
    {
      id: 37,
      title: "개그콘서트 라이브",
      subtitle: "GAG CONCERT LIVE",
      description: "TV에서 만나던 개그콘서트를 무대에서",
      date: "2025.05.10 ~ 2025.05.11",
      venue: "잠실실내체육관",
      image: "kinky-boots", // 임시 이미지
      rating: 0,
      reviewCount: 0,
      keywords: ["코미디", "개그", "라이브"],
      category: "play",
      status: "upcoming"
    },
    {
      id: 38,
      title: "웃찾사 라이브",
      subtitle: "LAUGH OUT LOUD LIVE",
      description: "웃음이 터지는 스탠드업 코미디",
      date: "2024.11.20 ~ 2024.11.22",
      venue: "디큐브 링크아트센터",
      image: "hanbok-man", // 임시 이미지
      rating: 4.6,
      reviewCount: 189,
      keywords: ["코미디", "스탠드업", "웃음"],
      category: "play",
      status: "ended"
    },
    // 전통/국악 추가
    {
      id: 39,
      title: "판소리 명창 갈라",
      subtitle: "PANSORI MASTER GALA",
      description: "한국 전통 판소리의 정수",
      date: "2025.03.25 ~ 2025.03.26",
      venue: "국립국악원 예악당",
      image: "death-note", // 임시 이미지
      rating: 4.7,
      reviewCount: 145,
      keywords: ["국악", "판소리", "전통"],
      category: "traditional",
      status: "upcoming"
    },
    {
      id: 40,
      title: "사물놀이 페스티벌",
      subtitle: "SAMULNORI FESTIVAL",
      description: "한국 전통 타악기의 화려한 연주",
      date: "2025.05.15 ~ 2025.05.17",
      venue: "세종문화회관 대극장",
      image: "rent", // 임시 이미지
      rating: 0,
      reviewCount: 0,
      keywords: ["국악", "사물놀이", "타악기"],
      category: "traditional",
      status: "upcoming"
    },
    {
      id: 41,
      title: "국악 오케스트라",
      subtitle: "KOREAN TRADITIONAL ORCHESTRA",
      description: "전통과 현대가 만나는 국악",
      date: "2024.10.15 ~ 2024.10.16",
      venue: "예술의전당 콘서트홀",
      image: "wicked", // 임시 이미지
      rating: 4.5,
      reviewCount: 167,
      keywords: ["국악", "오케스트라", "전통"],
      category: "traditional",
      status: "ended"
    },
    // 어린이/가족 추가
    {
      id: 42,
      title: "인어공주 뮤지컬",
      subtitle: "THE LITTLE MERMAID MUSICAL",
      description: "어린이를 위한 뮤지컬",
      date: "2025.06.10 ~ 2025.08.31",
      venue: "디큐브 링크아트센터",
      image: "moulin-rouge", // 임시 이미지
      rating: 0,
      reviewCount: 0,
      keywords: ["어린이", "가족", "뮤지컬"],
      category: "musical",
      status: "upcoming"
    },
    {
      id: 43,
      title: "피터팬 어드벤처",
      subtitle: "PETER PAN ADVENTURE",
      description: "네버랜드로 떠나는 모험",
      date: "2025.07.01 ~ 2025.08.15",
      venue: "충무아트센터 대극장",
      image: "kinky-boots", // 임시 이미지
      rating: 0,
      reviewCount: 0,
      keywords: ["어린이", "가족", "모험"],
      category: "musical",
      status: "upcoming"
    },
    {
      id: 44,
      title: "뽀로로와 친구들",
      subtitle: "PORORO AND FRIENDS",
      description: "뽀롱뽀롱 뽀로로의 무대",
      date: "2025.05.01 ~ 2025.05.31",
      venue: "올림픽공원 올림픽홀",
      image: "hanbok-man", // 임시 이미지
      rating: 4.8,
      reviewCount: 312,
      keywords: ["어린이", "가족", "뽀로로"],
      category: "musical",
      status: "upcoming"
    },
    {
      id: 45,
      title: "신데렐라 뮤지컬",
      subtitle: "CINDERELLA MUSICAL",
      description: "어린이를 위한 클래식 뮤지컬",
      date: "2024.12.20 ~ 2025.01.05",
      venue: "세종문화회관 대극장",
      image: "death-note", // 임시 이미지
      rating: 4.6,
      reviewCount: 234,
      keywords: ["어린이", "가족", "뮤지컬"],
      category: "musical",
      status: "ongoing"
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
    { id: 'popular', label: '대중음악' },
    { id: 'classical', label: '서양음악(클래식)' },
    { id: 'traditional', label: '한국음악(국악)' }
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

  // 날짜 기반으로 진행중인 공연인지 확인하는 함수
  const isOngoingPerformance = (performance) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 날짜 문자열 파싱 (예: "2025.11.27~2026.02.22" 또는 "2025.7.12 Flying Soon")
    const dateStr = performance.date;
    
    // "Flying Soon" 같은 경우는 upcoming으로 처리
    if (dateStr.includes('Flying Soon') || dateStr.toLowerCase().includes('upcoming')) {
      return false;
    }
    
    // 날짜 범위 추출 (공백이나 - 로도 구분 가능)
    const separators = ['~', '-', ' '];
    let dateRange = [];
    
    for (const sep of separators) {
      if (dateStr.includes(sep)) {
        dateRange = dateStr.split(sep).map(d => d.trim()).filter(d => d.length > 0);
        if (dateRange.length >= 2) break;
      }
    }
    
    // 구분자가 없으면 단일 날짜로 처리
    if (dateRange.length === 0) {
      dateRange = [dateStr.trim()];
    }
    
    let startDate = null;
    let endDate = null;
    
    // 날짜 파싱 함수
    const parseDate = (dateString) => {
      // 점(.)을 제거하고 숫자만 추출
      const cleaned = dateString.replace(/[^\d]/g, '');
      if (cleaned.length < 6) return null;
      
      // YYYYMMDD 형식으로 변환
      let year, month, day;
      
      if (cleaned.length === 8) {
        // YYYYMMDD
        year = parseInt(cleaned.substring(0, 4));
        month = parseInt(cleaned.substring(4, 6)) - 1;
        day = parseInt(cleaned.substring(6, 8));
      } else if (cleaned.length >= 6) {
        // YYYYMM 또는 YYYYMMD
        year = parseInt(cleaned.substring(0, 4));
        month = parseInt(cleaned.substring(4, 6)) - 1;
        day = cleaned.length >= 7 ? parseInt(cleaned.substring(6)) : 1;
      } else {
        return null;
      }
      
      return new Date(year, month, day);
    };
    
    if (dateRange.length >= 2) {
      // 범위가 있는 경우
      startDate = parseDate(dateRange[0]);
      endDate = parseDate(dateRange[1]);
    } else if (dateRange.length === 1) {
      // 단일 날짜인 경우
      startDate = parseDate(dateRange[0]);
      endDate = startDate ? new Date(startDate) : null;
    }
    
    if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      // 날짜 파싱 실패 시 status 필드 사용
      return performance.status === 'ongoing';
    }
    
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    
    // 오늘이 시작일과 종료일 사이에 있는지 확인
    return today >= startDate && today <= endDate;
  };

  const filteredPerformances = useMemo(() => {
    let filtered = performances;
    
    // 카테고리 필터링
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(performance => performance.category === selectedCategory);
    }
    
    // 진행중인 공연만 보기 필터링
    if (showOngoingOnly) {
      filtered = filtered.filter(performance => isOngoingPerformance(performance));
    }
    
    return filtered;
  }, [selectedCategory, showOngoingOnly, performances]);

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
        
        {/* 진행중인 공연만 보기 체크박스 */}
        <div className={styles.ongoingFilter}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={showOngoingOnly}
              onChange={(e) => setShowOngoingOnly(e.target.checked)}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>진행중인 공연만 보기</span>
          </label>
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
