import React, { useState, useEffect } from 'react';
import { fetchInterparkDiscounts, fetchTimeticketDiscounts } from '../../api/discountApi';
import { normalizeDiscountItem } from '../../services/normalizeDiscount';
import DiscountCard from '../cards/DiscountCard';
import LoadingSpinner from './LoadingSpinner';
import styles from './DiscountPromotionSection.module.css';

const DiscountPromotionSection = () => {
  const [interparkData, setInterparkData] = useState([]);
  const [timeticketData, setTimeticketData] = useState([]);
  const [isLoadingInterpark, setIsLoadingInterpark] = useState(true);
  const [isLoadingTimeticket, setIsLoadingTimeticket] = useState(true);
  const [errorInterpark, setErrorInterpark] = useState(null);
  const [errorTimeticket, setErrorTimeticket] = useState(null);

  // 인터파크 할인 공연 조회
  useEffect(() => {
    const loadInterparkDiscounts = async () => {
      try {
        setIsLoadingInterpark(true);
        setErrorInterpark(null);
        const response = await fetchInterparkDiscounts();
        // discountApi.js에서 이미 normalizeDiscountList를 거쳐서 { totalCount, items } 형태로 반환됨
        // 각 아이템을 normalizeDiscountItem으로 정제
        const normalizedItems = (response.items || [])
          .map(normalizeDiscountItem)
          .filter(item => item !== null);
        setInterparkData(normalizedItems);
      } catch (err) {
        console.error('인터파크 할인 조회 오류:', err);
        setErrorInterpark(err.message || '할인 정보를 불러오는데 실패했습니다.');
        setInterparkData([]);
      } finally {
        setIsLoadingInterpark(false);
      }
    };

    loadInterparkDiscounts();
  }, []);

  // 타임티켓 할인 공연 조회
  useEffect(() => {
    const loadTimeticketDiscounts = async () => {
      try {
        setIsLoadingTimeticket(true);
        setErrorTimeticket(null);
        const response = await fetchTimeticketDiscounts();
        // discountApi.js에서 이미 normalizeDiscountList를 거쳐서 { totalCount, items } 형태로 반환됨
        // 각 아이템을 normalizeDiscountItem으로 정제
        const normalizedItems = (response.items || [])
          .map(normalizeDiscountItem)
          .filter(item => item !== null);
        setTimeticketData(normalizedItems);
      } catch (err) {
        console.error('타임티켓 할인 조회 오류:', err);
        setErrorTimeticket(err.message || '할인 정보를 불러오는데 실패했습니다.');
        setTimeticketData([]);
      } finally {
        setIsLoadingTimeticket(false);
      }
    };

    loadTimeticketDiscounts();
  }, []);

  return (
    <section className={styles.promotionSection}>
      {/* 인터파크 영역 */}
      <div className={styles.promotionBlock}>
        <h2 className={styles.promotionTitle}>Nol ticket : 할인 프로모션</h2>
        {isLoadingInterpark ? (
          <div className={styles.loadingContainer}>
            <LoadingSpinner />
          </div>
        ) : errorInterpark ? (
          <div className={styles.errorMessage}>{errorInterpark}</div>
        ) : interparkData.length > 0 ? (
          <div className={styles.promotionList}>
            {interparkData.map((item, index) => (
              <DiscountCard
                key={index}
                title={item.title}
                venue={item.venue}
                imageUrl={item.imageUrl}
                saleType={item.saleType}
                discountPercent={item.discountPercent}
                discountPrice={item.discountPrice}
                area={item.area}
                category={item.category}
                rating={item.rating}
                ratingCount={item.ratingCount}
                dateRange={item.dateRange}
                link={item.link}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyMessage}>할인 정보가 없습니다.</div>
        )}
      </div>

      {/* 타임티켓 영역 */}
      <div className={styles.promotionBlock}>
        <h2 className={styles.promotionTitle}>타임티켓 : 할인 프로모션</h2>
        {isLoadingTimeticket ? (
          <div className={styles.loadingContainer}>
            <LoadingSpinner />
          </div>
        ) : errorTimeticket ? (
          <div className={styles.errorMessage}>{errorTimeticket}</div>
        ) : timeticketData.length > 0 ? (
          <div className={styles.promotionList}>
            {timeticketData.map((item, index) => (
              <DiscountCard
                key={index}
                title={item.title}
                venue={item.venue}
                imageUrl={item.imageUrl}
                saleType={item.saleType}
                discountPercent={item.discountPercent}
                discountPrice={item.discountPrice}
                area={item.area}
                category={item.category}
                rating={item.rating}
                ratingCount={item.ratingCount}
                dateRange={item.dateRange}
                link={item.link}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyMessage}>할인 정보가 없습니다.</div>
        )}
      </div>
    </section>
  );
};

export default DiscountPromotionSection;

