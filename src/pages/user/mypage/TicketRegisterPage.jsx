import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './TicketRegisterPage.module.css';
import { createTicket, updateTicket as updateTicketApi, getTicket } from '../../../api/reservationApi';
import { transformTicketDataForApi, transformTicketDataFromApi } from '../../../utils/ticketDataTransform';
import logApi from '../../../api/logApi';
import TicketSelectModal from '../../../components/common/TicketSelectModal';
import { fetchPerformanceList } from '../../../api/performanceApi';
import { fetchPerformanceBasic } from '../../../api/performanceApi';
import { normalizePerformance } from '../../../services/normalizePerformance';
import { normalizePerformanceDetail } from '../../../services/normalizePerformanceDetail';

const TicketRegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 수정 모드 확인: ticketId 또는 ticket 객체가 있으면 수정 모드
  const ticketId = location.state?.ticketId || location.state?.ticket?.ticketId || location.state?.ticket?.id || null;
  const isEditMode = !!ticketId;
  
  const [ticketStep, setTicketStep] = useState(isEditMode ? 'manual' : 'scan'); // 'scan' or 'manual'
  const [ticketData, setTicketData] = useState({
    performanceName: '',
    performanceDate: '',
    performanceTime: '',
    section: '',
    row: '',
    number: '',
    placeName: '',
    ticketImage: null,
    performanceId: null,
    placeId: null
  });
  const [isScanning, setIsScanning] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [ticketImageUrl, setTicketImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(isEditMode); // 수정 모드일 때는 로딩 중
  const [showTicketSelectModal, setShowTicketSelectModal] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchTimeoutRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchResultsRef = useRef(null);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // 수정 모드일 때 티켓 데이터 가져오기
  useEffect(() => {
    const loadTicketData = async () => {
      if (isEditMode && ticketId) {
        try {
          setIsLoading(true);
          const response = await getTicket(ticketId);
          
          // API 응답을 프론트엔드 형식으로 변환
          const frontendData = transformTicketDataFromApi(response);
          
          if (frontendData) {
            setTicketData({
              performanceName: frontendData.performanceName || '',
              performanceDate: frontendData.performanceDate || '',
              performanceTime: frontendData.performanceTime || '',
              section: frontendData.section || '',
              row: frontendData.row || '',
              number: frontendData.number || '',
              placeName: frontendData.placeName || '',
              ticketImage: null,
              performanceId: frontendData.performanceId || null,
              placeId: frontendData.placeId || null
            });
            
            // 이미지 URL이 있으면 설정
            if (frontendData.ticketImageUrl) {
              setTicketImageUrl(frontendData.ticketImageUrl);
              setCapturedImage(frontendData.ticketImageUrl);
            }
          }
        } catch (err) {
          console.error('티켓 정보 조회 실패:', err);
          alert('티켓 정보를 불러오는데 실패했습니다.');
          navigate('/my/tickets');
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadTicketData();
  }, [isEditMode, ticketId, navigate]);

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

  // 티켓 선택 모달 열기
  const handleOpenTicketSelectModal = () => {
    setShowTicketSelectModal(true);
  };

  // 티켓 선택 모달 닫기
  const handleCloseTicketSelectModal = () => {
    setShowTicketSelectModal(false);
  };

  // 티켓 선택 시 처리
  const handleSelectTicket = (selectedTicket) => {
    // 선택한 티켓 정보를 폼에 채우기
    setTicketData({
      performanceName: selectedTicket.performanceName || '',
      performanceDate: selectedTicket.performanceDate || '',
      performanceTime: selectedTicket.performanceTime || '',
      section: selectedTicket.section || '',
      row: selectedTicket.row || '',
      number: selectedTicket.number || '',
      placeName: selectedTicket.placeName || '',
      ticketImage: null,
      performanceId: selectedTicket.performanceId || null,
      placeId: selectedTicket.placeId || null
    });

    // 이미지 URL이 있으면 설정
    if (selectedTicket.ticketImageUrl) {
      setTicketImageUrl(selectedTicket.ticketImageUrl);
      setCapturedImage(selectedTicket.ticketImageUrl);
    }

    // 티켓 정보 입력 단계로 이동
    setTicketStep('manual');
  };

  // 공연명 검색 함수
  const searchPerformances = async (keyword) => {
    if (!keyword || keyword.trim().length === 0) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      setIsSearching(true);
      const dto = {
        keyword: keyword.trim(),
        page: 1,
        size: 10
      };
      const res = await fetchPerformanceList(dto);
      const list = res.performances.map(normalizePerformance);
      setSearchResults(list);
      setShowSearchResults(list.length > 0);
    } catch (err) {
      console.error('공연 검색 실패:', err);
      setSearchResults([]);
      setShowSearchResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  // 공연명 입력 변경 핸들러 (debounce 적용)
  const handlePerformanceNameChange = (value) => {
    setTicketData(prev => ({
      ...prev,
      performanceName: value,
      performanceId: null,
      placeId: null,
      placeName: ''
    }));

    // 기존 타이머 취소
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // 300ms 후 검색 실행
    searchTimeoutRef.current = setTimeout(() => {
      searchPerformances(value);
    }, 300);
  };

  // 공연 선택 핸들러
  const handleSelectPerformance = async (performance) => {
    try {
      // 공연 상세 정보 가져오기
      const apiData = await fetchPerformanceBasic(performance.id);
      const normalizedData = normalizePerformanceDetail(apiData);

      if (normalizedData) {
        setTicketData(prev => ({
          ...prev,
          performanceName: normalizedData.title || performance.title,
          performanceId: normalizedData.performanceId || normalizedData.id,
          placeId: normalizedData.placeId,
          placeName: normalizedData.venue || performance.venue
        }));
      } else {
        // 정규화 실패 시 기본 정보만 사용
        setTicketData(prev => ({
          ...prev,
          performanceName: performance.title,
          performanceId: performance.id,
          placeName: performance.venue
        }));
      }

      setShowSearchResults(false);
      setSearchResults([]);
    } catch (err) {
      console.error('공연 정보 조회 실패:', err);
      // 에러 발생 시 기본 정보만 사용
      setTicketData(prev => ({
        ...prev,
        performanceName: performance.title,
        performanceId: performance.id,
        placeName: performance.venue
      }));
      setShowSearchResults(false);
      setSearchResults([]);
    }
  };

  // 외부 클릭 시 검색 결과 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleTicketInputChange = (field, value) => {
    setTicketData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTicketRegister = async () => {
    if (!ticketData.performanceName || !ticketData.performanceDate) {
      alert('공연명과 공연일자를 입력해주세요.');
      return;
    }

    try {
      // 프론트엔드 데이터를 백엔드 API 형식으로 변환
      const apiDto = transformTicketDataForApi(ticketData);

      if (isEditMode && ticketId) {
        // 수정 모드: API 호출
        await updateTicketApi(ticketId, apiDto);
        alert('티켓이 수정되었습니다.');
      } else {
        // 등록 모드: API 호출
        const ticketResponse = await createTicket(apiDto);
        alert('티켓이 등록되었습니다.');
        
        // 티켓 인증 완료 시 BOOKED 로그 기록
        // 응답에서 performanceId 확인 (응답 구조에 따라 조정 필요)
        // 백엔드 TicketDetailResponseDto에 performanceId가 포함되어 있을 것으로 예상
        const performanceId = ticketResponse?.performanceId || ticketResponse?.performance?.performanceId || ticketResponse?.performanceId;
        if (performanceId) {
          try {
            await logApi.createLog({
              eventType: "BOOKED",
              targetType: "PERFORMANCE",
              targetId: String(performanceId)
            });
          } catch (logErr) {
            console.error('로그 기록 실패:', logErr);
          }
        } else {
          // performanceId가 응답에 없는 경우, performanceName으로 검색하여 로그 기록
          // (선택사항: 성능상 이유로 생략 가능)
          console.warn('티켓 등록 응답에 performanceId가 없습니다. BOOKED 로그를 기록하지 않습니다.');
        }
      }
      
      stopCamera();
      
      // 티켓 목록 새로고침을 위한 이벤트 발생
      window.dispatchEvent(new Event('ticketUpdated'));
      
      navigate('/my/tickets');
    } catch (err) {
      console.error('티켓 등록/수정 실패:', err);
      const errorMessage = err.response?.data?.message || err.message || '티켓 등록에 실패했습니다.';
      alert(errorMessage);
    }
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

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div></div>
          <h2 className={styles.headerTitle}>{isEditMode ? '티켓 수정' : '티켓 등록'}</h2>
          <div></div>
        </div>
        <div className={styles.content}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>티켓 정보를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 상단 헤더 */}
      <div className={styles.header}>
        <div></div>
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
                  className={styles.selectFromHistoryButton}
                  onClick={handleOpenTicketSelectModal}
                >
                  등록한 예매 내역에서 선택
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
            {(capturedImage || ticketImageUrl) && (
              <div className={styles.imagePreview}>
                <img src={capturedImage || ticketImageUrl} alt="티켓 이미지" />
              </div>
            )}
            {!capturedImage && !ticketImageUrl && (
              <div className={styles.imagePlaceholder}>
                {/* 티켓 이미지 영역 */}
              </div>
            )}
            <div className={styles.ticketForm}>
              <div className={styles.formGroup} style={{ position: 'relative' }}>
                <label>공연명</label>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={ticketData.performanceName}
                  onChange={(e) => handlePerformanceNameChange(e.target.value)}
                  placeholder="공연명을 입력하세요"
                />
                {showSearchResults && searchResults.length > 0 && (
                  <div ref={searchResultsRef} className={styles.searchResults}>
                    {isSearching && (
                      <div className={styles.searchLoading}>검색 중...</div>
                    )}
                    {!isSearching && searchResults.map((performance) => (
                      <div
                        key={performance.id}
                        className={styles.searchResultItem}
                        onClick={() => handleSelectPerformance(performance)}
                      >
                        <div className={styles.searchResultTitle}>{performance.title}</div>
                        <div className={styles.searchResultVenue}>{performance.venue}</div>
                      </div>
                    ))}
                  </div>
                )}
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
              <div className={styles.formGroup}>
                <label>공연장명</label>
                <input
                  type="text"
                  value={ticketData.placeName}
                  onChange={(e) => handleTicketInputChange('placeName', e.target.value)}
                  placeholder="공연장명을 입력하세요 (선택)"
                />
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
      
      {/* 티켓 선택 모달 */}
      <TicketSelectModal
        isOpen={showTicketSelectModal}
        onClose={handleCloseTicketSelectModal}
        onSelectTicket={handleSelectTicket}
      />
    </div>
  );
};

export default TicketRegisterPage;

