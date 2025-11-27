import React from 'react';
import styles from './BookingLinks.module.css';
import melonIcon from '../../assets/bookingIcon/melon티켓-icon.png';
import nolIcon from '../../assets/bookingIcon/NOL-icon.png';
import yes24Icon from '../../assets/bookingIcon/yes24-icon.png';
import naverIcon from '../../assets/bookingIcon/네이버예약-icon.png';
import timeticketIcon from '../../assets/bookingIcon/타임티켓-icon.png';
import ticketlinkIcon from '../../assets/bookingIcon/티켓링크-icon.png';

const BookingLinks = ({ bookingSites }) => {
  const handleSiteClick = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  /**
   * 예매처 이름에 따라 적절한 아이콘 이미지를 반환하는 함수
   * @param {string} siteName - 예매처 이름
   * @returns {string|null} 이미지 경로 또는 null
   */
  const getBookingIcon = (siteName) => {
    if (!siteName) return null;
    
    const lowerName = siteName.toLowerCase();
    
    // 멜론티켓
    if (siteName.includes("멜론티켓") || lowerName.includes("melonticket") || lowerName.includes("melon")) {
      return melonIcon;
    }
    
    // 놀 인터파크, 인터파크, 놀 티켓
    if (siteName.includes("놀 인터파크") || siteName.includes("인터파크") || 
        siteName.includes("놀 티켓") || lowerName.includes("interpark") || 
        lowerName.includes("nol")) {
      return nolIcon;
    }
    
    // yes24, 예스24
    if (siteName.includes("예스24") || siteName.includes("yes24") || lowerName.includes("yes24")) {
      return yes24Icon;
    }
    
    // 네이버 예약, 네이버
    if (siteName.includes("네이버") || siteName.includes("네이버예약") || lowerName.includes("naver")) {
      return naverIcon;
    }
    
    // 타임 티켓, timeticket
    if (siteName.includes("타임 티켓") || siteName.includes("타임티켓") || 
        lowerName.includes("timeticket") || lowerName.includes("time ticket")) {
      return timeticketIcon;
    }
    
    // 티켓 링크, ticketLink
    if (siteName.includes("티켓 링크") || siteName.includes("티켓링크") || 
        lowerName.includes("ticketlink") || lowerName.includes("ticket link")) {
      return ticketlinkIcon;
    }
    
    return null;
  };

  if (!bookingSites || bookingSites.length === 0) {
    return null;
  }

  return (
    <div className={styles.bookingSection}>
      <h3 className={styles.sectionTitle}>예매처 링크</h3>
      <div className={styles.bookingSites}>
        {bookingSites.map((site) => {
          const iconImage = getBookingIcon(site.name);
          
          return (
            <button
              key={site.id}
              className={styles.bookingSite}
              style={{ backgroundColor: site.color || "#F5F5F5" }}
              onClick={() => handleSiteClick(site.url)}
              title={site.name}
            >
              {iconImage ? (
                <img 
                  src={iconImage} 
                  alt={site.name} 
                  className={styles.bookingIcon}
                />
              ) : (
                <span className={styles.siteName}>{site.logo}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BookingLinks;

