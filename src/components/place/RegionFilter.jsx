import React, { useState } from 'react';
import styles from './RegionFilter.module.css';

// 상위 지역 목록
const REGIONS = [
  '전체',
  '서울',
  '경기',
  '충청',
  '강원',
  '경상',
  '전라',
  '제주'
];

export default function RegionFilter({ onChange, selectedRegion: controlledRegion }) {
  // controlled component: selectedRegion이 전달되면 그것을 사용, 없으면 내부 state 사용
  const [internalRegion, setInternalRegion] = useState(REGIONS[0]);
  const selectedRegion = controlledRegion !== undefined ? controlledRegion : internalRegion;

  const handleRegionClick = (region) => {
    if (controlledRegion === undefined) {
      setInternalRegion(region);
    }
    if (onChange) onChange({ region, district: '전체' });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.filterBox}>
        <ul className={styles.leftTabs}>
          {REGIONS.map((region) => (
            <li
              key={region}
              className={region === selectedRegion ? `${styles.leftTab} ${styles.active}` : styles.leftTab}
              onClick={() => handleRegionClick(region)}
            >
              {region}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


