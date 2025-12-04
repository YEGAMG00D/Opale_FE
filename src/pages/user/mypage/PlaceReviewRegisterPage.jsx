import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPlaceReview } from '../../../api/reviewApi';
import { normalizePlaceReviewRequest } from '../../../services/normalizePlaceReviewRequest';
import logApi from '../../../api/logApi';
import styles from './PlaceReviewRegisterPage.module.css';

const PlaceReviewRegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 티켓 데이터 및 공연장 정보 (location.state에서 전달받음)
  const ticketData = location.state?.ticketData || {};
  const placeId = location.state?.placeId || ticketData?.placeId || null;
  const performanceId = location.state?.performanceId || ticketData?.performanceId || null;
  const fromPerformanceDetail = location.state?.fromPerformanceDetail || false; // 공연 상세 페이지에서 온 경우
  
  // 리뷰 데이터
  const [reviewData, setReviewData] = useState({
    title: '',
    rating: 5,
    content: ''
  });

  // 공연장 리뷰 작성 완료
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reviewData.title || !reviewData.content) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    if (!placeId) {
      alert('공연장 정보가 없습니다.');
      return;
    }

    try {
      // 요청 DTO 생성
      const requestDto = normalizePlaceReviewRequest(reviewData, placeId);

      // API 호출
      await createPlaceReview(requestDto);

      // 공연장 리뷰 작성 완료 시 REVIEW_WRITE 로그 기록
      try {
        await logApi.createLog({
          eventType: "REVIEW_WRITE",
          targetType: "PLACE",
          targetId: String(placeId)
        });
      } catch (logErr) {
        console.error('로그 기록 실패:', logErr);
      }

      // 성공 후 이동
      // 공연 상세 페이지에서 온 경우 공연 상세 페이지로 돌아가기 (공연 후기/기대평 탭)
      if (fromPerformanceDetail && performanceId) {
        navigate(`/culture/${performanceId}?tab=review`);
      } else if (placeId) {
        navigate(`/place/${placeId}`);
      } else {
        navigate('/my/tickets');
        window.dispatchEvent(new Event('ticketUpdated'));
      }
    } catch (err) {
      console.error('공연장 리뷰 등록 실패:', err);
      alert(err.response?.data?.message || err.message || '공연장 리뷰 등록에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    if (placeId) {
      navigate(`/place/${placeId}`);
    } else {
      navigate('/my/tickets');
    }
  };

  const handleInputChange = (field, value) => {
    setReviewData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className={styles.container}>
      {/* 상단 헤더 */}
      <div className={styles.header}>
        <div></div>
        <h2 className={styles.headerTitle}>공연장 리뷰 작성</h2>
        <button className={styles.closeButton} onClick={handleCancel}>×</button>
      </div>

      <div className={styles.content}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>제목</label>
            <input
              type="text"
              value={reviewData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="제목을 입력하세요"
              className={styles.input}
              required
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
                  onClick={() => handleInputChange('rating', star)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>내용</label>
            <textarea
              value={reviewData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="공연장에 대한 리뷰를 작성해주세요"
              rows={6}
              className={styles.textarea}
              required
            />
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
              type="submit"
              className={styles.submitButton}
            >
              작성하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaceReviewRegisterPage;

