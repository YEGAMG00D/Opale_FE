import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './DetailPlacePage.module.css';
import PlaceShowHistory from '../../components/place/PlaceShowHistory';
import PlaceReviewCard from '../../components/place/PlaceReviewCard';
import { usePlaceDetail } from '../../hooks/usePlaceDetail';
import { usePlaceFacilities } from '../../hooks/usePlaceFacilities';
import { usePlaceStages } from '../../hooks/usePlaceStages';

const DetailPlacePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { place, loading, error } = usePlaceDetail(id);
  const { convenienceFacilities, parkingFacilities } = usePlaceFacilities(id);
  const { stages } = usePlaceStages(id);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [writeForm, setWriteForm] = useState({ title: '', content: '', rating: 5 });

  // 샘플 후기 데이터
  const sampleReviews = [
    {
      id: 1,
      title: '유니플렉스 관람 후기',
      content: '대학로에 위치한 작은 극장이지만 시설이 깔끔하고 관리가 잘 되어있어요. 관객석이 좁지 않아서 편안하게 관람할 수 있었습니다. 특히 2관은 중간 규모의 공연에 적합한 것 같아요. 주차장이 있어서 교통 접근성도 좋았고, 근처에 카페도 있어서 공연 전후로 시간 보내기 좋습니다.',
      rating: 4.5,
      author: '닉네임',
      date: '2025.11.20'
    },
    {
      id: 2,
      title: '좋은 공연장이에요',
      content: '여러 번 다녀본 공연장인데 항상 깨끗하고 직원들이 친절해요. 음향도 좋고 무대도 잘 보입니다. 다만 공연장이 3개나 있어서 처음 가면 헷갈릴 수 있으니 미리 확인하고 가시는 게 좋을 것 같아요.',
      rating: 5,
      author: '뮤지컬러버',
      date: '2025.11.18'
    }
  ];

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
      {/* 헤더 섹션 */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          {place.name}
          <a href={place.homepage} target="_blank" rel="noopener noreferrer" className={styles.linkIcon}>
            🔗
          </a>
        </h1>
      </div>

      {/* 공연시설 정보 */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>공연시설명</h2>
        <table className={styles.infoTable}>
          <tbody>
            <tr>
              <th>공연시설명</th>
              <td>{place.name}</td>
            </tr>
            <tr>
              <th>개관연도</th>
              <td>{place.openingYear}</td>
            </tr>
            <tr>
              <th>시설특성</th>
              <td>{place.facilityType}</td>
            </tr>
            <tr>
              <th>객석수</th>
              <td>총 {place.totalSeats.toLocaleString()}석</td>
            </tr>
            <tr>
              <th>공연장 수</th>
              <td>{place.numberOfStages}개</td>
            </tr>
            <tr>
              <th>홈페이지</th>
              <td>
                <a href={place.homepage} target="_blank" rel="noopener noreferrer" className={styles.homepageLink}>
                  {place.homepage}
                </a>
              </td>
            </tr>
            <tr>
              <th>주소</th>
              <td>{place.address}</td>
            </tr>
            <tr>
              <th>주요 시설</th>
              <td>
                <div className={styles.facilities}>
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
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 공연장 정보 */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>공연장정보</h2>
        <table className={styles.stageTable}>
          <thead>
            <tr>
              <th>공연장명</th>
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
          
          {sampleReviews.length > 0 ? (
            sampleReviews.map(review => (
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
          ) : (
            <div className={styles.empty}>표시할 후기가 없습니다.</div>
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
            
            <form onSubmit={(e) => {
              e.preventDefault();
              // 여기서 실제 글 업로드 로직을 구현
              console.log('후기 작성:', writeForm);
              setShowWriteModal(false);
              setWriteForm({ title: '', content: '', rating: 5 });
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
