import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './ReviewWritingPage.module.css';
import { addTicket } from '../../utils/ticketUtils';

const ReviewWritingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 단계 관리: 'ticketScan' -> 'ticketInput' -> 'performanceReview' -> 'venueReview'
  const [step, setStep] = useState('ticketScan');
  
  // 티켓 데이터
  const [ticketData, setTicketData] = useState(() => {
    const stateData = location.state?.ticketData || {};
    return {
      performanceName: stateData.performanceName || '',
      performanceDate: stateData.performanceDate || '',
      performanceTime: stateData.performanceTime || '',
      section: stateData.section || '',
      row: stateData.row || '',
      number: stateData.number || ''
    };
  });

  // 티켓 스캔 관련
  const [isScanning, setIsScanning] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // 리뷰 데이터
  const [reviewData, setReviewData] = useState({
    title: '',
    rating: 5,
    performanceReview: '',
    venueReview: ''
  });

  // location.state에 ticketData가 있으면 초기값으로 설정 (항상 티켓 등록 단계부터 시작)
  useEffect(() => {
    if (location.state?.ticketData && location.state.ticketData.performanceName) {
      setTicketData(location.state.ticketData);
    }
    // 항상 티켓 스캔 단계부터 시작
    setStep('ticketScan');
  }, [location.state]);

  // 카메라 시작
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }
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
        stopCamera();
        setIsScanning(false);
        // 직접 입력 단계로 이동
        setStep('ticketInput');
        // OCR 처리 시뮬레이션
        setTimeout(() => {
          setTicketData(prev => ({
            ...prev,
            performanceName: prev.performanceName || '뮤지컬 위키드 내한공연',
            performanceDate: prev.performanceDate || '2025-10-23',
            performanceTime: prev.performanceTime || '19:00',
            section: prev.section || '나 구역',
            row: prev.row || '15',
            number: prev.number || '23'
          }));
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
        // 직접 입력 단계로 이동
        setStep('ticketInput');
        // OCR 처리 시뮬레이션
        setTimeout(() => {
          setTicketData(prev => ({
            ...prev,
            performanceName: prev.performanceName || '뮤지컬 위키드 내한공연',
            performanceDate: prev.performanceDate || '2025-10-23',
            performanceTime: prev.performanceTime || '19:00',
            section: prev.section || '나 구역',
            row: prev.row || '15',
            number: prev.number || '23'
          }));
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

  // 티켓 스캔 완료 -> 직접 입력하기로
  const handleTicketScanComplete = () => {
    setStep('ticketInput');
    stopCamera();
  };

  // 티켓 스캔 건너뛰기 -> 직접 입력하기로
  const handleSkipTicketScan = () => {
    setStep('ticketInput');
    stopCamera();
  };

  // 직접 입력하기 완료 -> 공연 후기로
  const handleTicketInputComplete = () => {
    if (!ticketData.performanceName || !ticketData.performanceDate) {
      alert('공연명과 공연일자를 입력해주세요.');
      return;
    }

    // 항상 새 티켓으로 저장 (기존 티켓이 있어도 새로 등록)
    addTicket({
      ...ticketData,
      ticketImage: capturedImage
    });

    // 공연 후기 작성 단계로 이동
    setStep('performanceReview');
  };

  // 티켓 입력 변경
  const handleTicketInputChange = (field, value) => {
    setTicketData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 리뷰 입력 변경
  const handleReviewInputChange = (field, value) => {
    setReviewData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 공연 후기 작성 완료
  const handlePerformanceReviewComplete = () => {
    if (!reviewData.title || !reviewData.performanceReview) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }
    setStep('venueReview');
  };

  // 공연장 후기 스킵
  const handleSkipVenueReview = () => {
    handleRegister();
  };

  // 리뷰 등록
  const handleRegister = () => {
    console.log('리뷰 등록:', { ticketData, reviewData });
    // 리뷰 등록 로직
    
    // 공연 페이지에서 온 경우 공연 페이지로 돌아가기 (후기 탭 활성화)
    const performanceId = location.state?.performanceId;
    if (performanceId) {
      navigate(`/culture/${performanceId}?tab=review`);
    } else {
      // 마이티켓에서 온 경우 마이티켓으로 돌아가기
      navigate('/my/tickets');
    }
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

  // 티켓 스캔 단계
  if (step === 'ticketScan') {
    return (
      <div className={styles.container}>
        {/* 상단 헤더 */}
        <div className={styles.header}>
          <div></div>
          <h2 className={styles.headerTitle}>티켓 등록</h2>
          <div></div>
        </div>

        <div className={styles.content}>
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
                onClick={handleSkipTicketScan}
              >
                직접 입력하기
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // 직접 입력하기 단계
  if (step === 'ticketInput') {
    return (
      <div className={styles.container}>
        {/* 상단 헤더 */}
        <div className={styles.header}>
          <div></div>
          <h2 className={styles.headerTitle}>티켓 등록</h2>
          <div></div>
        </div>

        <div className={styles.content}>
          <div className={styles.ticketTitle}>티켓 정보 입력</div>
          
          {capturedImage ? (
            <div className={styles.imagePreview}>
              <img src={capturedImage} alt="티켓 이미지" />
            </div>
          ) : (
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
                className={styles.input}
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>공연일자</label>
                <input
                  type="date"
                  value={ticketData.performanceDate}
                  onChange={(e) => handleTicketInputChange('performanceDate', e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label>시간</label>
                <input
                  type="time"
                  value={ticketData.performanceTime}
                  onChange={(e) => handleTicketInputChange('performanceTime', e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>좌석정보</label>
              <div className={styles.seatInputsTwo}>
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
              </div>
            </div>
          </div>
          
          <div className={styles.buttonGroup}>
            <button 
              className={styles.cancelButton}
              onClick={() => {
                const performanceId = location.state?.performanceId;
                if (performanceId) {
                  navigate(`/culture/${performanceId}`);
                } else {
                  navigate('/my/tickets');
                }
              }}
            >
              취소
            </button>
            <button 
              className={styles.primaryButton}
              onClick={handleTicketInputComplete}
            >
              다음
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 공연 후기 작성 단계
  if (step === 'performanceReview') {
    const performanceId = location.state?.performanceId;
    const handleCancel = () => {
      if (performanceId) {
        navigate(`/culture/${performanceId}`);
      } else {
        navigate('/my/tickets');
      }
    };

    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.modalHeader}>
            <h3>공연 후기 작성</h3>
            <button className={styles.closeButton} onClick={handleCancel}>×</button>
          </div>
          
          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label>제목</label>
              <input
                type="text"
                value={reviewData.title}
                onChange={(e) => handleReviewInputChange('title', e.target.value)}
                placeholder="제목을 입력하세요"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>평점</label>
              <div className={styles.ratingInput}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    className={`${styles.ratingStar} ${star <= reviewData.rating ? styles.filled : ''}`}
                    onClick={() => handleReviewInputChange('rating', star)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>내용</label>
              <textarea
                value={reviewData.performanceReview}
                onChange={(e) => handleReviewInputChange('performanceReview', e.target.value)}
                placeholder="내용을 입력하세요"
                rows={6}
                className={styles.textarea}
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button 
              type="button"
              className={styles.cancelButton}
              onClick={handleCancel}
            >
              취소
            </button>
            <button 
              type="button"
              className={styles.submitButton}
              onClick={handlePerformanceReviewComplete}
            >
              작성하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 공연장 후기 작성 단계
  if (step === 'venueReview') {
    const performanceId = location.state?.performanceId;
    const handleCancel = () => {
      if (performanceId) {
        navigate(`/culture/${performanceId}`);
      } else {
        navigate('/my/tickets');
      }
    };

    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.modalHeader}>
            <h3>공연장 후기 작성</h3>
            <button className={styles.closeButton} onClick={handleCancel}>×</button>
          </div>
          
          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label>공연장 리뷰</label>
              <textarea
                value={reviewData.venueReview}
                onChange={(e) => handleReviewInputChange('venueReview', e.target.value)}
                placeholder="공연장에 대한 리뷰를 작성해주세요"
                rows={6}
                className={styles.textarea}
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button 
              type="button"
              className={styles.skipButton}
              onClick={handleSkipVenueReview}
            >
              건너뛰기
            </button>
            <button 
              type="button"
              className={styles.submitButton}
              onClick={handleRegister}
            >
              작성하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ReviewWritingPage;

