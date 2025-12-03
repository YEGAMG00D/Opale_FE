import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyTicketPage.module.css';
import wickedPoster from '../../../assets/poster/wicked.gif';
import moulinRougePoster from '../../../assets/poster/moulin-rouge.gif';
import kinkyBootsPoster from '../../../assets/poster/kinky-boots.gif';
import hanbokManPoster from '../../../assets/poster/hanbok-man.jpg';
import deathNotePoster from '../../../assets/poster/death-note.gif';
import rentPoster from '../../../assets/poster/rent.gif';
import defaultTicketImage from '../../../assets/디폴트 티켓 이미지.jpg';
import { getTicketList, deleteTicket as deleteTicketApi, getTicketReviews, getTicket } from '../../../api/reservationApi';
import { normalizeTicketList, categorizeTickets } from '../../../services/normalizeTicketList';
import { normalizeTicketReviews } from '../../../services/normalizeTicketReviews';
import { normalizeTicketDetail } from '../../../services/normalizeTicketDetail';
import { deletePerformanceReview, deletePlaceReview } from '../../../api/reviewApi';
import { fetchPerformanceList } from '../../../api/performanceApi';
import { normalizePerformance } from '../../../services/normalizePerformance';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// 이미지 URL 처리 헬퍼 함수
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // 이미 절대 URL인 경우 그대로 반환
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // 상대 경로인 경우 API base URL과 결합
  if (imageUrl.startsWith('/')) {
    return `${API_BASE_URL}${imageUrl}`;
  }
  
  // 그 외의 경우 그대로 반환 (이미지 이름 등)
  return imageUrl;
};

