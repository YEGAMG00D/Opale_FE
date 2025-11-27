import React, { useState } from "react";
import PerformanceSelector from "../../components/admin/PerformanceSelector";
import PerformanceImageSection from "../../components/admin/PerformanceImageSection";
import PerformanceVideoSection from "../../components/admin/PerformanceVideoSection";
import styles from "./PerformanceAdminPage.module.css";

const PerformanceAdminPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPerformance, setSelectedPerformance] = useState(null);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>공연 상세 정보 관리</h1>
        <p className={styles.subtitle}>공연 수집 이미지와 유튜브 영상을 관리할 수 있습니다.</p>
      </div>

      {/* 공연 검색 및 선택 영역 */}
      <PerformanceSelector
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedPerformance={selectedPerformance}
        onSelectPerformance={setSelectedPerformance}
      />

      {/* 선택된 공연의 이미지 관리 영역 */}
      <PerformanceImageSection selectedPerformance={selectedPerformance} />

      {/* 선택된 공연의 영상 관리 영역 */}
      <PerformanceVideoSection selectedPerformance={selectedPerformance} />

      {!selectedPerformance && (
        <div className={styles.placeholder}>
          <p>공연을 선택하면 이미지 및 영상 관리가 가능합니다.</p>
        </div>
      )}
    </div>
  );
};

export default PerformanceAdminPage;

