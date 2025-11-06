import React from 'react';
import styles from './BookingLinks.module.css';

const BookingLinks = ({ bookingSites }) => {
  return (
    <div className={styles.bookingSection}>
      <h3 className={styles.sectionTitle}>예매처 링크</h3>
      <div className={styles.bookingSites}>
        {bookingSites.map((site, index) => (
          <button key={index} className={styles.bookingSite} style={{ backgroundColor: site.color || "#F5F5F5" }}>
            {site.name === "네이버 예약" ? (
              <div className={styles.naverLogo}>N</div>
            ) : (
              <span className={styles.siteName}>{site.logo}</span>
            )}
          </button>
        ))}
        <button className={styles.moreButton}>...</button>
      </div>
    </div>
  );
};

export default BookingLinks;

