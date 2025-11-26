import React from 'react';
import styles from './SuccessModal.module.css';

/**
 * 성공 모달 컴포넌트
 * @param {boolean} isOpen - 모달 표시 여부
 * @param {function} onClose - 모달 닫기 핸들러
 * @param {string} title - 모달 제목
 * @param {string} message - 모달 메시지
 * @param {string} buttonText - 확인 버튼 텍스트 (기본값: "확인")
 */
const SuccessModal = ({ 
  isOpen, 
  onClose, 
  title = '성공',
  message = '',
  buttonText = '확인'
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.successIcon}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h2 className={styles.modalTitle}>{title}</h2>
        {message && <p className={styles.modalMessage}>{message}</p>}
        <button
          className={styles.modalButton}
          onClick={onClose}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;

