import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './DetailPlacePage.module.css';
import PlaceShowHistory from '../../components/place/PlaceShowHistory';
import PlaceReviewCard from '../../components/place/PlaceReviewCard';
import PlaceMap from '../../components/place/PlaceMap';
import { usePlaceDetail } from '../../hooks/usePlaceDetail';
import { usePlaceFacilities } from '../../hooks/usePlaceFacilities';
import { usePlaceStages } from '../../hooks/usePlaceStages';
import { fetchPlaceReviewsByPlace, createPlaceReview } from '../../api/reviewApi';
import { normalizePlaceReviews } from '../../services/normalizePlaceReview';
import { normalizePlaceReviewRequest } from '../../services/normalizePlaceReviewRequest';
import logApi from '../../api/logApi';

const DetailPlacePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const currentUserId = user?.userId || user?.id || null;
  const { place, loading, error } = usePlaceDetail(id);
  const { convenienceFacilities, parkingFacilities } = usePlaceFacilities(id);
  const { stages } = usePlaceStages(id);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [writeForm, setWriteForm] = useState({ title: '', content: '', rating: 5 });
  const [isStageTableOpen, setIsStageTableOpen] = useState(false);
  
  // 리뷰 데이터 상태
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);

  // 공연장 리뷰 데이터 로드 함수 (재사용 가능)
  const loadReviews = async () => {
    if (!id) return;

    try {
      setReviewsLoading(true);
      setReviewsError(null);

      // 공연장 리뷰는 PLACE 타입만 있음
      const apiData = await fetchPlaceReviewsByPlace(id, 'PLACE');
      
      // API 응답 구조 처리: apiData는 { reviews: [...], totalCount: ... } 형태 또는 빈 배열
      const reviewsData = Array.isArray(apiData) ? { reviews: [] } : apiData;

      const normalizedReviews = normalizePlaceReviews(reviewsData);
      setReviews(normalizedReviews);
    } catch (err) {
      console.error('공연장 리뷰 조회 실패:', err);
      setReviewsError(err.message || '리뷰를 불러오는 중 오류가 발생했습니다.');
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    loadReviews();
    
    // 공연장 상세 페이지 진입 시 VIEW 로그 기록 (로그인 상태일 때만)
    if (id && currentUserId) {
      logApi.createLog({
        eventType: "VIEW",
        targetType: "PLACE",
        targetId: String(id)
      }).catch((logErr) => {
        console.error('로그 기록 실패:', logErr);
      });
    }
  }, [id, currentUserId]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>공연장 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error || '공연장 정보를 찾을 수 없습니다.'}</p>
          <button onClick={() => navigate('/place')} className={styles.backBtn}>
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 시설특성 섹션 */}
      <div className={styles.section}>
        {/* 헤더 섹션 */}
        <div className={styles.header}>
          <div className={styles.sectionTitle}>{place.facilityType}</div>
          <h1 className={styles.title}>{place.name}</h1>
          <div className={styles.address}>{place.address}</div>
          <div className={styles.headerTop}>
            <div className={styles.ratingRow}>
              <span className={styles.star}>★</span>
              <span className={styles.rating}>
                {typeof place.rating === 'number' ? place.rating.toFixed(1) : parseFloat(place.rating || 0).toFixed(1)}
              </span>
              <span className={styles.count}>({place.reviewCount || 0})</span>
            </div>
            <a href={place.homepage} target="_blank" rel="noopener noreferrer" className={styles.homeButton}>
              홈
            </a>
          </div>
          
        </div>

        <div className={styles.facilityInfoContainer}>
          <div className={styles.facilityInfoTable}>
            <table className={styles.infoTable}>
              <tbody>
                <tr>
                  <th>개관연도</th>
                  <td>{place.openingYear}</td>
                </tr>
                <tr>
                  <th>객석수</th>
                  <td>총 {place.totalSeats.toLocaleString()}석</td>
                </tr>
                <tr>
                  <th>공연관 수</th>
                  <td>{place.numberOfStages}개</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles.mapArea}>
            <PlaceMap 
              latitude={place.latitude} 
              longitude={place.longitude}
              placeName={place.name}
            />
          </div>
        </div>
        <button className={styles.facilityDetailsButton}>
          <div className={styles.facilityDetailsContent}>
            <div className={styles.facilityGroup}>
              <span className={styles.facilityLabel}>편의시설:</span>
              {convenienceFacilities.length > 0 ? (
                <span className={styles.facilityItem}>√ {convenienceFacilities.join(', ')}</span>
              ) : (
                <span className={styles.noFacility}>-</span>
              )}
            </div>
            <div className={styles.facilityGroup}>
              <span className={styles.facilityLabel}>주차시설:</span>
              {parkingFacilities.length > 0 ? (
                <span className={styles.facilityItem}>√ {parkingFacilities.join(', ')}</span>
              ) : (
                <span className={styles.noFacility}>-</span>
              )}
            </div>
          </div>
        </button>
      </div>



      {/* 공연장 정보 */}
      <div className={styles.section}>
        <h2 
          className={styles.sectionTitle} 
          onClick={() => setIsStageTableOpen(!isStageTableOpen)}
          style={{ cursor: 'pointer' }}
        >
          공연관 정보
          <span className={styles.toggleIcon}>
            {isStageTableOpen ? '▲' : '▼'}
          </span>
        </h2>
        {isStageTableOpen && (
          <table className={styles.stageTable}>
            <thead>
              <tr>
                <th>공연관명</th>
                <th>객석수</th>
                <th>무대시설</th>
              </tr>
            </thead>
            <tbody>
              {stages.length > 0 ? (
                stages.map((stage) => (
                  <tr key={stage.id}>
                    <td>{stage.name}</td>
                    <td>
                      총 {stage.seatscale.toLocaleString()}석
                      {stage.disabledseatscale > 0 && (
                        <span className={styles.disabledSeats}> (장애인석 {stage.disabledseatscale}석)</span>
                      )}
                    </td>
                    <td>
                      {stage.stageFacilities.length > 0 ? (
                        <span className={styles.facilityItem}>√ {stage.stageFacilities.join(', ')}</span>
                      ) : (
                        <span className={styles.noFacility}>-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className={styles.empty}>
                    공연관 정보가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* 관련공연 (진행중인 작품 / 지난 작품) */}
      <div className={styles.section}>
        <PlaceShowHistory placeId={place.id} />
      </div>

      {/* 공연장 후기 */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>공연장 후기</h2>
        
        {/* 글쓰기 버튼 */}
        <div className={styles.writeButtonContainer}>
          <button 
            className={styles.writeButton}
            onClick={() => setShowWriteModal(true)}
          >
            후기 작성하기
          </button>
        </div>

        {/* 후기 목록 */}
        <div className={styles.reviewList}>
          <div className={styles.reviewListHeader}>
            <h4>후기 목록</h4>
            <span className={styles.sortOption}>인기순</span>
          </div>
          
          {reviewsLoading ? (
            <div className={styles.empty}>로딩 중...</div>
          ) : reviewsError ? (
            <div className={styles.empty} style={{ color: '#666' }}>
              {reviewsError}
            </div>
          ) : reviews.length === 0 ? (
            <div className={styles.empty}>등록된 후기가 없습니다.</div>
          ) : (
            reviews.map(review => (
              <PlaceReviewCard
                key={review.id}
                id={review.id}
                title={review.title}
                rating={review.rating}
                content={review.content}
                author={review.author}
                date={review.date}
              />
            ))
          )}
        </div>
      </div>

      {/* 글쓰기 모달 */}
      {showWriteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>후기 작성</h3>
              <button className={styles.closeButton} onClick={() => {
                setShowWriteModal(false);
                setWriteForm({ title: '', content: '', rating: 5 });
              }}>×</button>
            </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              
              if (!id) {
                alert('공연장 정보가 없습니다.');
                return;
              }

              try {
                // 요청 DTO 생성
                const requestDto = normalizePlaceReviewRequest(writeForm, id);

                // API 호출
                await createPlaceReview(requestDto);

                // 공연장 리뷰 작성 완료 시 REVIEW_WRITE 로그 기록
                try {
                  await logApi.createLog({
                    eventType: "REVIEW_WRITE",
                    targetType: "PLACE",
                    targetId: String(id)
                  });
                } catch (logErr) {
                  console.error('로그 기록 실패:', logErr);
                }

                // 성공 시 모달 닫고 폼 초기화
                setShowWriteModal(false);
                setWriteForm({ title: '', content: '', rating: 5 });

                // 리뷰 목록 다시 조회
                await loadReviews();
              } catch (err) {
                console.error('공연장 리뷰 작성 실패:', err);
                alert(err.response?.data?.message || err.message || '공연장 리뷰 작성에 실패했습니다.');
              }
            }} className={styles.writeForm}>
              <div className={styles.formGroup}>
                <label>제목</label>
                <input 
                  type="text" 
                  value={writeForm.title}
                  onChange={(e) => setWriteForm({...writeForm, title: e.target.value})}
                  placeholder="제목을 입력하세요"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>평점</label>
                <div className={styles.ratingInput}>
                  {[1,2,3,4,5].map(star => (
                    <button 
                      key={star} 
                      type="button"
                      className={`${styles.ratingStar} ${star <= writeForm.rating ? styles.filled : ''}`}
                      onClick={() => setWriteForm({...writeForm, rating: star})}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label>내용</label>
                <textarea 
                  value={writeForm.content}
                  onChange={(e) => setWriteForm({...writeForm, content: e.target.value})}
                  placeholder="내용을 입력하세요"
                  rows={6}
                  required
                />
              </div>
              
              <div className={styles.formActions}>
                <button type="button" className={styles.cancelButton} onClick={() => {
                  setShowWriteModal(false);
                  setWriteForm({ title: '', content: '', rating: 5 });
                }}>
                  취소
                </button>
                <button type="submit" className={styles.submitButton}>
                  작성하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailPlacePage;
