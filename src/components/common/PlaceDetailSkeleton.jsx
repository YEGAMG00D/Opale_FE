import React from 'react';
import SkeletonBox from './SkeletonBox';
import styles from './PlaceDetailSkeleton.module.css';

const PlaceDetailSkeleton = () => {
  return (
    <div className={styles.container}>
      {/* 헤더 섹션 */}
      <div className={styles.headerSection}>
        <SkeletonBox width="100px" height="24px" borderRadius="10px" className={styles.sectionTitle} />
        <SkeletonBox width="80%" height="32px" className={styles.title} />
        <SkeletonBox width="100%" height="18px" className={styles.address} />
        <div className={styles.headerTop}>
          <div className={styles.ratingRow}>
            <SkeletonBox width="100px" height="20px" />
          </div>
          <SkeletonBox width="60px" height="32px" borderRadius="6px" />
        </div>
      </div>

      {/* 시설 정보 섹션 */}
      <div className={styles.facilitySection}>
        <div className={styles.facilityInfoContainer}>
          <div className={styles.facilityInfoTable}>
            <SkeletonBox width="100%" height="200px" borderRadius="8px" />
          </div>
          <div className={styles.mapArea}>
            <SkeletonBox width="100%" height="200px" borderRadius="8px" />
          </div>
        </div>
        <button className={styles.facilityDetailsButton}>
          <SkeletonBox width="100%" height="60px" borderRadius="8px" />
        </button>
      </div>

      {/* 공연관 정보 섹션 */}
      <div className={styles.stageSection}>
        <div className={styles.sectionHeader}>
          <SkeletonBox width="120px" height="28px" />
        </div>
      </div>

      {/* 관련 공연 섹션 */}
      <div className={styles.showHistorySection}>
        <div className={styles.sectionHeader}>
          <SkeletonBox width="150px" height="28px" />
        </div>
        <div className={styles.showHistoryContent}>
          <SkeletonBox width="100%" height="150px" borderRadius="8px" />
        </div>
      </div>

      {/* 후기 섹션 */}
      <div className={styles.reviewSection}>
        <div className={styles.sectionHeader}>
          <SkeletonBox width="100px" height="28px" />
        </div>
        <div className={styles.writeButtonContainer}>
          <SkeletonBox width="120px" height="40px" borderRadius="8px" />
        </div>
        <div className={styles.reviewList}>
          <div className={styles.reviewListHeader}>
            <SkeletonBox width="80px" height="20px" />
            <SkeletonBox width="60px" height="16px" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.reviewCard}>
              <SkeletonBox width="70%" height="20px" className={styles.reviewTitle} />
              <SkeletonBox width="100px" height="16px" className={styles.reviewRating} />
              <SkeletonBox width="100%" height="16px" className={styles.reviewContent} />
              <SkeletonBox width="90%" height="16px" className={styles.reviewContent} />
              <SkeletonBox width="60%" height="16px" className={styles.reviewContent} />
              <SkeletonBox width="120px" height="14px" className={styles.reviewAuthor} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaceDetailSkeleton;

