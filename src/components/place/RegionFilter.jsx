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
  '서울': SEOUL_DISTRICTS,
  '경기': ['전체', '수원시', '성남시', '고양시', '용인시', '안양시', '과천시', '광명시', '부천시', '평택시'],
  '인천': ['전체', '중구', '동구', '미추홀구', '연수구', '남동구', '부평구', '계양구', '서구', '강화군', '옹진군'],
  '강원': ['전체', '춘천시', '원주시', '강릉시', '동해시', '태백시', '속초시', '삼척시', '홍천군', '횡성군'],
  '대전/충청': ['전체', '대전 동구', '대전 중구', '대전 서구', '대전 유성구', '대전 대덕구', '천안시', '청주시'],
  '대구': ['전체', '중구', '동구', '서구', '남구', '북구', '수성구', '달서구', '달성군'],
  '부산/울산': ['전체', '중구', '서구', '동구', '영도구', '부산진구', '동래구', '남구', '북구', '해운대구', '사하구', '금정구', '강서구', '연제구', '수영구', '사상구', '기장군', '울산 중구', '울산 남구', '울산 동구', '울산 북구', '울주군'],
  '경상': ['전체', '창원시', '김해시', '포항시', '경주시', '거제시', '양산시', '진주시', '통영시'],
  '광주/전라/제주': ['전체', '광주 동구', '광주 서구', '광주 남구', '광주 북구', '광주 광산구', '전주시', '익산시', '군산시', '여수시', '목포시', '순천시', '제주시', '서귀포시']
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
              <span className={styles.count}>({REGION_TO_DISTRICTS[region].length - 1})</span>
            </li>
          ))}
        </ul>

        <div className={styles.rightPanel}>
          <div className={styles.rightHeader}>
            <span className={styles.allLabel}>전체</span>
            <span className={styles.allCount}>({districts.length - 1})</span>
          </div>

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


