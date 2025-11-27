import React from "react";
import styles from "./HomeBannerAdminPage.module.css";

const HomeBannerAdminPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>홈 배너 관리</h1>
        <p className={styles.subtitle}>홈페이지 배너를 관리할 수 있습니다.</p>
      </div>
      
      <div className={styles.content}>
        <p>홈 배너 관리 기능이 곧 추가될 예정입니다.</p>
      </div>
    </div>
  );
};

export default HomeBannerAdminPage;

