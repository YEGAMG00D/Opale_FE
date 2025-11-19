import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './TicketRegisterPage.module.css';

const TicketRegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = location.state?.ticket ? true : false;
  const existingTicket = location.state?.ticket || null;
  
  const [ticketStep, setTicketStep] = useState(isEditMode ? 'manual' : 'scan'); // 'scan' or 'manual'
  const [ticketData, setTicketData] = useState({
    performanceName: existingTicket?.performanceName || '',
    performanceDate: existingTicket?.performanceDate || '',
    performanceTime: existingTicket?.performanceTime || '',
    section: existingTicket?.section || '',
    row: existingTicket?.row || '',
    number: existingTicket?.number || '',
    ticketImage: existingTicket?.ticketImage || null
  });
  const [isScanning, setIsScanning] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(existingTicket?.ticketImage || null);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // 수정 모드일 때 이미지 설정
  useEffect(() => {
    if (isEditMode && existingTicket?.ticketImage) {
      setCapturedImage(existingTicket.ticketImage);
    }
  }, [isEditMode, existingTicket]);

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
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      
      canvas.toBlob((blob) => {
        const imageUrl = URL.createObjectURL(blob);
        setCapturedImage(imageUrl);
        setTicketData(prev => ({ ...prev, ticketImage: blob }));
        stopCamera();
        setIsScanning(false);
        // OCR 처리 시뮬레이션 (실제로는 OCR API 호출)
        setTimeout(() => {
          setTicketData(prev => ({
            ...prev,
            performanceName: '뮤지컬 위키드 내한공연',
            performanceDate: '2025-10-23',
            performanceTime: '19:00',
            section: '나 구역',
            row: '15',
            number: '23'
          }));
          setTicketStep('manual');
        }, 1000);
      }, 'image/jpeg');
    }
  };

  // 파일에서 이미지 선택
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        setCapturedImage(imageUrl);
        setTicketData(prev => ({ ...prev, ticketImage: file }));
        // OCR 처리 시뮬레이션
        setTimeout(() => {
          setTicketData(prev => ({
            ...prev,
            performanceName: '뮤지컬 위키드 내한공연',
            performanceDate: '2025-10-23',
            performanceTime: '19:00',
            section: '나 구역',
            row: '15',
            number: '23'
          }));
          setTicketStep('manual');
        }, 1000);
      };
      reader.readAsDataURL(file);
    }
  };

  // 카메라 버튼 클릭
  const handleCameraClick = async () => {
    setIsScanning(true);
    await startCamera();
  };

  // 파일 선택 버튼 클릭
  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleTicketManualInput = () => {
    setTicketStep('manual');
  };

  const handleTicketInputChange = (field, value) => {
    setTicketData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTicketRegister = () => {
    if (!ticketData.performanceName || !ticketData.performanceDate) {
      alert('공연명과 공연일자를 입력해주세요.');
      return;
    }

    // 로컬 스토리지에서 기존 티켓 목록 가져오기
    const savedTickets = localStorage.getItem('myTickets');
    const tickets = savedTickets ? JSON.parse(savedTickets) : [];

    if (isEditMode && existingTicket) {
      // 수정 모드
      const updatedTickets = tickets.map(ticket => 
        ticket.id === existingTicket.id 
          ? {
              ...ticket,
              performanceName: ticketData.performanceName,
              performanceDate: ticketData.performanceDate,
              performanceTime: ticketData.performanceTime,
              section: ticketData.section,
              row: ticketData.row,
              number: ticketData.number,
              ticketImage: capturedImage
            }
          : ticket
      );
      localStorage.setItem('myTickets', JSON.stringify(updatedTickets));
    } else {
      // 등록 모드
      const newTicket = {
        id: Date.now(),
        performanceName: ticketData.performanceName,
        performanceDate: ticketData.performanceDate,
        performanceTime: ticketData.performanceTime,
        section: ticketData.section,
        row: ticketData.row,
        number: ticketData.number,
        ticketImage: capturedImage, // 이미지 URL 저장
        registeredDate: new Date().toISOString().split('T')[0]
      };

      const updatedTickets = [newTicket, ...tickets];
      localStorage.setItem('myTickets', JSON.stringify(updatedTickets));
    }
    
    // 티켓 목록 업데이트를 위한 이벤트 발생
    window.dispatchEvent(new Event('ticketUpdated'));
    
    stopCamera();
    navigate('/my/tickets');
  };

  const handleCancel = () => {
    stopCamera();
    navigate('/my/tickets');
  };

  // 컴포넌트 언마운트 시 카메라 정리
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [cameraStream]);

  return (
    <div className={styles.container}>
      {/* 상단 헤더 */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleCancel}>←</button>
        <h2 className={styles.headerTitle}>{isEditMode ? '티켓 수정' : '티켓 등록'}</h2>
        <div></div>
      </div>

      <div className={styles.content}>
        {ticketStep === 'scan' ? (
          <>
            <div className={styles.ticketTitle}>티켓 스캔</div>
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
                    onClick={capturePhoto}
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
                  onClick={handleTicketManualInput}
                >
                  직접 입력하기
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <div className={styles.ticketTitle}>티켓 정보 입력</div>
            {capturedImage && (
              <div className={styles.imagePreview}>
                <img src={capturedImage} alt="티켓 이미지" />
              </div>
            )}
            {!capturedImage && (
              <div className={styles.imagePlaceholder}>
                {/* 티켓 이미지 영역 */}
              </div>
            )}
            <div className={styles.ticketForm}>
              <div className={styles.formGroup}>
                <label>공연명</label>
                <input
                  type="text"
                  value={ticketData.performanceName}
                  onChange={(e) => handleTicketInputChange('performanceName', e.target.value)}
                  placeholder="공연명을 입력하세요"
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>공연일자</label>
                  <input
                    type="date"
                    value={ticketData.performanceDate}
                    onChange={(e) => handleTicketInputChange('performanceDate', e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>시간</label>
                  <input
                    type="time"
                    value={ticketData.performanceTime}
                    onChange={(e) => handleTicketInputChange('performanceTime', e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>좌석정보</label>
                <div className={styles.seatInputs}>
                  <input
                    type="text"
                    value={ticketData.section}
                    onChange={(e) => handleTicketInputChange('section', e.target.value)}
                    placeholder="구역"
                    className={styles.seatInput}
                  />
                  <input
                    type="text"
                    value={ticketData.row}
                    onChange={(e) => handleTicketInputChange('row', e.target.value)}
                    placeholder="열"
                    className={styles.seatInput}
                  />
                  <input
                    type="text"
                    value={ticketData.number}
                    onChange={(e) => handleTicketInputChange('number', e.target.value)}
                    placeholder="번"
                    className={styles.seatInput}
                  />
                </div>
              </div>
            </div>
            <div className={styles.buttonGroup}>
              <button 
                className={styles.cancelButton}
                onClick={handleCancel}
              >
                취소
              </button>
              <button 
                className={styles.primaryButton}
                onClick={handleTicketRegister}
              >
                {isEditMode ? '수정 완료' : '티켓 등록'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TicketRegisterPage;

