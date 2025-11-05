import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PlaceCard.module.css';

const PlaceCard = ({ id, name, region, district }) => {
  return (
    <li className={styles.placeItem}>
      <div className={styles.placeMeta}>
        <span className={styles.placeName}>{name}</span>
        <span className={styles.placeLoc}>{region} · {district}</span>
      </div>
      <Link className={styles.detailBtn} to={`/place/${id}`}>
        상세 보기
      </Link>
    </li>
  );
};

export default PlaceCard;

