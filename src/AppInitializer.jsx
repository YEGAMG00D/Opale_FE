// src/AppInitializer.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./store/userSlice";
import { clearPreviousUserTickets, initializeUserTickets, hasUserTickets } from "./utils/ticketUtils";
import { hasUserReviews } from "./utils/reviewUtils";

const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userRaw = localStorage.getItem("user");

    if (token && userRaw) {
      try {
        const user = JSON.parse(userRaw);
        const userId = user?.userId || user?.id;

        // 이전 사용자의 티켓 데이터 정리
        if (userId) {
          clearPreviousUserTickets(userId);
          
          // 새 사용자인지 확인 (비동기)
          const checkNewUser = async () => {
            const hasTickets = hasUserTickets(userId);
            let hasReviews = false;
            
            try {
              // 서버에서 리뷰 확인
              hasReviews = await hasUserReviews(userId);
            } catch (error) {
              console.warn('리뷰 확인 실패:', error);
              // 에러 발생 시 리뷰가 없다고 간주
              hasReviews = false;
            }

            // 티켓도 없고 리뷰도 없으면 새 사용자
            if (!hasTickets && !hasReviews) {
              // 새 사용자: 티켓 데이터 초기화 (리뷰는 서버에서 자동으로 빈 상태)
              initializeUserTickets(userId);
            } else if (!hasTickets) {
              // 티켓만 없는 경우 (기존 사용자지만 티켓 데이터가 없는 경우)
              initializeUserTickets(userId);
            }
            // 기존 사용자는 데이터 유지 (아무것도 하지 않음)
          };

          checkNewUser();
        }

        dispatch(
          loginSuccess({
            token,
            user,
          })
        );
      } catch (e) {
        console.error("❌ user 파싱 실패:", e);
      }
    }
  }, []);

  return children;
};

export default AppInitializer;
