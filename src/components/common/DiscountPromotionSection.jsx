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
  const [showAllInterpark, setShowAllInterpark] = useState(false);
  const [showAllTimeticket, setShowAllTimeticket] = useState(false);

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

  // 데이터가 없거나 에러가 발생한 경우 영역을 숨김
  const shouldShowInterpark = !isLoadingInterpark && !errorInterpark && interparkData.length > 0;
  const shouldShowTimeticket = !isLoadingTimeticket && !errorTimeticket && timeticketData.length > 0;

  // 둘 다 없으면 섹션 자체를 렌더링하지 않음
  if (!shouldShowInterpark && !shouldShowTimeticket) {
    return null;
  }

  return (
    <section className={styles.promotionSection}>
      {/* 인터파크 영역 */}
      {shouldShowInterpark && (
        <div className={styles.promotionBlock}>
          <h2 className={styles.promotionTitle}>Nol ticket : 할인 프로모션</h2>
          <div className={styles.promotionList}>
            {(showAllInterpark ? interparkData : interparkData.slice(0, 3)).map((item, index) => (
              <DiscountCard
                key={index}
                title={item.title}
                venue={item.venue}
                imageUrl={item.imageUrl}
                saleType={item.saleType}
                discountPercent={item.discountPercent}
                discountPrice={item.discountPrice}
                dateRange={item.dateRange}
                link={item.link}
                discountEndDatetime={item.discountEndDatetime}
              />
            ))}
          </div>
          {interparkData.length > 3 && !showAllInterpark && (
            <button 
              className={styles.moreButton}
              onClick={() => setShowAllInterpark(true)}
            >
              <span>더보기 ({interparkData.length - 3}개)</span>
            </button>
          )}
        </div>
      )}

      {/* 타임티켓 영역 */}
      {shouldShowTimeticket && (
        <div className={styles.promotionBlock}>
          <h2 className={styles.promotionTitle}>타임티켓 : 할인 프로모션</h2>
          <div className={styles.promotionList}>
            {(showAllTimeticket ? timeticketData : timeticketData.slice(0, 3)).map((item, index) => (
              <DiscountCard
                key={index}
                title={item.title}
                venue={item.venue}
                imageUrl={item.imageUrl}
                saleType={item.saleType}
                discountPercent={item.discountPercent}
                discountPrice={item.discountPrice}
                dateRange={item.dateRange}
                link={item.link}
                discountEndDatetime={item.discountEndDatetime}
              />
            ))}
          </div>
          {timeticketData.length > 3 && !showAllTimeticket && (
            <button 
              className={styles.moreButton}
              onClick={() => setShowAllTimeticket(true)}
            >
              <span>더보기 ({timeticketData.length - 3}개)</span>
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default DiscountPromotionSection;

