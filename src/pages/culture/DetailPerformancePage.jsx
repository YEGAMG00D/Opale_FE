import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import styles from './DetailPerformancePage.module.css';
import PerformancePoster from '../../components/culture/PerformancePoster';
import PerformanceInfoCard from '../../components/culture/PerformanceInfoCard';
import PerformanceTrailer from '../../components/culture/PerformanceTrailer';
import PerformanceDetails from '../../components/culture/PerformanceDetails';
import BookingLinks from '../../components/culture/BookingLinks';
import OpenChatSection from '../../components/culture/OpenChatSection';
import ReviewCard from '../../components/culture/ReviewCard';

const DetailPerformancePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('reservation');
  const [isFavorite, setIsFavorite] = useState(false);
  const [expandedExpectations, setExpandedExpectations] = useState({});
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [writeType, setWriteType] = useState('review'); // 'review' or 'expectation'
  const [writeForm, setWriteForm] = useState({ title: '', content: '', rating: 5 });
  const [activeReviewTab, setActiveReviewTab] = useState('review'); // 'review' or 'expectation'

  // 샘플 후기 데이터
  const sampleReviews = [
    {
      id: 1,
      title: '위키드 관람 후기',
      content: '중력을 거슬러 저도 올라가고 싶어지네요. 엘파바의 목소리가 정말 감동적이었고, 글린다와의 우정도 아름다웠습니다. 특히 Defying Gravity 장면에서는 정말 소름이 돋았어요. 13년 만의 내한 공연이라 더욱 특별했던 것 같습니다. 외국인 관객들도 많아서 국제적인 분위기도 느낄 수 있었고, 뮤지컬을 통해 새로운 친구들도 만날 수 있어서 정말 좋았습니다.',
      rating: 4.5,
      author: '닉네임',
      date: '2025.11.20',
      performanceDate: '2025.11.05 19:00',
      seat: '1층-15열-중간'
    },
    {
      id: 2,
      title: '위키드 2차 관람 후기',
      content: '두 번째 관람이었는데도 여전히 감동적이었습니다. 이번에는 다른 배우분들의 연기를 보게 되어서 더욱 흥미로웠어요. 특히 글린다 역할의 배우분이 정말 귀여우면서도 깊이가 있었습니다.',
      rating: 5,
      author: '뮤지컬러버',
      date: '2025.11.18',
      performanceDate: '2025.11.10 14:00',
      seat: '2층-8열-왼쪽'
    }
  ];

  // 샘플 기대평 데이터
  const sampleExpectations = [
    {
      id: 1,
      title: '위키드 너무 기다렸어...',
      content: '위키드 너무 기다렸어... 중력을 거슬러 저도 올라가고 싶어지네요. It\'s time to fly defying gravity--- 정말 오랜만에 한국에서 공연한다고 해서 벌써부터 설레요. 원작 위키드를 한국에서 볼 수 있다니 꿈만 같아요. 엘파바와 글린다의 이야기가 어떻게 펼쳐질지 정말 기대됩니다!',
      author: '위키드팬',
      date: '2025.11.20'
    },
    {
      id: 2,
      title: '13년 만의 내한 공연!',
      content: '13년 만의 내한 공연이라니! 이번 기회를 놓치면 언제 또 볼 수 있을지 모르니까 꼭 가야겠어요. 특히 Defying Gravity 장면을 직접 보고 싶어요.',
      author: '뮤지컬매니아',
      date: '2025.11.19'
    }
  ];

  // 모든 공연 데이터
  const allPerformances = {
    1: {
      id: 1,
      category: "뮤지컬",
      title: "위키드",
      englishTitle: "WICKED",
      venue: "블루스퀘어 신한카드홀",
      address: "서울 용산구 이태원로 294",
      date: "2025.07.12. (토)~2025.10.26. (일)",
      duration: "170분 (인터미션 포함)",
      ageLimit: "8세 이상 관람가(2018년 포함 이전 출생자)",
      rating: 4.6,
      reviewCount: 210,
      hashtags: ["#13년 만의 내한 공연", "#글로벌 메가 히트 뮤지컬", "#오즈의 마법사 프리퀄"],
      genre: "판타지 환상적 드라마틱",
      description: "두 소녀 엘파바와 글린다가 오즈에서 만나 경쟁과 우정을 나누며, 세상에 알려지지 않은 마녀들의 진실을 드러내는 이야기",
      image: "wicked",
      trailerImage: "wicked",
      prices: [
        { seat: "VIP석", price: "190,000원" },
        { seat: "R석", price: "160,000원" },
        { seat: "S석", price: "130,000원" },
        { seat: "A석", price: "80,000원" }
      ]
    },
    2: {
      id: 2,
      category: "뮤지컬",
      title: "물랑루즈!",
      englishTitle: "MOULIN ROUGE!",
      venue: "BLUESQUARE 신한카드홀",
      address: "서울 용산구 이태원로 294",
      date: "2025.11.27~2026.02.22",
      duration: "150분 (인터미션 포함)",
      ageLimit: "12세 이상 관람가",
      rating: 4.7,
      reviewCount: 189,
      hashtags: ["#WINNER! 10 TONY AWARDS", "#BEST MUSICAL", "#세기의 러브스토리"],
      genre: "로맨스 뮤지컬 드라마",
      description: "파리의 몽마르트 언덕, 물랑루즈라는 사랑과 열정의 무대에서 펼쳐지는 감동적인 사랑 이야기",
      image: "moulin-rouge",
      trailerImage: "moulin-rouge",
      prices: [
        { seat: "VIP석", price: "180,000원" },
        { seat: "R석", price: "150,000원" },
        { seat: "S석", price: "120,000원" },
        { seat: "A석", price: "70,000원" }
      ]
    },
    3: {
      id: 3,
      category: "뮤지컬",
      title: "킹키부츠",
      englishTitle: "KINKY BOOTS",
      venue: "샤롯데씨어터",
      address: "서울 송파구 올림픽로 240",
      date: "2025.12.17 - 2026.03.29",
      duration: "165분 (인터미션 포함)",
      ageLimit: "8세 이상 관람가",
      rating: 4.8,
      reviewCount: 156,
      hashtags: ["#토니상 최우수 뮤지컬", "#감동 코미디", "#차별화의 미학"],
      genre: "코미디 뮤지컬 드라마",
      description: "구두 공장과 드래그 퀸의 만남을 통해 진정한 자기 자신을 찾아가는 따뜻하고 유쾌한 이야기",
      image: "kinky-boots",
      trailerImage: "kinky-boots",
      prices: [
        { seat: "VIP석", price: "170,000원" },
        { seat: "R석", price: "140,000원" },
        { seat: "S석", price: "110,000원" },
        { seat: "A석", price: "70,000원" }
      ]
    },
    4: {
      id: 4,
      category: "뮤지컬",
      title: "한복입은남자",
      englishTitle: "The Man in Hanbok",
      venue: "충무아트센터 대극장",
      address: "서울 중구 퇴계로 387",
      date: "2025.12.02~2026.03.08",
      duration: "140분 (인터미션 포함)",
      ageLimit: "7세 이상 관람가",
      rating: 4.5,
      reviewCount: 98,
      hashtags: ["#창작뮤지컬", "#장영실", "#과학과 예술의 만남"],
      genre: "역사 창작 드라마",
      description: "조선의 천재 과학자 장영실과 레오나르도 다 빈치가 만난다면? 상상력 넘치는 창작 뮤지컬",
      image: "hanbok-man",
      trailerImage: "hanbok-man",
      prices: [
        { seat: "VIP석", price: "150,000원" },
        { seat: "R석", price: "120,000원" },
        { seat: "S석", price: "90,000원" },
        { seat: "A석", price: "60,000원" }
      ]
    },
    5: {
      id: 5,
      category: "뮤지컬",
      title: "데스노트",
      englishTitle: "DEATH NOTE",
      venue: "디큐브 링크아트센터",
      address: "서울 강남구 영동대로 513",
      date: "2025.10.14 ~ 2026.05.10",
      duration: "160분 (인터미션 포함)",
      ageLimit: "13세 이상 관람가",
      rating: 4.4,
      reviewCount: 167,
      hashtags: ["#일본 최고 인기작", "#스릴러 뮤지컬", "#정의와 광기의 대결"],
      genre: "스릴러 판타지 드라마",
      description: "죽음의 노트를 손에 넣은 라이토와 세계 최고의 수사관 L의 숨 막히는 두뇌 게임",
      image: "death-note",
      trailerImage: "death-note",
      prices: [
        { seat: "VIP석", price: "180,000원" },
        { seat: "R석", price: "150,000원" },
        { seat: "S석", price: "120,000원" },
        { seat: "A석", price: "80,000원" }
      ]
    },
    6: {
      id: 6,
      category: "뮤지컬",
      title: "RENT",
      englishTitle: "RENT",
      venue: "coexartium",
      address: "서울 강남구 영동대로 513",
      date: "2025.11.09 ~ 2026.02.22",
      duration: "155분 (인터미션 포함)",
      ageLimit: "15세 이상 관람가",
      rating: 4.9,
      reviewCount: 234,
      hashtags: ["#퓰리처상 수상작", "#세기의 명작", "#사랑과 삶의 순간들"],
      genre: "로큰롤 뮤지컬 드라마",
      description: "뉴욕 동쪽 마을의 젊은 예술가들의 꿈과 사랑, 그리고 삶의 의미를 그린 감동적인 명작",
      image: "rent",
      trailerImage: "rent",
      prices: [
        { seat: "VIP석", price: "190,000원" },
        { seat: "R석", price: "160,000원" },
        { seat: "S석", price: "130,000원" },
        { seat: "A석", price: "80,000원" }
      ]
    }
  };

  // ID를 숫자로 변환하고 공연 데이터 찾기
  const performanceId = parseInt(id, 10);
  const performance = allPerformances[performanceId] || allPerformances[1];
  
  // 포스터 확장자 매핑
  const posterExt = {
    'wicked': 'gif',
    'moulin-rouge': 'gif',
    'kinky-boots': 'gif',
    'hanbok-man': 'jpg',
    'death-note': 'gif',
    'rent': 'gif'
  };
  
  // 페이지 로드 시 로그 (디버깅용)
  useEffect(() => {
    console.log('DetailPerformancePage mounted with id:', id);
  }, [id]);

  const tabs = [
    { id: 'reservation', label: '예매정보' },
    { id: 'detail', label: '상세정보' },
    { id: 'review', label: '후기/기대평' },
    { id: 'venue', label: '공연장 정보' }
  ];

  const bookingSites = [
    { name: "티켓링크", logo: "TL" },
    { name: "네이버 예약", logo: "N", color: "#03C75A" },
    { name: "yes24", logo: "Y" },
    { name: "NOL", logo: "N" }
  ];

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const toggleExpectationExpansion = (expectationId) => {
    setExpandedExpectations(prev => ({
      ...prev,
      [expectationId]: !prev[expectationId]
    }));
  };

  const handleWriteClick = (type) => {
    setWriteType(type);
    setShowWriteModal(true);
  };

  const handleWriteSubmit = (e) => {
    e.preventDefault();
    // 여기서 실제 글 업로드 로직을 구현
    console.log('글 작성:', writeForm);
    setShowWriteModal(false);
    setWriteForm({ title: '', content: '', rating: 5 });
  };

  const handleWriteCancel = () => {
    setShowWriteModal(false);
    setWriteForm({ title: '', content: '', rating: 5 });
  };

  return (
    <div className={styles.container}>
      <PerformancePoster
        imageUrl={`/poster/${performance.image}.${posterExt[performance.image] || 'jpg'}`}
        isFavorite={isFavorite}
        onFavoriteToggle={toggleFavorite}
      />

      <PerformanceInfoCard
        category={performance.category}
        title={performance.title}
        englishTitle={performance.englishTitle}
        venue={performance.venue}
        address={performance.address}
        date={performance.date}
        duration={performance.duration}
        ageLimit={performance.ageLimit}
      />

      <PerformanceTrailer
        englishTitle={performance.englishTitle}
        title={performance.title}
        trailerImage={performance.trailerImage}
      />

      <PerformanceDetails
        rating={performance.rating}
        reviewCount={performance.reviewCount}
        hashtags={performance.hashtags}
        genre={performance.genre}
        description={performance.description}
      />

      <BookingLinks bookingSites={bookingSites} />

      <OpenChatSection />

      {/* Tabs */}
      <div className={styles.tabSection}>
        <div className={styles.tabs}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {activeTab === 'reservation' && (
            <div className={styles.reservationContent}>
              <h3 className={styles.contentTitle}>가격</h3>
              <div className={styles.priceList}>
                {performance.prices.map((price, index) => (
                  <div key={index} className={styles.priceItem}>
                    <span className={styles.seatType}>{price.seat}</span>
                    <span className={styles.seatPrice}>{price.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'detail' && (
            <div className={styles.detailContent}>
              <h3 className={styles.contentTitle}>상세 정보</h3>
              <div className={styles.detailText}>
                <p><strong>장르:</strong> {performance.genre}</p>
                <p><strong>관람 연령:</strong> {performance.ageLimit}</p>
                <p><strong>공연 시간:</strong> {performance.duration}</p>
                <p><strong>공연 기간:</strong> {performance.date}</p>
                <p><strong>공연장:</strong> {performance.venue}</p>
                <p><strong>주소:</strong> {performance.address}</p>
                <br/>
                <p>{performance.description}</p>
              </div>
            </div>
          )}
          
          {activeTab === 'review' && (
            <div className={styles.reviewContent}>
              <h3 className={styles.contentTitle}>후기 / 기대평</h3>
              
              {/* 후기/기대평 탭 */}
              <div className={styles.reviewTabs}>
                <button 
                  className={`${styles.reviewTab} ${activeReviewTab === 'review' ? styles.activeReviewTab : ''}`}
                  onClick={() => setActiveReviewTab('review')}
                >
                  후기
                </button>
                <button 
                  className={`${styles.reviewTab} ${activeReviewTab === 'expectation' ? styles.activeReviewTab : ''}`}
                  onClick={() => setActiveReviewTab('expectation')}
                >
                  기대평
                </button>
              </div>

              {/* 글쓰기 버튼 */}
              <div className={styles.writeButtonContainer}>
                <button 
                  className={styles.writeButton}
                  onClick={() => handleWriteClick(activeReviewTab)}
                >
                  {activeReviewTab === 'review' ? '후기 작성하기' : '기대평 작성하기'}
                </button>
              </div>

              {/* 후기 목록 */}
              {activeReviewTab === 'review' && (
                <div className={styles.reviewList}>
                  <div className={styles.reviewListHeader}>
                    <h4>후기 목록</h4>
                    <span className={styles.sortOption}>인기순</span>
                  </div>
                  
                  {sampleReviews.map(review => (
                    <ReviewCard
                      key={review.id}
                      id={review.id}
                      title={review.title}
                      performanceDate={review.performanceDate}
                      seat={review.seat}
                      rating={review.rating}
                      content={review.content}
                      author={review.author}
                      date={review.date}
                    />
                  ))}
                </div>
              )}

              {/* 기대평 목록 */}
              {activeReviewTab === 'expectation' && (
                <div className={styles.expectationList}>
                  <div className={styles.expectationListHeader}>
                    <h4>기대평 목록</h4>
                  </div>
                  
                  {sampleExpectations.map(expectation => (
                    <div key={expectation.id} className={styles.expectationItem}>
                      <div className={styles.expectationHeader}>
                        <h5 className={styles.expectationTitle}>{expectation.title}</h5>
                      </div>
                      
                      <div className={styles.expectationContent}>
                        <p className={styles.expectationText}>
                          {expandedExpectations[expectation.id] 
                            ? expectation.content 
                            : expectation.content.length > 100 
                              ? expectation.content.substring(0, 100) + '...' 
                              : expectation.content
                        }
                      </p>
                        {expectation.content.length > 100 && (
                          <button 
                            className={styles.expandButton}
                            onClick={() => toggleExpectationExpansion(expectation.id)}
                          >
                            {expandedExpectations[expectation.id] ? '닫기' : '더보기'}
                          </button>
                        )}
                      </div>
                      
                      <div className={styles.expectationFooter}>
                        <button className={styles.likeButton}>♡</button>
                        <span className={styles.expectationAuthor}>{expectation.author} | {expectation.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'venue' && (
            <div className={styles.venueContent}>
              <h3 className={styles.contentTitle}>공연장 정보</h3>
              <div className={styles.venueInfo}>
                <p><strong>공연장명:</strong> {performance.venue}</p>
                <p><strong>주소:</strong> {performance.address}</p>
                <p><strong>교통편:</strong> 지하철 및 버스 이용 가능</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 글쓰기 모달 */}
      {showWriteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{writeType === 'review' ? '후기 작성' : '기대평 작성'}</h3>
              <button className={styles.closeButton} onClick={handleWriteCancel}>×</button>
            </div>
            
            <form onSubmit={handleWriteSubmit} className={styles.writeForm}>
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
              
              {writeType === 'review' && (
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
              )}
              
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
                <button type="button" className={styles.cancelButton} onClick={handleWriteCancel}>
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

export default DetailPerformancePage;
