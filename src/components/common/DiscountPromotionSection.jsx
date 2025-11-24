import React from 'react';
import styles from './DiscountPromotionSection.module.css';

const DiscountPromotionSection = ({ nolTicketData = [], timeTicketData = [] }) => {
  return (
    <section className={styles.promotionSection}>
      {/* Nol ticket 영역 */}
      <div className={styles.promotionBlock}>
        <h2 className={styles.promotionTitle}>Nol ticket : 할인 프로모션</h2>
        <div className={styles.promotionList}>
          {nolTicketData.length > 0 ? (
            nolTicketData.map((item, index) => (
              <div key={index} className={styles.promotionItem}>
                {/* 데이터 구조에 맞게 렌더링 */}
                {JSON.stringify(item)}
              </div>
            ))
          ) : (
            <div className={styles.emptyMessage}>할인 정보가 없습니다.</div>
          )}
        </div>
      </div>

      {/* 타임티켓 영역 */}
      <div className={styles.promotionBlock}>
        <h2 className={styles.promotionTitle}>타임티켓 : 할인 프로모션</h2>
        <div className={styles.promotionList}>
          {timeTicketData.length > 0 ? (
            timeTicketData.map((item, index) => (
              <div key={index} className={styles.promotionItem}>
                {/* 데이터 구조에 맞게 렌더링 */}
                {JSON.stringify(item)}
              </div>
            ))
          ) : (
            <div className={styles.emptyMessage}>할인 정보가 없습니다.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DiscountPromotionSection;

