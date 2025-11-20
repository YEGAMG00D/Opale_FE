// src/components/cards/PlaceApiCard.jsx

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./PlaceApiCard.module.css";

const PlaceApiCard = ({
  id,
  name,
  address,
  telno,
  rating,
  reviewCount,
  stageCount,
  onClick
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onClick) {
      onClick(id);
    } else {
      navigate(`/place/${id}`);
    }
  };

  return (
    <li className={styles.placeItem} onClick={handleCardClick}>
      <div className={styles.placeMeta}>
        <span className={styles.placeName}>{name}</span>
        <div className={styles.placeDetails}>
          {address && <span className={styles.placeAddress}>{address}</span>}
          {telno && <span className={styles.placeTel}>{telno}</span>}
        </div>
        <div className={styles.placeInfo}>
          {stageCount !== undefined && (
            <span className={styles.stageCount}>공연관 {stageCount}개</span>
          )}
          <div className={styles.ratingRow}>
            <span className={styles.star}>★</span>
            <span className={styles.rating}>
              {typeof rating === 'number' ? rating.toFixed(1) : parseFloat(rating || 0).toFixed(1)}
            </span>
            <span className={styles.count}>({reviewCount || 0})</span>
          </div>
        </div>
      </div>
      <Link 
        className={styles.detailBtn} 
        to={`/place/${id}`}
        onClick={(e) => e.stopPropagation()}
      >
        상세 보기
      </Link>
    </li>
  );
};

export default PlaceApiCard;

