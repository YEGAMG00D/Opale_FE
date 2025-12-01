import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPerformanceReview } from '../../../api/reviewApi';
import { normalizePerformanceReviewRequest } from '../../../services/normalizePerformanceReviewRequest';
import { fetchPerformanceList } from '../../../api/performanceApi';
import { normalizePerformance } from '../../../services/normalizePerformance';
import logApi from '../../../api/logApi';
import styles from './PerformanceReviewRegisterPage.module.css';

const PerformanceReviewRegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 티켓 데이터 (location.state에서 전달받음)
  const ticketData = location.state?.ticketData || {};
  const performanceId = location.state?.performanceId || ticketData?.performanceId || null;
  const nextPage = location.state?.nextPage || null; // 공연장 리뷰 작성 페이지로 이동할 경우 ('/my/placeReviews/register')
  
  // 리뷰 데이터
  const [reviewData, setReviewData] = useState({
    title: '',
    rating: 5,
    content: ''
  });

  // 공연명으로 performanceId 찾기
  const findPerformanceIdByName = async (performanceName) => {
    if (!performanceName) return null;
    
    try {
      const res = await fetchPerformanceList({
        keyword: performanceName,
        page: 1,
        size: 1
      });
      
      if (res.performances && res.performances.length > 0) {
        const normalized = normalizePerformance(res.performances[0]);
        return normalized.id || normalized.performanceId;
      }
      return null;
    } catch (err) {
      console.error('공연 검색 실패:', err);
      return null;
    }
  };

  // 공연 후기 작성 완료
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reviewData.title || !reviewData.content) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      // performanceId 찾기
      let finalPerformanceId = performanceId;
      
      // performanceId가 없으면 공연명으로 검색
      if (!finalPerformanceId && ticketData?.performanceName) {
        finalPerformanceId = await findPerformanceIdByName(ticketData.performanceName);
      }
      
      if (!finalPerformanceId) {
        alert('공연 정보를 찾을 수 없습니다. 공연명을 확인해주세요.');
        return;
      }

      // ticketId 가져오기
      const ticketId = ticketData?.ticketId || ticketData?.id || null;
      
      const requestDto = normalizePerformanceReviewRequest(
        {
          title: reviewData.title,
          content: reviewData.content,
          rating: reviewData.rating,
          // 티켓 정보 추가
          performanceDate: ticketData.performanceDate || '',
          performanceTime: ticketData.performanceTime || '',
          section: ticketData.section || '',
          row: ticketData.row || '',
          number: ticketData.number || ''
        },
        finalPerformanceId,
        'AFTER',
        ticketId
      );
      
      await createPerformanceReview(requestDto);
      
      // 공연 리뷰 작성 완료 시 REVIEW_WRITE 로그 기록
      try {
        await logApi.createLog({
          eventType: "REVIEW_WRITE",
          targetType: "PERFORMANCE",
          targetId: String(finalPerformanceId)
        });
      } catch (logErr) {
        console.error('로그 기록 실패:', logErr);
      }

      // 다음 페이지가 있으면 이동 (공연장 리뷰 작성)
      if (nextPage) {
        navigate(nextPage, { 
          state: { 
            ticketData: {
              ...ticketData,
              ticketId: ticketData.ticketId || ticketData.id,
              performanceId: finalPerformanceId
            },
            performanceId: finalPerformanceId,
            placeId: ticketData.placeId || location.state?.placeId || null
          } 
        });
      } else {
        // 성공 후 이동
        if (performanceId) {
          navigate(`/culture/${performanceId}?tab=review`);
        } else {
          navigate('/my/tickets');
          window.dispatchEvent(new Event('ticketUpdated'));
        }
      }
    } catch (err) {
      console.error('공연 후기 등록 실패:', err);
      alert(err.response?.data?.message || err.message || '공연 후기 등록에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    if (performanceId) {
      navigate(`/culture/${performanceId}`);
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
        <h2 className={styles.headerTitle}>공연 후기 작성</h2>
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
              placeholder="내용을 입력하세요"
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
              {nextPage ? '다음' : '작성하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PerformanceReviewRegisterPage;

