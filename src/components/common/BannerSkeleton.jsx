import React from 'react';
import SkeletonBox from './SkeletonBox';
import styles from './BannerSkeleton.module.css';

const BannerSkeleton = () => {
  return (
    <section className={styles.carouselSection}>
      <div className={styles.carouselContainer}>
        <div className={styles.carouselTrack}>
          <div className={styles.carouselSlide}>
            <div className={styles.poster}>
              <SkeletonBox width="100%" height="100%" borderRadius="0" className={styles.posterImg} />
              <div className={styles.posterOverlay}></div>
              <div className={styles.posterContent}>
                <SkeletonBox width="60%" height="20px" borderRadius="4px" className={styles.tagline} />
                <SkeletonBox width="80%" height="32px" borderRadius="4px" className={styles.title} />
                <SkeletonBox width="70%" height="18px" borderRadius="4px" className={styles.description} />
                <SkeletonBox width="50%" height="16px" borderRadius="4px" className={styles.date} />
                <SkeletonBox width="45%" height="16px" borderRadius="4px" className={styles.venue} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 인디케이터 스켈레톤 */}
      <div className={styles.carouselIndicators}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.indicator}></div>
        ))}
      </div>
    </section>
  );
};

export default BannerSkeleton;




