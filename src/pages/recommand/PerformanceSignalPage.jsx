import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPerformanceList } from '../../api/performanceApi';
import { normalizePerformance } from '../../services/normalizePerformance';
import PerformanceApiCard from '../../components/cards/PerformanceApiCard';
import { fetchFavoritePerformanceIds, togglePerformanceFavorite } from '../../api/favoriteApi';
import styles from './PerformanceSignalPage.module.css';

// 지역 목록
const REGIONS = [
  '전체',
  '서울',
  '경기',
  '충청',
  '강원',
  '경상',
  '전라',
  '제주'
];

// MBTI 테스트 질문 데이터
const TEST_QUESTIONS = [
  {
    id: 1,
    dimension: 'E/I',
    question: '티켓 발견 직후, 당신이 가장 먼저 취하는 행동은?',
    optionA: {
      text: '이 흥분되는 소식을 바로 주변 사람들에게 알린다. SNS에 자랑하고, 친구들과 이 미스터리를 같이 파헤쳐 보자고 한다.',
      value: 'E'
    },
    optionB: {
      text: '조용히 예매 완료 문자를 저장하고, 달력에 일정을 표시한다. 기대감을 혼자 만끽하며 차분히 기다린다.',
      value: 'I'
    }
  },
  {
    id: 2,
    dimension: 'S/N',
    question: '티켓을 들고 가장 먼저 확인하며 설레는 정보는?',
    optionA: {
      text: '공연명, 날짜, 좌석 번호 등 눈에 보이는 구체적인 정보. 특히 VIP석이나 1열이라면 이미 당첨된 기분이다.',
      value: 'S'
    },
    optionB: {
      text: '티켓 디자인에 담긴 숨겨진 메시지나 포스터의 분위기. 이 공연이 나에게 어떤 상상력과 영감을 줄지 기대된다.',
      value: 'N'
    }
  },
  {
    id: 3,
    dimension: 'J/P',
    question: '공연 당일, 티켓이 미스터리하다는 사실을 어떻게 준비에 반영하는가?',
    optionA: {
      text: '완벽한 관람을 위해 남은 시간과 모든 동선을 철저하게 계획한다. 미스터리한 초대이니만큼 예정된 스케줄대로 움직여야 한다.',
      value: 'J'
    },
    optionB: {
      text: '예상치 못한 선물이니, 그 자유로움을 즐긴다. 현장에 가서 즉흥적으로 카페를 찾거나 시간을 보낼 생각이다.',
      value: 'P'
    }
  },
  {
    id: 4,
    dimension: 'T/F',
    question: '공연 중, 배우가 심각한 실수를 저질러 잠시 극의 흐름이 깨졌다. 당신의 속마음은?',
    optionA: {
      text: '"프로라면 저런 실수를 하면 안 되는데. 극의 완성도와 몰입도를 떨어뜨리는 치명적인 옥에 티로군."',
      value: 'T'
    },
    optionB: {
      text: '"얼마나 당황했을까... 실수해도 괜찮다! 끝까지 힘내서 자신이 가진 진심을 보여주었으면 좋겠다."',
      value: 'F'
    }
  },
  {
    id: 5,
    dimension: 'E/I',
    question: '공연장에 도착했을 때, 당신이 가장 먼저 시도하는 일은?',
    optionA: {
      text: '로비에서 함께 온 사람들과 이야기를 나누거나, 주변의 다른 관객들에게 말을 걸어 기대감을 나눈다.',
      value: 'E'
    },
    optionB: {
      text: '혼자 조용한 구석에 자리를 잡고, 사람들의 소음 속에서 내면의 감정을 정리하며 공연 시작을 기다린다.',
      value: 'I'
    }
  },
  {
    id: 6,
    dimension: 'S/N',
    question: '공연의 하이라이트에서 당신에게 가장 강렬한 인상을 남긴 요소는?',
    optionA: {
      text: '배우들의 땀방울, 무대 장치의 정교함, 악기의 실제 울림 등 오감을 자극하는 현장감 있는 디테일.',
      value: 'S'
    },
    optionB: {
      text: '그 장면이 내포하는 인생의 의미, 새로운 아이디어의 발견, 나에게 미래를 살아갈 힘을 주는 듯한 영감.',
      value: 'N'
    }
  },
  {
    id: 7,
    dimension: 'J/P',
    question: '커튼콜이 끝나고 퇴장해야 할 때, 당신의 모습은?',
    optionA: {
      text: '다른 사람들보다 먼저 빠져나가야 한다. 복잡한 인파를 피해 출구로 향하며 다음 스케줄(혹은 귀가)을 계획대로 진행한다.',
      value: 'J'
    },
    optionB: {
      text: '급할 것 없다. 자리에 앉아 여운을 충분히 즐기다가 천천히 움직인다. 사람들이 다 빠지면 더 여유롭게 나갈 수 있다.',
      value: 'P'
    }
  },
  {
    id: 8,
    dimension: 'T/F',
    question: '미스터리 초대장에게 감사를 표하는 편지를 쓴다면?',
    optionA: {
      text: '객관적인 후기와 함께, 이 공연의 예술적 가치를 평가하고 초대해 준 합리적인 이유를 추측하며 감사를 표한다.',
      value: 'T'
    },
    optionB: {
      text: '당신의 따뜻한 마음에 깊이 감동했으며, 공연을 보며 느꼈던 벅찬 감정을 솔직하게 나누고 진심 어린 감사를 전한다.',
      value: 'F'
    }
  }
];

