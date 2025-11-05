import React from 'react';
import styles from './DetailPlacePage.module.css';
import PlaceShowHistory from '../../components/place/PlaceShowHistory';

const DetailPlacePage = () => {
  return (
    <div className={styles.container}>
      <h1>공연장 상세</h1>
      <p>선택한 공연장/장소의 상세 정보를 보여주는 페이지입니다.</p>
      <PlaceShowHistory />
    </div>
  );
};

export default DetailPlacePage;