const MyTicketPage = () => {
  const navigate = useNavigate();
  const [allTickets, setAllTickets] = useState([]); // API에서 받은 전체 티켓 목록
  const [flippedTickets, setFlippedTickets] = useState({});
  const [activeTab, setActiveTab] = useState('booked'); // 'booked' (예매한 공연) or 'watched' (관람한 공연)
  const [posterCache, setPosterCache] = useState({}); // 공연명 -> 포스터 URL 캐시
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [ticketReviews, setTicketReviews] = useState({}); // 티켓별 리뷰 정보 { ticketId: { hasPerformanceReview, hasPlaceReview, performanceId, placeId } }

  // 포스터 이미지 매핑 (fallback용)
  const posterImages = {
    'wicked': wickedPoster,
    '위키드': wickedPoster,
    'moulin-rouge': moulinRougePoster,
    '물랑루즈': moulinRougePoster,
    'kinky-boots': kinkyBootsPoster,
    '킹키부츠': kinkyBootsPoster,
    'hanbok-man': hanbokManPoster,
    '한복입은남자': hanbokManPoster,
    'death-note': deathNotePoster,
    '데스노트': deathNotePoster,
    'rent': rentPoster,
    '렌트': rentPoster
  };

  // 공연명으로 포스터 이미지 가져오기 (API 사용)
  const fetchPosterByPerformanceName = async (performanceName) => {
    if (!performanceName) return null;
    
    // 캐시에 있으면 반환
    if (posterCache[performanceName]) {
      return posterCache[performanceName];
    }

    try {
      const res = await fetchPerformanceList({
        keyword: performanceName,
        page: 1,
        size: 1
      });
      
      if (res.performances && res.performances.length > 0) {
        const normalized = normalizePerformance(res.performances[0]);
        const posterUrl = normalized.poster || normalized.posterImage || normalized.image;
        
        if (posterUrl) {
          // getImageUrl 함수로 URL 처리
          const fullPosterUrl = getImageUrl(posterUrl);
          
          if (fullPosterUrl) {
            // 캐시에 저장
            setPosterCache(prev => ({
              ...prev,
              [performanceName]: fullPosterUrl
            }));
            
            return fullPosterUrl;
          }
        }
      }
    } catch (err) {
      console.error('포스터 검색 실패:', err);
    }
    
    return null;
  };

  // 공연명에서 fallback 포스터 찾기 (동기 함수)
  const getFallbackPoster = (performanceName) => {
    if (!performanceName) return defaultTicketImage;
    
    const nameLower = performanceName.toLowerCase();
    for (const [key, image] of Object.entries(posterImages)) {
      if (nameLower.includes(key.toLowerCase())) {
        return image;
      }
    }
    
    return defaultTicketImage;
  };

  // 공연명으로 포스터 이미지 가져오기 (비동기, API 우선)
  const getPosterImage = async (performanceName) => {
    if (!performanceName) return getFallbackPoster(performanceName);
    
    // 먼저 API로 검색
    const apiPoster = await fetchPosterByPerformanceName(performanceName);
    if (apiPoster) {
      return apiPoster;
    }
    
    // API에서 못 찾으면 fallback 이미지 사용
    return getFallbackPoster(performanceName);
  };

  // 티켓별 리뷰 정보 조회
  const loadTicketReviews = async (tickets) => {
    const reviewsMap = {};
    
    for (const ticket of tickets) {
      const ticketId = ticket.ticketId || ticket.id;
      if (!ticketId) continue;
      
      try {
        const reviewsResponse = await getTicketReviews(ticketId);
        const normalizedReviews = normalizeTicketReviews(reviewsResponse);
        
        reviewsMap[ticketId] = {
          hasPerformanceReview: normalizedReviews.hasPerformanceReview,
          hasPlaceReview: normalizedReviews.hasPlaceReview,
          performanceId: normalizedReviews.performanceReview?.performanceId || ticket.performanceId || null,
          placeId: normalizedReviews.placeReview?.placeId || ticket.placeId || null
        };
      } catch (err) {
        // 리뷰가 없거나 조회 실패 시 기본값
        reviewsMap[ticketId] = {
          hasPerformanceReview: false,
          hasPlaceReview: false,
          performanceId: ticket.performanceId || null,
          placeId: ticket.placeId || null
        };
      }
    }
    
    setTicketReviews(prev => ({ ...prev, ...reviewsMap }));
  };

  // 티켓 목록 불러오기 (API)
  const loadTickets = async (pageNum = 1, append = false) => {
    try {
      setIsLoading(true);
      const response = await getTicketList(pageNum, 50); // 한 번에 많이 가져오기
      
      // API 응답을 프론트엔드 형식으로 변환
      const normalized = normalizeTicketList(response);
      
      const ticketsToSet = append ? [...allTickets, ...normalized.tickets] : normalized.tickets;
      
      if (append) {
        // 추가 로드 (페이지네이션)
        setAllTickets(prev => [...prev, ...normalized.tickets]);
      } else {
        // 초기 로드 또는 새로고침
        setAllTickets(normalized.tickets);
      }
      
      setHasMore(normalized.hasNext);
      setPage(normalized.currentPage);
      
      // 포스터 캐시 초기화하여 다시 로드
      setTicketPosters({});
      setPosterCache({});
      
      // 티켓별 리뷰 정보 조회 (관람한 공연 탭일 때만)
      if (activeTab === 'watched') {
        await loadTicketReviews(normalized.tickets);
      }
    } catch (err) {
      console.error('티켓 목록 조회 실패:', err);
      alert('티켓 목록을 불러오는데 실패했습니다.');
      setAllTickets([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    loadTickets(1, false);
  }, []);

  // 티켓 목록 업데이트를 위한 이벤트 리스너
  useEffect(() => {
    const handleTicketUpdate = () => {
      loadTickets(1, false);
    };

    window.addEventListener('ticketUpdated', handleTicketUpdate);

    return () => {
      window.removeEventListener('ticketUpdated', handleTicketUpdate);
    };
  }, []);

  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm('티켓을 삭제하시겠습니까?\n관련된 리뷰도 함께 삭제됩니다.')) {
      return;
    }

    try {
      // 1. 먼저 관련 리뷰 확인
      const reviewsResponse = await getTicketReviews(ticketId);
      const normalizedReviews = normalizeTicketReviews(reviewsResponse);

      // 2. 공연 리뷰가 있으면 먼저 삭제
      if (normalizedReviews.hasPerformanceReview && normalizedReviews.performanceReview) {
        const performanceReviewId = normalizedReviews.performanceReview.performanceReviewId || 
                                   normalizedReviews.performanceReview.id ||
                                   normalizedReviews.performanceReview.reviewId;
        
        if (performanceReviewId) {
          try {
            await deletePerformanceReview(performanceReviewId);
            console.log('공연 리뷰 삭제 완료');
          } catch (err) {
            console.error('공연 리뷰 삭제 실패:', err);
            // 리뷰 삭제 실패해도 티켓 삭제는 계속 진행
          }
        }
      }

      // 3. 공연장 리뷰가 있으면 삭제
      if (normalizedReviews.hasPlaceReview && normalizedReviews.placeReview) {
        const placeReviewId = normalizedReviews.placeReview.placeReviewId || 
                             normalizedReviews.placeReview.id ||
                             normalizedReviews.placeReview.reviewId;
        
        if (placeReviewId) {
          try {
            await deletePlaceReview(placeReviewId);
            console.log('공연장 리뷰 삭제 완료');
          } catch (err) {
            console.error('공연장 리뷰 삭제 실패:', err);
            // 리뷰 삭제 실패해도 티켓 삭제는 계속 진행
          }
        }
      }

      // 4. 마지막으로 티켓 삭제
      await deleteTicketApi(ticketId);
      
      // 5. 목록 새로고침
      loadTickets(1, false);
      
      // 6. 플립 상태도 제거
      setFlippedTickets(prev => {
        const newState = { ...prev };
        delete newState[ticketId];
        return newState;
      });

      alert('티켓이 삭제되었습니다.');
    } catch (err) {
      console.error('티켓 삭제 실패:', err);
      const errorMessage = err.response?.data?.message || err.message || '티켓 삭제에 실패했습니다.';
      alert(errorMessage);
    }
  };

  const handleFlipTicket = (ticketId) => {
    setFlippedTickets(prev => ({
      ...prev,
      [ticketId]: !prev[ticketId]
    }));
  };

  // 탭별 티켓 필터링 (예매한 공연/관람한 공연 분류)
  const { booked, watched } = categorizeTickets(allTickets);
  const filteredTickets = activeTab === 'booked' ? booked : watched;
  
  // 탭 변경 시 리뷰 정보 다시 조회
  useEffect(() => {
    if (activeTab === 'watched' && filteredTickets.length > 0) {
      loadTicketReviews(filteredTickets);
    }
  }, [activeTab, filteredTickets.length]);

  // 티켓별 포스터 이미지 상태
  const [ticketPosters, setTicketPosters] = useState({});

  // 티켓 포스터 이미지 로드
  useEffect(() => {
    const loadPosters = async () => {
      const posters = {};
      for (const ticket of filteredTickets) {
        if (ticket.performanceName && !ticketPosters[ticket.id]) {
          // 먼저 fallback 이미지로 설정 (빠른 표시)
          posters[ticket.id] = getFallbackPoster(ticket.performanceName);
          
          // 그 다음 API로 검색해서 업데이트
          const apiPoster = await fetchPosterByPerformanceName(ticket.performanceName);
          if (apiPoster) {
            posters[ticket.id] = apiPoster;
          }
        }
      }
      if (Object.keys(posters).length > 0) {
        setTicketPosters(prev => ({ ...prev, ...posters }));
      }
    };
    
    loadPosters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredTickets.length, activeTab]);

  return (
    <div className={styles.container}>
      {/* 상단 헤더 */}
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>MY 티켓</h2>
        <button 
          className={styles.registerButton}
          onClick={() => navigate('/my/tickets/register')}
        >
          티켓 등록하기
        </button>
      </div>

      {/* 탭 메뉴 */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'booked' ? styles.active : ''}`}
          onClick={() => setActiveTab('booked')}
        >
          예매한 공연
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'watched' ? styles.active : ''}`}
          onClick={() => setActiveTab('watched')}
        >
          관람한 공연
        </button>
      </div>

      {/* 티켓 목록 */}
      <div className={styles.ticketList}>
        {isLoading ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🎫</div>
            <p className={styles.emptyText}>티켓 목록을 불러오는 중...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🎫</div>
            <p className={styles.emptyText}>
              {activeTab === 'booked' 
                ? '예매한 공연이 없습니다'
                : '관람한 공연이 없습니다'}
            </p>
            <p className={styles.emptySubText}>티켓 등록하기 버튼을 눌러 티켓을 등록해보세요</p>
          </div>
        ) : (
          <div className={styles.ticketGrid}>
            {filteredTickets.map((ticket) => {
              const isFlipped = flippedTickets[ticket.id] || false;
              const posterImage = ticketPosters[ticket.id] || getFallbackPoster(ticket.performanceName);
              
              return (
                <div key={ticket.id} className={styles.ticketCardWrapper}>
                  <div 
                    className={`${styles.ticketCard} ${isFlipped ? styles.flipped : ''}`}
                    onClick={() => handleFlipTicket(ticket.id)}
                  >
                    {/* 앞면: 포스터 + 제목 */}
                    <div className={styles.ticketFront}>
                      <button 
                        className={styles.deleteButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTicket(ticket.id);
                        }}
                      >
                        ×
                      </button>
                      {posterImage && (
                        <div className={styles.ticketPoster}>
                          <img 
                            src={posterImage} 
                            alt={ticket.performanceName}
                            className={styles.posterImage}
                          />
                          <div className={styles.posterOverlay}></div>
                        </div>
                      )}
                      <div className={styles.ticketTitleSection}>
                        <h3 className={styles.ticketPerformanceName}>{ticket.performanceName}</h3>
                        <div className={styles.ticketDateInfo}>
                          {ticket.performanceDate} {ticket.performanceTime && ticket.performanceTime}
                        </div>
                      </div>
                    </div>
                    
                    {/* 뒷면: 좌석 정보 */}
                    <div className={styles.ticketBack}>
                      <div className={styles.ticketBackHeader}>
                        <h3 className={styles.ticketBackTitle}>{ticket.performanceName}</h3>
                        <button 
                          className={styles.deleteButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTicket(ticket.id);
                          }}
                        >
                          ×
                        </button>
                      </div>
                      <div className={styles.ticketBackBody}>
                        <div className={styles.ticketInfoRow}>
                          <span className={styles.ticketLabel}>공연일자</span>
                          <span className={styles.ticketValue}>
                            {ticket.performanceDate} {ticket.performanceTime && ticket.performanceTime}
                          </span>
                        </div>
                        {(ticket.section || ticket.row || ticket.number) && (
                          <div className={styles.ticketInfoRow}>
                            <span className={styles.ticketLabel}>좌석정보</span>
                            <span className={styles.ticketValue}>
                              {ticket.section || ''} {ticket.row ? `${ticket.row}열` : ''} {ticket.number ? `${ticket.number}번` : ''}
                            </span>
                          </div>
                        )}
                        <div className={styles.ticketInfoRow}>
                          <span className={styles.ticketLabel}>등록일</span>
                          <span className={styles.ticketValue}>{ticket.registeredDate}</span>
                        </div>
                        <button
                          className={styles.editButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            // API를 사용하므로 ticketId를 전달
                            const ticketId = ticket.ticketId || ticket.id;
                            navigate('/my/tickets/edit', { state: { ticketId } });
                          }}
                        >
                          수정하기
                        </button>
                      </div>
                    </div>
                  </div>
                  {activeTab === 'watched' && (() => {
                    const ticketId = ticket.ticketId || ticket.id;
                    const reviewInfo = ticketReviews[ticketId] || {
                      hasPerformanceReview: false,
                      hasPlaceReview: false,
                      performanceId: ticket.performanceId || null,
                      placeId: ticket.placeId || null
                    };
                    
                    return (
                      <div className={styles.reviewButtons}>
                        <button 
                          className={styles.reviewButton}
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (reviewInfo.hasPerformanceReview && reviewInfo.performanceId) {
                              navigate(`/culture/${reviewInfo.performanceId}?tab=review`);
                            } else {
                              try {
                                // 티켓 단일 조회로 placeId, performanceId 가져오기
                                const ticketDetailResponse = await getTicket(ticketId);
                                const normalizedTicketDetail = normalizeTicketDetail(ticketDetailResponse);
                                
                                // 공연장 리뷰 작성 여부 확인
                                const reviewsResponse = await getTicketReviews(ticketId);
                                const normalizedReviews = normalizeTicketReviews(reviewsResponse);
                                
                                navigate('/my/performanceReviews/register', {
                                  state: {
                                    ticketData: {
                                      ...ticket,
                                      ticketId: ticketId,
                                      id: ticketId,
                                      performanceId: normalizedTicketDetail?.performanceId || null,
                                      placeId: normalizedTicketDetail?.placeId || null
                                    },
                                    performanceId: normalizedTicketDetail?.performanceId || null,
                                    placeId: normalizedTicketDetail?.placeId || null,
                                    // 공연장 리뷰가 없으면 공연장 리뷰 작성 페이지로 이동
                                    nextPage: normalizedReviews.hasPlaceReview ? null : '/my/placeReviews/register'
                                  }
                                });
                              } catch (err) {
                                console.error('티켓 정보 조회 실패:', err);
                                alert('티켓 정보를 불러오는데 실패했습니다.');
                              }
                            }
                          }}
                        >
                          {reviewInfo.hasPerformanceReview ? '공연 후기로 이동' : '공연 후기 작성'}
                        </button>
                        <button 
                          className={styles.reviewButton}
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (reviewInfo.hasPlaceReview && reviewInfo.placeId) {
                              navigate(`/place/${reviewInfo.placeId}`);
                            } else {
                              try {
                                // 티켓 단일 조회로 placeId, performanceId 가져오기
                                const ticketDetailResponse = await getTicket(ticketId);
                                const normalizedTicketDetail = normalizeTicketDetail(ticketDetailResponse);
                                
                                if (!normalizedTicketDetail?.placeId) {
                                  alert('공연장 정보가 없습니다. 티켓에 공연장 정보가 포함되어 있는지 확인해주세요.');
                                  return;
                                }
                                
                                navigate('/my/placeReviews/register', {
                                  state: {
                                    ticketData: {
                                      ...ticket,
                                      ticketId: ticketId,
                                      id: ticketId,
                                      performanceId: normalizedTicketDetail?.performanceId || null,
                                      placeId: normalizedTicketDetail?.placeId || null
                                    },
                                    placeId: normalizedTicketDetail?.placeId || null
                                  }
                                });
                              } catch (err) {
                                console.error('티켓 정보 조회 실패:', err);
                                alert('티켓 정보를 불러오는데 실패했습니다.');
                              }
                            }
                          }}
                        >
                          {reviewInfo.hasPlaceReview ? '공연장 리뷰로 이동' : '공연장 리뷰 작성'}
                        </button>
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default MyTicketPage;

