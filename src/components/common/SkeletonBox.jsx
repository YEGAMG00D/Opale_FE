import React from 'react';
import styles from './SkeletonBox.module.css';

/**
 * 스켈레톤 UI 박스 컴포넌트
 * @param {string} width - 너비 (예: "100%", "200px")
 * @param {string} height - 높이 (예: "100%", "50px")
 * @param {string} borderRadius - 둥근 모서리 (예: "8px", "50%")
 */
const SkeletonBox = ({ width = "100%", height = "20px", borderRadius = "4px", className = "" }) => {
  return (
    <div 
      className={`${styles.skeletonBox} ${className}`}
      style={{ width, height, borderRadius }}
    />
  );
};

export default SkeletonBox;

