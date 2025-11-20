// src/components/cards/PlaceWithPerformancesCard.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { usePlacePerformances } from "../../hooks/usePlacePerformances";
import styles from "./PlaceWithPerformancesCard.module.css";

const PlaceWithPerformancesCard = ({
  id,
  name,
  address,
  telno,
  rating,
  reviewCount,
  stageCount,
  distance,
  onClick
}) => {
  const navigate = useNavigate();
  const { performances, loading: performancesLoading } = usePlacePerformances(id);

  const handleCardClick = () => {
    if (onClick) {
      onClick(id);
    } else {
      navigate(`/place/${id}`);
    }
  };

  const handlePerformanceClick = (e, performanceId) => {
    e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
    navigate(`/culture/${performanceId}`);
  };

  // 현재 상연중인 공연만 필터링 (날짜 기준)
  const currentPerformances = performances.filter((perf) => {
    if (!perf.startDate || !perf.endDate) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const start = new Date(perf.startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(perf.endDate);
    end.setHours(0, 0, 0, 0);
    
    // 오늘 날짜가 시작일과 종료일 사이에 있으면 현재 상연중
    return today >= start && today <= end;
  });

  // 거리 포맷팅 (m를 km로 변환)
  const formatDistance = (distanceInMeters) => {
    if (!distanceInMeters || distanceInMeters === null) return null;
    
    // 1000m 미만일 때는 정수로 반올림하여 표시
    if (distanceInMeters < 1000) {
      return `${Math.round(distanceInMeters)}m`;
    }
    
    // 1000m 이상일 때는 km로 변환하여 소수점 한자리로 표시
    return `${(distanceInMeters / 1000).toFixed(1)}km`;
  };

  return (
    <li className={styles.placeItem} onClick={handleCardClick}>
      <div className={styles.placeMeta}>
        <div className={styles.placeNameRow}>
          <div className={styles.placeNameWithRating}>
            <span className={styles.placeName}>{name}</span>
            <div className={styles.ratingRow}>
              <span className={styles.star}>★</span>
              <span className={styles.rating}>
                {typeof rating === 'number' ? rating.toFixed(1) : parseFloat(rating || 0).toFixed(1)}
              </span>
              <span className={styles.count}>({reviewCount || 0})</span>
            </div>
          </div>
          {distance !== null && distance !== undefined && (
            <div className={styles.distance}>
              {formatDistance(distance)}
            </div>
          )}
        </div>
        <div className={styles.placeDetails}>
          {address && <span className={styles.placeAddress}>{address}</span>}
          {telno && <span className={styles.placeTel}>{telno}</span>}
        </div>
        
        {/* 현재 상연중인 공연 포스터 섹션 */}
        {currentPerformances.length > 0 && (
          <div className={styles.performancesSection}>
            <div className={styles.performancesLabel}>현재 상연중</div>
            <div className={styles.performancesScroll}>
              {performancesLoading ? (
                <div className={styles.loadingText}>공연 정보를 불러오는 중...</div>
              ) : (
                <div className={styles.performancesList}>
                  {currentPerformances.map((performance) => (
                    <div
                      key={performance.id}
                      className={styles.posterItem}
                      onClick={(e) => handlePerformanceClick(e, performance.id)}
                    >
                      <img
                        className={styles.posterImg}
                        src={performance.poster || '/placeholder-poster.png'}
                        alt={performance.title || '공연 포스터'}
                        onError={(e) => {
                          e.target.src = '/placeholder-poster.png';
                        }}
                      />
                      {performance.title && (
                        <div className={styles.posterTitle}>{performance.title}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </li>
  );
};

export default PlaceWithPerformancesCard;

