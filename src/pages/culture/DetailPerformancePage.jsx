import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './DetailPerformancePage.module.css';

const DetailPerformancePage = () => {
  const [activeTab, setActiveTab] = useState('reservation');

  const performance = {
    title: "위키드",
    venue: "블루스퀘어 신한카드홀",
    address: "서울 용산구 이태원로",
    date: "2025.07.12.(토)~2025.10.26.(일)",
    rating: 4.6,
    reviewCount: 210,
    keywords: ["키워드", "키워드", "키워드"],
    prices: [
      { seat: "VIP석", price: "190,000원" },
      { seat: "R석", price: "160,000원" },
      { seat: "S석", price: "130,000원" },
      { seat: "A석", price: "80,000원" }
    ]
  };

  const tabs = [
    { id: 'reservation', label: '예매정보' },
    { id: 'detail', label: '상세정보' },
    { id: 'review', label: '후기 / 기대평' },
    { id: 'venue', label: '공연장 정보' }
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.backButton}>←</div>
          <div className={styles.headerTitle}>공연</div>
          <div className={styles.loginButton}>로그인</div>
        </div>
      </header>

      {/* Performance Title */}
      <div className={styles.titleSection}>
        <h1 className={styles.performanceTitle}>{performance.title}</h1>
      </div>

      {/* Performance Info */}
      <div className={styles.infoSection}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>공연장</span>
          <span className={styles.infoValue}>{performance.venue}</span>
          <span className={styles.infoAddress}>{performance.address}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>공연 일시</span>
          <span className={styles.infoValue}>{performance.date}</span>
        </div>
      </div>

      {/* Performance Poster and Rating */}
      <div className={styles.posterSection}>
        <div className={styles.posterCard}>
          <div className={styles.posterImage}>
            <div className={styles.posterContent}>
              <div className={styles.posterTagline}>SEE IT LIVE</div>
              <div className={styles.posterSubtitle}>12년을 기다린 오리지널 내한공연</div>
              <div className={styles.posterTitle}>WICKED</div>
              <div className={styles.posterDescription}>The untold true story of the Witches of Oz</div>
              <div className={styles.posterDate}>2025.7.12. (SAT) - 10.26. (SUN)</div>
            </div>
          </div>
        </div>
        
        <div className={styles.ratingCard}>
          <div className={styles.ratingInfo}>
            <span className={styles.star}>★</span>
            <span className={styles.rating}>{performance.rating} ({performance.reviewCount})</span>
          </div>
          <div className={styles.keywords}>
            {performance.keywords.map((keyword, index) => (
              <span key={index} className={styles.keyword}>#{keyword}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabSection}>
        <div className={styles.tabHeader}>
          <div className={styles.tabs}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className={styles.reportLink}>제보</div>
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {activeTab === 'reservation' && (
            <div className={styles.reservationContent}>
              <div className={styles.priceSection}>
                <h3 className={styles.priceTitle}>가격</h3>
                <div className={styles.priceList}>
                  {performance.prices.map((price, index) => (
                    <div key={index} className={styles.priceItem}>
                      <span className={styles.seatType}>{price.seat}</span>
                      <span className={styles.seatPrice}>{price.price}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.discountSection}>
                <h3 className={styles.discountTitle}>할인 정보</h3>
                <p className={styles.discountText}>할인 정보가 여기에 표시됩니다.</p>
              </div>
            </div>
          )}
          
          {activeTab === 'detail' && (
            <div className={styles.detailContent}>
              <h3>상세 정보</h3>
              <p>공연의 상세 정보가 여기에 표시됩니다.</p>
            </div>
          )}
          
          {activeTab === 'review' && (
            <div className={styles.reviewContent}>
              <h3>후기 / 기대평</h3>
              <p>공연 후기와 기대평이 여기에 표시됩니다.</p>
            </div>
          )}
          
          {activeTab === 'venue' && (
            <div className={styles.venueContent}>
              <h3>공연장 정보</h3>
              <p>공연장의 상세 정보가 여기에 표시됩니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className={styles.bottomNav}>
        <div className={styles.navItem}>공연장</div>
        <div className={styles.navItem}>공연</div>
        <div className={`${styles.navItem} ${styles.active}`}>홈</div>
        <div className={styles.navItem}>채팅</div>
        <div className={styles.navItem}>추천</div>
      </nav>
    </div>
  );
};

export default DetailPerformancePage;
