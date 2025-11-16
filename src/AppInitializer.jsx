// src/AppInitializer.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./store/userSlice";

const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userRaw = localStorage.getItem("user");

    if (token && userRaw) {
      try {
        const user = JSON.parse(userRaw);

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
