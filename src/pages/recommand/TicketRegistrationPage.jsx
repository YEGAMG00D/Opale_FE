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
  const fileInputRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);

  // 카메라 시작
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // 후면 카메라 우선
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('카메라 접근 실패:', err);
      alert('카메라 접근에 실패했습니다. 파일에서 선택해주세요.');
    }
  };

  // 카메라 중지
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // 카메라로 촬영
  const handleCameraClick = async () => {
    setIsScanning(true);
    await startCamera();
  };

  // 파일 선택 버튼 클릭
  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  // 파일에서 이미지 선택
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 파일 선택 시 직접 입력 단계로 이동
      setStep('manual');
    }
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
      {/* 상단 헤더 */}
      <div className={styles.header}>
        <div></div>
        <h2 className={styles.headerTitle}>티켓 등록</h2>
        <div></div>
      </div>

      <div className={styles.content}>
        {step === 'scan' ? (
          <>
            <div className={styles.ticketTitle}>티켓 스캔</div>
            <div className={styles.scanArea}>
              <div className={styles.cameraIcon}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
              <p className={styles.scanInstruction}>
                티켓을 스캔하거나 사진을 업로드해주세요
              </p>
            </div>
            {cameraStream ? (
              <div className={styles.cameraArea}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className={styles.videoPreview}
                />
                <div className={styles.cameraControls}>
                  <button
                    className={styles.captureButton}
                    onClick={() => {
                      // 촬영 로직 (간단히 단계 이동)
                      stopCamera();
                      setIsScanning(false);
                      setStep('manual');
                    }}
                  >
                    촬영
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={() => {
                      stopCamera();
                      setIsScanning(false);
                    }}
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <button 
                  className={styles.primaryButton}
                  onClick={handleCameraClick}
                  disabled={isScanning}
                >
                  카메라로 촬영
                </button>
                <button 
                  className={styles.secondaryButton}
                  onClick={handleFileClick}
                >
                  파일에서 선택
                </button>
                <button 
                  className={styles.tertiaryButton}
                  onClick={handleManualInput}
                >
                  직접 입력하기
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <div className={styles.ticketTitle}>티켓 정보 입력</div>
            <div className={styles.imagePlaceholder}>
              {/* 티켓 이미지 영역 */}
            </div>
            <div className={styles.ticketForm}>
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

