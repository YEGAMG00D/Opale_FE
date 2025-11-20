import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyReviewCard.module.css';

const MyReviewCard = ({
  review,
  reviewType, // 'AFTER', 'EXPECTATION', 'PLACE'
  onEdit,
  onDelete
}) => {
  const navigate = useNavigate();

  // 공연명 또는 공연장명 가져오기
  const getTargetName = () => {
    if (reviewType === 'PLACE') {
      return review.placeName || review.place?.name || '공연장';
    } else {
      // API 응답의 performanceTitle 필드 사용
      return review.performanceTitle || 
             review.performanceName || 
             review.performance?.title || 
             review.title || 
             '공연';
    }
  };

  // 상세 페이지로 이동
  const handleCardClick = () => {
    if (reviewType === 'PLACE') {
      const placeId = review.placeId || review.place?.id;
      if (placeId) {
        navigate(`/place/${placeId}`);
      }
    } else {
      const performanceId = review.performanceId || review.performance?.id;
      if (performanceId) {
        navigate(`/culture/${performanceId}`);
      }
    }
  };

  const targetName = getTargetName();
  const rating = review.rating || review.score || 0;
  const content = review.content || review.contents || review.reviewContent || '';
  const author = review.author || review.user?.nickname || review.nickname || '익명';
  const date = review.date || (review.createdAt ? new Date(review.createdAt).toLocaleDateString('ko-KR') : '');

  return (
    <div className={styles.reviewWrapper}>
      {/* 수정/삭제 버튼 영역 */}
      <div className={styles.reviewActions}>
        <button
          className={styles.editButton}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(review, reviewType);
          }}
        >
          수정
        </button>
        <button
          className={styles.deleteButton}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(review.id || review.performanceReviewId || review.reviewId, reviewType);
          }}
        >
          삭제
        </button>
      </div>

      {/* 리뷰 카드 */}
      <div className={styles.reviewCard} onClick={handleCardClick}>
        {/* 공연명/공연장명 */}
        <div className={styles.targetName}>
          {targetName}
        </div>

        {/* 리뷰 제목 */}
        {review.title && (
          <h5 className={styles.reviewTitle}>{review.title}</h5>
        )}

        {/* 관람일자, 관람 시간, 좌석 정보 */}
        {(review.performanceDate || review.performanceTime || review.seat) && (
          <div className={styles.reviewMeta}>
            <span className={styles.reviewMetaText}>
              |{' '}
              {review.performanceDate && <>{review.performanceDate}</>}
              {review.performanceTime && (
                <>{review.performanceDate ? ' ' : ''}{review.performanceTime}</>
              )}
              {review.seat && (
                <>{review.performanceDate || review.performanceTime ? ' ' : ''}{review.seat}</>
              )}
            </span>
          </div>
        )}

        {/* 평점 - 기대평(EXPECTATION)일 때는 표시하지 않음 */}
        {reviewType !== 'EXPECTATION' && (
          <div className={styles.reviewRating}>
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`${styles.star} ${
                  i < Math.floor(rating) ? styles.filled : ''
                } ${
                  i === Math.floor(rating) && rating % 1 !== 0 ? styles.half : ''
                }`}
              >
                ★
              </span>
            ))}
          </div>
        )}

        {/* 리뷰 내용 */}
        <div className={styles.reviewContent}>
          <p className={styles.reviewText}>{content}</p>
        </div>

        {/* 작성자 및 날짜, 좌석 정보 */}
        <div className={styles.reviewFooter}>
          <span className={styles.reviewAuthor}>
            {author} | {date}
            {review.seat && (
              <> | {review.seat}</>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MyReviewCard;

