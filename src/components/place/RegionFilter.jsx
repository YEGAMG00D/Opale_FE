import React, { useMemo, useState } from 'react';
import styles from './RegionFilter.module.css';

// 지역/구군 더미 데이터. 실제 API 연동 시 이 구조를 그대로 사용하면 됩니다.
const REGION_TO_DISTRICTS = {
  '서울': [
    '전체', '강남', '강변', '건대입구', '고덕강일', '구로', '대학로', '동대문', '등촌', '명동', '상암', '서초', '송파', '신촌', '영등포', '용산', '종로'
  ],
  '경기': ['전체', '수원', '성남', '고양', '용인', '안양', '과천', '광명', '부천', '평택'],
  '인천': ['전체', '부평', '송도', '연수', '논현'],
  '강원': ['전체', '춘천', '원주', '강릉'],
  '대전/충청': ['전체', '대전', '천안', '청주'],
  '대구': ['전체', '중구', '수성', '동성로'],
  '부산/울산': ['전체', '해운대', '센텀', '남포', '사상', '울산'],
  '경상': ['전체', '창원', '김해', '포항', '경주'],
  '광주/전라/제주': ['전체', '광주', '전주', '여수', '제주']
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
      <div className={styles.searchRow}>
        <input className={styles.searchInput} placeholder="극장명을 입력해주세요" />
        <button className={styles.searchBtn} aria-label="search">🔍</button>
      </div>

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


