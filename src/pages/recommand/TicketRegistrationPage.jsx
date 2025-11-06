import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TicketRegistrationPage.module.css';

const TicketRegistrationPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('scan'); // 'scan' or 'manual'
  const [ticketData, setTicketData] = useState({
    performanceName: '',
    performanceDate: '',
    performanceTime: '',
    section: '',
    row: '',
    number: ''
  });
  const videoRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);

  // 카메라 접근 시도
  useEffect(() => {
    if (step === 'scan' && !isScanning) {
      // 실제 카메라 접근 로직은 여기에 구현
      // 현재는 시뮬레이션만
    }
  }, [step, isScanning]);

  const handleScan = () => {
    // 스캔 로직 시뮬레이션
    setIsScanning(true);
    setTimeout(() => {
      // 스캔된 데이터 (실제로는 OCR 결과)
      setTicketData({
        performanceName: '뮤지컬 위키드 내한공연',
        performanceDate: '2025-10-23',
        performanceTime: '19:00',
        section: '나 구역',
        row: '15',
        number: '23'
      });
      setStep('manual');
      setIsScanning(false);
    }, 2000);
  };

  const handleManualInput = () => {
    setStep('manual');
  };

  const handleInputChange = (field, value) => {
    setTicketData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegister = () => {
    // 티켓 등록 로직
    console.log('티켓 등록:', ticketData);
    navigate('/recommend/review', { state: { ticketData } });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {step === 'scan' ? (
          <>
            <div className={styles.title}>Frame 298</div>
            <div className={styles.scanArea}>
              <div className={styles.cameraIcon}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
              <p className={styles.scanInstruction}>
                상자 안에 티켓의 위치를 맞춰주세요
              </p>
            </div>
            <button 
              className={styles.primaryButton}
              onClick={handleScan}
              disabled={isScanning}
            >
              {isScanning ? '스캔 중...' : '스캔하기'}
            </button>
            <button 
              className={styles.secondaryButton}
              onClick={handleManualInput}
            >
              직접 등록하기
            </button>
          </>
        ) : (
          <>
            <div className={styles.title}>Frame 296</div>
            <div className={styles.imagePlaceholder}>
              {/* 티켓 이미지 영역 */}
            </div>
            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label>공연명</label>
                <input
                  type="text"
                  value={ticketData.performanceName}
                  onChange={(e) => handleInputChange('performanceName', e.target.value)}
                  placeholder="공연명을 입력하세요"
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>공연일자</label>
                  <input
                    type="date"
                    value={ticketData.performanceDate}
                    onChange={(e) => handleInputChange('performanceDate', e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>시간</label>
                  <input
                    type="time"
                    value={ticketData.performanceTime}
                    onChange={(e) => handleInputChange('performanceTime', e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>좌석정보</label>
                <div className={styles.seatInputs}>
                  <input
                    type="text"
                    value={ticketData.section}
                    onChange={(e) => handleInputChange('section', e.target.value)}
                    placeholder="구역"
                    className={styles.seatInput}
                  />
                  <input
                    type="text"
                    value={ticketData.row}
                    onChange={(e) => handleInputChange('row', e.target.value)}
                    placeholder="열"
                    className={styles.seatInput}
                  />
                  <input
                    type="text"
                    value={ticketData.number}
                    onChange={(e) => handleInputChange('number', e.target.value)}
                    placeholder="번"
                    className={styles.seatInput}
                  />
                </div>
              </div>
            </div>
            <button 
              className={styles.primaryButton}
              onClick={handleRegister}
            >
              티켓 등록
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TicketRegistrationPage;

