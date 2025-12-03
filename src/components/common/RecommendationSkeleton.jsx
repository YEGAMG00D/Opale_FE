import React from 'react';
import SkeletonBox from './SkeletonBox';
import styles from './RecommendationSkeleton.module.css';

const RecommendationSkeleton = () => {
  return (
    <div className={styles.container}>
      {/* 슬라이더 컨테이너 */}
      <div className={styles.sliderContainer}>
        <div className={styles.sliderTrack}>
          {/* 공연 카드 스켈레톤 4개 (가운데 온전한 2개 + 양쪽 반쪽씩) */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.slideCard}>
              {/* 포스터 - 실제 크기: 240px 높이 */}
              <SkeletonBox width="100%" height="240px" borderRadius="8px" className={styles.poster} />
              
              {/* 카드 정보 */}
              <div className={styles.cardInfo}>
                {/* 제목 - 실제: 14px, font-weight: 600 */}
                <SkeletonBox width="90%" height="16px" className={styles.title} />
                
                {/* 날짜(부제목) - 실제: 12px, color: #666666 */}
                <SkeletonBox width="70%" height="14px" className={styles.subtitle} />
                
                {/* 평점 - 실제: 11px */}
                <div className={styles.ratingRow}>
                  <SkeletonBox width="80px" height="13px" />
                </div>
                
                {/* 키워드 - 실제: 10px, 작은 태그 */}
                <div className={styles.keywords}>
                  <SkeletonBox width="50px" height="18px" borderRadius="10px" />
                  <SkeletonBox width="45px" height="18px" borderRadius="10px" />
                  <SkeletonBox width="55px" height="18px" borderRadius="10px" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 슬라이드 인디케이터 */}
      <div className={styles.indicators}>
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonBox key={i} width="8px" height="8px" borderRadius="50%" className={styles.indicator} />
        ))}
      </div>
    </div>
  );
};

export default RecommendationSkeleton;

