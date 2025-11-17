import React from 'react';
import styles from './BookingLinks.module.css';

const BookingLinks = ({ bookingSites }) => {
  const handleSiteClick = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (!bookingSites || bookingSites.length === 0) {
    return null;
  }

  return (
    <div className={styles.bookingSection}>
      <h3 className={styles.sectionTitle}>예매처 링크</h3>
      <div className={styles.bookingSites}>
        {bookingSites.map((site) => (
          <button
            key={site.id}
            className={styles.bookingSite}
            style={{ backgroundColor: site.color || "#F5F5F5" }}
            onClick={() => handleSiteClick(site.url)}
            title={site.name}
          >
            {site.name && (site.name.includes("네이버") || site.name.includes("네이버예약")) ? (
              <div className={styles.naverLogo}>{site.logo}</div>
            ) : (
              <span className={styles.siteName}>{site.logo}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BookingLinks;

