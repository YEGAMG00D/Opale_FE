// KOPIS DB 구조에 맞춘 공연장 데이터
// 실제 API 연동 시 이 구조를 그대로 사용하면 됩니다.
import wickedPoster from '../assets/poster/wicked.gif';
import moulinRougePoster from '../assets/poster/moulin-rouge.gif';
import kinkyBootsPoster from '../assets/poster/kinky-boots.gif';
import hanbokManPoster from '../assets/poster/hanbok-man.jpg';
import deathNotePoster from '../assets/poster/death-note.gif';
import rentPoster from '../assets/poster/rent.gif';

export const PLACE_DATA = {
  1: {
    id: 1,
    name: '유니플렉스',
    openingYear: '2013년',
    facilityType: '민간(대학로)',
    totalSeats: 1049,
    numberOfStages: 3,
    homepage: 'http://www.uniplex.co.kr/',
    address: '서울특별시 종로구 대학로12길 64 (동숭동)',
    district: '종로구',
    convenienceFacilities: ['카페'],
    parkingFacilities: ['자체'],
    lastModified: '2023.09.18 16:06:36',
    stages: [
      {
        id: 1,
        name: '1관(대극장)',
        registered: true,
        seats: 599,
        stageFacilities: ['분장실']
      },
      {
        id: 2,
        name: '2관(중극장)',
        registered: true,
        seats: 269,
        stageFacilities: ['분장실']
      },
      {
        id: 3,
        name: '3관(소극장)',
        registered: true,
        seats: 181,
        stageFacilities: ['분장실']
      }
    ],
    relatedPerformances: [
      {
        id: 101,
        type: '뮤지컬',
        title: '빨래: 31차 프로덕션',
        period: '2025.10.03 ~ 2025.11.30',
        venue: '유니플렉스 2관(중극장)',
        cast: '',
        production: '(주)씨에이치수박',
        poster: deathNotePoster
      }
    ]
  },
  2: {
    id: 2,
    name: '마포아트센터',
    openingYear: '2015년',
    facilityType: '공공(마포구)',
    totalSeats: 856,
    numberOfStages: 2,
    homepage: 'http://www.mapoartcenter.co.kr/',
    address: '서울특별시 마포구 월드컵북로 396',
    district: '마포구',
    convenienceFacilities: ['카페', '편의점'],
    parkingFacilities: ['자체', '공영'],
    lastModified: '2023.10.15 14:20:12',
    stages: [
      {
        id: 1,
        name: '아트홀',
        registered: true,
        seats: 650,
        stageFacilities: ['분장실', '연습실']
      },
      {
        id: 2,
        name: '소극장',
        registered: true,
        seats: 206,
        stageFacilities: ['분장실']
      }
    ],
    relatedPerformances: [
      {
        id: 201,
        type: '연극',
        title: '햄릿',
        period: '2025.11.01 ~ 2025.12.15',
        venue: '마포아트센터 아트홀',
        cast: '김영배, 이소연',
        production: '(주)마포문화재단',
        poster: wickedPoster
      }
    ]
  },
  3: {
    id: 3,
    name: '관악문화예술회관',
    openingYear: '2010년',
    facilityType: '공공(관악구)',
    totalSeats: 1200,
    numberOfStages: 3,
    homepage: 'http://www.gwanak.go.kr/art/',
    address: '서울특별시 관악구 관악로 145',
    district: '관악구',
    convenienceFacilities: ['카페', '서점'],
    parkingFacilities: ['자체'],
    lastModified: '2023.08.22 11:30:45',
    stages: [
      {
        id: 1,
        name: '대공연장',
        registered: true,
        seats: 800,
        stageFacilities: ['분장실', '연습실', '오케스트라 피트']
      },
      {
        id: 2,
        name: '소공연장',
        registered: true,
        seats: 300,
        stageFacilities: ['분장실']
      },
      {
        id: 3,
        name: '다목적홀',
        registered: true,
        seats: 100,
        stageFacilities: []
      }
    ],
    relatedPerformances: [
      {
        id: 301,
        type: '뮤지컬',
        title: '위키드',
        period: '2025.09.01 ~ 2026.01.05',
        venue: '관악문화예술회관 대공연장',
        cast: '김선아, 박혜진',
        production: '(주)씨제이엔터테인먼트',
        poster: wickedPoster
      },
      {
        id: 302,
        type: '연극',
        title: '한복입은 남자',
        period: '2025.10.01 ~ 2025.11.30',
        venue: '관악문화예술회관 소공연장',
        cast: '정우성, 전지현',
        production: '(주)드라마하우스',
        poster: hanbokManPoster
      }
    ]
  },
  4: {
    id: 4,
    name: '성북문화예술회관',
    openingYear: '2012년',
    facilityType: '공공(성북구)',
    totalSeats: 720,
    numberOfStages: 2,
    homepage: 'http://www.sbcf.or.kr/',
    address: '서울특별시 성북구 종암로 153',
    district: '성북구',
    convenienceFacilities: ['카페'],
    parkingFacilities: ['자체'],
    lastModified: '2023.09.05 09:15:30',
    stages: [
      {
        id: 1,
        name: '대극장',
        registered: true,
        seats: 520,
        stageFacilities: ['분장실', '연습실']
      },
      {
        id: 2,
        name: '소극장',
        registered: true,
        seats: 200,
        stageFacilities: ['분장실']
      }
    ],
    relatedPerformances: [
      {
        id: 401,
        type: '뮤지컬',
        title: '렌트',
        period: '2025.05.10 ~ 2025.08.20',
        venue: '성북문화예술회관 대극장',
        cast: '이동휘, 아이유',
        production: '(주)에스엔컴퍼니',
        poster: rentPoster
      }
    ]
  },
  5: {
    id: 5,
    name: '강남아트센터',
    openingYear: '2018년',
    facilityType: '민간(강남)',
    totalSeats: 1500,
    numberOfStages: 4,
    homepage: 'http://www.gangnamart.co.kr/',
    address: '서울특별시 강남구 테헤란로 521',
    district: '강남구',
    convenienceFacilities: ['카페', '레스토랑', '편의점'],
    parkingFacilities: ['자체', '유료'],
    lastModified: '2023.11.10 16:45:22',
    stages: [
      {
        id: 1,
        name: '그랜드홀',
        registered: true,
        seats: 1000,
        stageFacilities: ['분장실', '연습실', '오케스트라 피트']
      },
      {
        id: 2,
        name: '아트홀',
        registered: true,
        seats: 350,
        stageFacilities: ['분장실', '연습실']
      },
      {
        id: 3,
        name: '스튜디오',
        registered: true,
        seats: 100,
        stageFacilities: ['분장실']
      },
      {
        id: 4,
        name: '갤러리',
        registered: false,
        seats: 50,
        stageFacilities: []
      }
    ],
    relatedPerformances: [
      {
        id: 501,
        type: '뮤지컬',
        title: '물랑루즈',
        period: '2024.12.01 ~ 2025.03.20',
        venue: '강남아트센터 그랜드홀',
        cast: '조승우, 수지',
        production: '(주)샤피엔터테인먼트',
        poster: moulinRougePoster
      },
      {
        id: 502,
        type: '뮤지컬',
        title: '킹키부츠',
        period: '2025.06.01 ~ 2025.08.31',
        venue: '강남아트센터 아트홀',
        cast: '정성화, 박은태',
        production: '(주)씨제이엔터테인먼트',
        poster: kinkyBootsPoster
      }
    ]
  }
};

// 관할구역별 공연장 목록
export const PLACES_BY_DISTRICT = {
  '종로구': [1],
  '마포구': [2],
  '관악구': [3],
  '성북구': [4],
  '강남구': [5],
  '서초구': [],
  '송파구': [],
  '강동구': [],
  '영등포구': [],
  '용산구': [],
  '은평구': [],
  '서대문구': [],
  '중구': [],
  '중랑구': [],
  '노원구': [],
  '도봉구': [],
  '강북구': [],
  '광진구': [],
  '동대문구': [],
  '성동구': [],
  '강서구': [],
  '구로구': [],
  '금천구': [],
  '양천구': []
};

// 공연장 ID로 데이터 가져오기
export const getPlaceById = (id) => {
  return PLACE_DATA[id] || null;
};

// 관할구역별 공연장 목록 가져오기
export const getPlacesByDistrict = (district) => {
  const placeIds = PLACES_BY_DISTRICT[district] || [];
  return placeIds.map(id => PLACE_DATA[id]).filter(Boolean);
};

// 모든 관할구역 목록
export const getAllDistricts = () => {
  return Object.keys(PLACES_BY_DISTRICT);
};

