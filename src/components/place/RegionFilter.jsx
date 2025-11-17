import React, { useMemo, useState } from 'react';
import styles from './RegionFilter.module.css';

// 관할구역 목록 (서울시 25개 구)
const SEOUL_DISTRICTS = [
  '전체',
  '종로구', '중구', '용산구', '성동구', '광진구',
  '동대문구', '중랑구', '성북구', '강북구', '도봉구',
  '노원구', '은평구', '서대문구', '마포구', '양천구',
  '강서구', '구로구', '금천구', '영등포구', '동작구',
  '관악구', '서초구', '강남구', '송파구', '강동구'
];

// 지역별 관할구역 그룹핑 (실제 API 연동 시 이 구조를 그대로 사용하면 됩니다)
const REGION_TO_DISTRICTS = {
  '전체': ['전체'],

  '서울': SEOUL_DISTRICTS,

  '경기': [
    '전체',
    '수원시', '성남시', '고양시', '용인시', '부천시', '안산시',
    '안양시', '평택시', '광명시', '하남시', '의정부시',
    '파주시', '김포시', '시흥시', '구리시', '남양주시'
  ],

  '충청': [
    '전체',
    // 충청북도
    '청주시', '제천시', '충주시',
    // 충청남도
    '천안시', '아산시', '공주시', '논산시',
    // 대전
    '대전 동구', '대전 중구', '대전 서구', '대전 유성구', '대전 대덕구',
    // 세종
    '세종시'
  ],

  '강원': [
    '전체',
    '춘천시', '원주시', '강릉시', '동해시', '속초시', '삼척시', '홍천군', '횡성군'
  ],

  '경상': [
    '전체',
    // 경상북도
    '포항시', '경주시', '김천시', '안동시', '구미시', '영주시', '상주시', '문경시',
    // 경상남도
    '창원시', '진주시', '통영시', '사천시', '김해시', '밀양시', '거제시', '양산시',
    // 대구
    '대구 중구', '대구 동구', '대구 서구', '대구 남구', '대구 북구', '수성구', '달서구',
    // 부산 + 울산
    '부산 중구', '부산 해운대구', '부산 남구', '부산 동래구', '부산 사하구',
    '울산 중구', '울산 남구', '울산 동구', '울산 북구', '울주군'
  ],

  '전라': [
    '전체',
    // 광주
    '광주 동구', '광주 서구', '광주 남구', '광주 북구', '광주 광산구',
    // 전라북도
    '전주시', '군산시', '익산시', '정읍시', '남원시', '김제시',
    // 전라남도
    '목포시', '여수시', '순천시', '나주시', '광양시'
  ],

  '제주': [
    '전체',
    '제주시', '서귀포시'
  ],
};

const LEFT_REGIONS = Object.keys(REGION_TO_DISTRICTS);

export default function RegionFilter({ onChange }) {
  const [selectedRegion, setSelectedRegion] = useState(LEFT_REGIONS[0]);
  const [selectedDistrict, setSelectedDistrict] = useState('전체');

  const districts = useMemo(() => REGION_TO_DISTRICTS[selectedRegion] ?? ['전체'], [selectedRegion]);

  const handleRegionClick = (region) => {
    setSelectedRegion(region);
    setSelectedDistrict('전체');
    if (onChange) onChange({ region, district: '전체' });
  };

  const handleDistrictClick = (district) => {
    setSelectedDistrict(district);
    if (onChange) onChange({ region: selectedRegion, district });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.filterBox}>
        <ul className={styles.leftTabs}>
          {LEFT_REGIONS.map((region) => (
            <li
              key={region}
              className={region === selectedRegion ? `${styles.leftTab} ${styles.active}` : styles.leftTab}
              onClick={() => handleRegionClick(region)}
            >
              {region}
            </li>
          ))}
        </ul>

        <div className={styles.rightPanel}>
          <ul className={styles.districtList}>
            {districts.map((d) => (
              <li
                key={d}
                className={d === selectedDistrict ? `${styles.districtItem} ${styles.selected}` : styles.districtItem}
                onClick={() => handleDistrictClick(d)}
              >
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}


