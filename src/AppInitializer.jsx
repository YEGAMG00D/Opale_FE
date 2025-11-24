// src/AppInitializer.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./store/userSlice";
import { clearPreviousUserTickets, initializeUserTickets, hasUserTickets } from "./utils/ticketUtils";

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
          
          // 티켓 데이터가 없으면 초기화
          if (!hasUserTickets(userId)) {
            initializeUserTickets(userId);
          }
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
