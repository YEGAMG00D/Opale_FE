import React from "react";
import { Link } from "react-router-dom";
import styles from "./MainAdminPage.module.css";

const MainAdminPage = () => {
  return (
    <div className={styles.container}>
      {/* 프로필 섹션 */}
      <div className={styles.profileSection}>
        <div className={styles.profileImage}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ffb6c1" strokeWidth="1.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
          </svg>
        </div>
        <div className={styles.profileName}>
          운영자
        </div>
      </div>

      {/* 메뉴 리스트 */}
      <div className={styles.menuList}>
        <Link to="/admin/performance" className={styles.menuItem}>
          <div className={styles.menuIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
          </div>
          <span className={styles.menuText}>공연 상세 정보 관리</span>
          <div className={styles.menuArrow}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default MainAdminPage;