// MBTI 유형별 장르 매핑
const MBTI_GENRE_MAP = {
  'ISTJ': '서양음악(클래식)',
  'ISFJ': '뮤지컬',
  'ESTJ': '뮤지컬',
  'ESFJ': '대중음악',
  'ISTP': '연극',
  'ISFP': '대중음악',
  'ESTP': '연극',
  'ESFP': '대중음악',
  'INFJ': '연극',
  'INFP': '연극',
  'ENFJ': '뮤지컬',
  'ENFP': '뮤지컬',
  'INTJ': '서양음악(클래식)',
  'INTP': '연극',
  'ENTJ': '뮤지컬',
  'ENTP': '대중음악'
};

// MBTI 유형별 장르 설명
const MBTI_GENRE_DESCRIPTION = {
  'ISTJ': '클래식 오케스트라 (체계적이고 정교한 연주에서 안정감을 느낌)',
  'ISFJ': '가족 뮤지컬 / 힐링 콘서트 (따뜻한 감동과 조화로운 분위기를 선호)',
  'ESTJ': '대형 블록버스터 뮤지컬 (압도적인 스케일과 높은 완성도의 프로덕션)',
  'ESFJ': '참여형 공연 / 팬미팅 콘서트 (관객과의 소통과 함께 즐기는 사교적 경험)',
  'ISTP': '스탠드업 코미디 (즉각적인 재치와 논리로 상황을 분석하며 흥미를 느낌)',
  'ISFP': '인디밴드 라이브 클럽 공연 (자유로운 분위기, 솔직하고 예술적인 표현)',
  'ESTP': '액션극 / 서커스 (예측 불가능하고 역동적인 스릴 넘치는 현장감)',
  'ESFP': 'K-POP 아이돌 콘서트 (화려한 볼거리, 축제 같은 분위기에서 에너지 발산)',
  'INFJ': '정통 연극 (철학적 주제) (깊은 통찰과 인간의 보편적 가치, 메시지 추구)',
  'INFP': '예술 영화 상영회 + GV (독특한 감성, 창의적인 표현에서 내면의 가치를 찾음)',
  'ENFJ': '감동적인 스토리의 연극/뮤지컬 (등장인물의 성장과 희망적인 메시지에서 열정적 에너지)',
  'ENFP': '넌버벌 퍼포먼스 (예: 난타) (상상력을 자극하는 창의적인 연출과 자유로움)',
  'INTJ': '고전 오페라 / 지식 강연 콘서트 (잘 짜인 구조와 깊은 지식을 요하는 장르 선호)',
  'INTP': '실험적/해체주의 연극 (기존 틀을 깨는 시도, 복잡하고 논리적인 구조 분석)',
  'ENTJ': '브로드웨이 오리지널 내한 공연 (최고의 기술력과 시스템으로 완벽하게 제작된 프로덕션)',
  'ENTP': '라이브 토크 콘서트 (즉각적인 재치와 지적인 토론, 새로운 아이디어 발산)'
};

