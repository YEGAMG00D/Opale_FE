import React from 'react';
import SkeletonBox from './SkeletonBox';
import styles from './PerformanceDetailSkeleton.module.css';

const PerformanceDetailSkeleton = () => {
  return (
    <div className={styles.container}>
      {/* 포스터 영역 */}
      <div className={styles.posterSection}>
        <SkeletonBox width="100%" height="280px" borderRadius="0" />
      </div>

      {/* 정보 카드 영역 */}
      <div className={styles.infoCardSection}>
        <SkeletonBox width="60px" height="20px" borderRadius="10px" className={styles.categoryTag} />
        <SkeletonBox width="80%" height="28px" className={styles.title} />
        <SkeletonBox width="60%" height="20px" className={styles.englishTitle} />
        
        <div className={styles.infoRow}>
          <SkeletonBox width="100px" height="16px" />
          <SkeletonBox width="200px" height="16px" />
        </div>
        <div className={styles.infoRow}>
          <SkeletonBox width="100px" height="16px" />
          <SkeletonBox width="200px" height="16px" />
        </div>
        <div className={styles.infoRow}>
          <SkeletonBox width="100px" height="16px" />
          <SkeletonBox width="200px" height="16px" />
        </div>
      </div>

      {/* 트레일러 영역 */}
      <div className={styles.trailerSection}>
        <SkeletonBox width="100%" height="200px" />
      </div>

      {/* 상세 정보 영역 */}
      <div className={styles.detailsSection}>
        <div className={styles.ratingRow}>
          <SkeletonBox width="120px" height="24px" />
          <SkeletonBox width="80px" height="16px" />
        </div>
        <div className={styles.hashtags}>
          <SkeletonBox width="150px" height="24px" borderRadius="12px" />
          <SkeletonBox width="120px" height="24px" borderRadius="12px" />
          <SkeletonBox width="100px" height="24px" borderRadius="12px" />
        </div>
        <SkeletonBox width="100%" height="16px" className={styles.description} />
        <SkeletonBox width="90%" height="16px" className={styles.description} />
        <SkeletonBox width="85%" height="16px" className={styles.description} />
      </div>

      {/* 예매 링크 영역 */}
      <div className={styles.bookingSection}>
        <SkeletonBox width="100%" height="60px" borderRadius="8px" />
      </div>

      {/* 추천 버튼 영역 */}
      <div className={styles.recommendSection}>
        <SkeletonBox width="100%" height="50px" borderRadius="8px" />
      </div>

      {/* 오픈채팅 영역 */}
      <div className={styles.chatSection}>
        <SkeletonBox width="100%" height="120px" borderRadius="8px" />
      </div>

      {/* 탭 영역 */}
      <div className={styles.tabSection}>
        <div className={styles.tabs}>
          <SkeletonBox width="80px" height="40px" borderRadius="4px" />
          <SkeletonBox width="80px" height="40px" borderRadius="4px" />
          <SkeletonBox width="100px" height="40px" borderRadius="4px" />
          <SkeletonBox width="100px" height="40px" borderRadius="4px" />
        </div>
        <div className={styles.tabContent}>
          <SkeletonBox width="100%" height="200px" />
        </div>
      </div>
    </div>
  );
};

export default PerformanceDetailSkeleton;