const PerformanceSignalPage = () => {
  const navigate = useNavigate();
  const [showStartScreen, setShowStartScreen] = useState(true); // 시작 화면 표시 여부
  const [selectedArea, setSelectedArea] = useState(null); // 지역 선택 상태
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [mbtiResult, setMbtiResult] = useState(null);
  const [recommendedPerformances, setRecommendedPerformances] = useState([]);
  const [additionalPerformances, setAdditionalPerformances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  // 관심 공연 ID 목록 조회
  useEffect(() => {
    const loadFavoriteIds = async () => {
      try {
        const ids = await fetchFavoritePerformanceIds();
        setFavoriteIds(new Set(ids));
      } catch (err) {
        console.error('관심 공연 ID 목록 조회 실패:', err);
        setFavoriteIds(new Set());
      }
    };
    loadFavoriteIds();
  }, []);

  // MBTI 유형 계산
  const calculateMBTI = (answers) => {
    const counts = {
      E: 0, I: 0,
      S: 0, N: 0,
      T: 0, F: 0,
      J: 0, P: 0
    };

    Object.values(answers).forEach(answer => {
      if (answer) {
        counts[answer]++;
      }
    });

    const mbti = 
      (counts.E >= counts.I ? 'E' : 'I') +
      (counts.S >= counts.N ? 'S' : 'N') +
      (counts.T >= counts.F ? 'T' : 'F') +
      (counts.J >= counts.P ? 'J' : 'P');

    return mbti;
  };

  // 답변 선택 핸들러
  const handleAnswer = (value) => {
    const question = TEST_QUESTIONS[currentQuestionIndex];
    const newAnswers = {
      ...answers,
      [question.id]: value
    };
    setAnswers(newAnswers);

    // 다음 질문으로 이동
    if (currentQuestionIndex < TEST_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 마지막 질문이면 결과 계산
      const result = calculateMBTI(newAnswers);
      setMbtiResult(result);
      loadRecommendedPerformances(result);
    }
  };

  // 추천 공연 로드
  const loadRecommendedPerformances = async (mbtiType) => {
    setLoading(true);
    try {
      const genre = MBTI_GENRE_MAP[mbtiType] || '뮤지컬';
      
      // 메인 추천 공연 (선택한 지역으로 필터링)
      const mainDto = {
        genre: genre,
        area: selectedArea && selectedArea !== '전체' ? selectedArea : null,
        page: 1,
        size: 1,
        sortType: '인기'
      };

      const mainRes = await fetchPerformanceList(mainDto);
      const mainPerformances = mainRes.performances.map(normalizePerformance);
      setRecommendedPerformances(mainPerformances);

      // 추가 추천 공연 (지역 필터 없이)
      const additionalDto = {
        genre: genre,
        area: null, // 지역 필터 없음
        page: 1,
        size: 3,
        sortType: '인기'
      };

      const additionalRes = await fetchPerformanceList(additionalDto);
      const additionalPerformances = additionalRes.performances.map(normalizePerformance);
      setAdditionalPerformances(additionalPerformances);
    } catch (err) {
      console.error('추천 공연 로드 실패:', err);
      setRecommendedPerformances([]);
      setAdditionalPerformances([]);
    } finally {
      setLoading(false);
    }
  };

  // 관심 토글 핸들러
  const handleFavoriteToggle = async (performanceId) => {
    try {
      const result = await togglePerformanceFavorite(performanceId);
      setFavoriteIds((prev) => {
        const newSet = new Set(prev);
        if (result) {
          newSet.add(performanceId);
        } else {
          newSet.delete(performanceId);
        }
        return newSet;
      });
    } catch (err) {
      console.error('관심 토글 실패:', err);
    }
  };

  // 공연 카드 클릭 핸들러
  const handlePerformanceClick = (id) => {
    navigate(`/culture/${id}`);
  };

  // 테스트 다시 시작
  const handleRestart = () => {
    setShowStartScreen(true);
    setSelectedArea(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setMbtiResult(null);
    setRecommendedPerformances([]);
    setAdditionalPerformances([]);
  };

  // 시작하기 버튼 핸들러
  const handleStart = () => {
    setShowStartScreen(false);
  };

  // 지역 선택 핸들러
  const handleAreaSelect = (area) => {
    setSelectedArea(area);
  };

  // 결과 화면
  if (mbtiResult) {
    const mainPerformance = recommendedPerformances[0];
    const genre = MBTI_GENRE_MAP[mbtiResult] || '뮤지컬';
    const genreDescription = MBTI_GENRE_DESCRIPTION[mbtiResult] || '';

    return (
      <div className={styles.container}>
        <div className={styles.resultContainer}>
          <div className={styles.resultHeader}>
            <h1 className={styles.resultTitle}>당신의 공연시그널</h1>
            <div className={styles.mbtiBadge}>{mbtiResult}</div>
            <p className={styles.genreDescription}>{genreDescription}</p>
          </div>

          {loading ? (
            <div className={styles.loading}>추천 공연을 불러오는 중...</div>
          ) : mainPerformance ? (
            <div className={styles.recommendationSection}>
              <h2 className={styles.sectionTitle}>추천 공연</h2>
              <div className={styles.mainRecommendation}>
                <PerformanceApiCard
                  id={mainPerformance.id}
                  image={mainPerformance.image}
                  title={mainPerformance.title}
                  venue={mainPerformance.venue}
                  startDate={mainPerformance.startDate}
                  endDate={mainPerformance.endDate}
                  rating={mainPerformance.rating}
                  reviewCount={mainPerformance.reviewCount}
                  keywords={mainPerformance.keywords}
                  aiSummary={mainPerformance.aiSummary}
                  genre={mainPerformance.genre}
                  isFavorite={favoriteIds.has(mainPerformance.id)}
                  onFavoriteToggle={handleFavoriteToggle}
                  onClick={handlePerformanceClick}
                />
              </div>

              {additionalPerformances.length > 0 && (
                <div className={styles.additionalRecommendations}>
                  <h3 className={styles.additionalTitle}>더 많은 {genre} 공연</h3>
                  <div className={styles.additionalList}>
                    {additionalPerformances.map((performance) => (
                      <PerformanceApiCard
                        key={performance.id}
                        id={performance.id}
                        image={performance.image}
                        title={performance.title}
                        venue={performance.venue}
                        startDate={performance.startDate}
                        endDate={performance.endDate}
                        rating={performance.rating}
                        reviewCount={performance.reviewCount}
                        keywords={performance.keywords}
                        aiSummary={performance.aiSummary}
                        genre={performance.genre}
                        isFavorite={favoriteIds.has(performance.id)}
                        onFavoriteToggle={handleFavoriteToggle}
                        onClick={handlePerformanceClick}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.noResult}>추천 공연을 찾을 수 없습니다.</div>
          )}

          <div className={styles.resultActions}>
            <button className={styles.restartButton} onClick={handleRestart}>
              다시 테스트하기
            </button>
            <button className={styles.backButton} onClick={() => navigate('/recommend')}>
              추천 페이지로
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 시작 화면
  if (showStartScreen) {
    return (
      <div className={styles.container}>
        <div className={styles.startContainer}>
          <div className={styles.startContent}>
            <h1 className={styles.startTitle}>공연시그널</h1>
            <p className={styles.startDescription}>
              나와 찰떡인 공연을 찾아보세요
            </p>
            <p className={styles.startSubDescription}>
              간단한 질문으로 당신만의 공연을 추천받아보세요
            </p>
            <button className={styles.startButton} onClick={handleStart}>
              시작하기 →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 지역 선택 화면
  if (selectedArea === null) {
    return (
      <div className={styles.container}>
        <div className={styles.areaSelectContainer}>
          <div className={styles.areaSelectHeader}>
            <button className={styles.backButton} onClick={() => setShowStartScreen(true)}>
              ← 뒤로
            </button>
            <h1 className={styles.areaSelectTitle}>공연시그널</h1>
            <p className={styles.areaSelectDescription}>
              추천받을 지역을 선택해주세요
            </p>
          </div>

          <div className={styles.regionGrid}>
            {REGIONS.map((region) => (
              <button
                key={region}
                className={styles.regionButton}
                onClick={() => handleAreaSelect(region)}
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 테스트 진행 화면
  const currentQuestion = TEST_QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / TEST_QUESTIONS.length) * 100;

  return (
    <div className={styles.container}>
      <div className={styles.testContainer}>
        <div className={styles.testHeader}>
          <button className={styles.backButton} onClick={() => setSelectedArea(null)}>
            ← 뒤로
          </button>
          <h1 className={styles.testTitle}>공연시그널</h1>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
          </div>
          <div className={styles.progressText}>
            {currentQuestionIndex + 1} / {TEST_QUESTIONS.length}
          </div>
        </div>

        <div className={styles.questionContainer}>
          <div className={styles.questionNumber}>질문 {currentQuestionIndex + 1}</div>
          <h2 className={styles.question}>{currentQuestion.question}</h2>

          <div className={styles.optionsContainer}>
            <button
              className={`${styles.option} ${answers[currentQuestion.id] === currentQuestion.optionA.value ? styles.selected : ''}`}
              onClick={() => handleAnswer(currentQuestion.optionA.value)}
            >
              <div className={styles.optionLabel}>A</div>
              <div className={styles.optionText}>{currentQuestion.optionA.text}</div>
            </button>

            <div className={styles.divider}>또는</div>

            <button
              className={`${styles.option} ${answers[currentQuestion.id] === currentQuestion.optionB.value ? styles.selected : ''}`}
              onClick={() => handleAnswer(currentQuestion.optionB.value)}
            >
              <div className={styles.optionLabel}>B</div>
              <div className={styles.optionText}>{currentQuestion.optionB.text}</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceSignalPage;
