import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../../api/axiosInstance";
import { loginSuccess, logout } from "../../../store/userSlice";
import styles from "./LoginPage.module.css";

// ✅ 백엔드 주소 (.env로 관리 가능)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoggedIn, user } = useSelector((state) => state.user);

  /** ✅ 이미 로그인된 사용자인 경우 자동 리다이렉트 */
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken && !isLoggedIn) {
      // 토큰만 있으면 (새로고침 등) 홈으로 이동
      console.log("🔄 저장된 토큰 감지됨 (자동 로그인 유지)");
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  /** ✅ 로그인 요청 */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      if (response.data.success) {
        // ✅ 서버 응답 구조: data = { token: {...}, user: {...} }
        const { token, user } = response.data.data;
        const { accessToken, refreshToken } = token;

        // ✅ 토큰만 localStorage에 저장
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // ✅ Redux store에만 user 저장
        dispatch(
          loginSuccess({
            user,
            token: accessToken,
          })
        );

        console.log("✅ 로그인 성공 - Redux 저장 완료");
        alert(`환영합니다, ${user.nickname}님!`);
        navigate("/");
      } else {
        setError(response.data.message || "로그인 실패");
      }
    } catch (err) {
      console.error("로그인 실패:", err);
      if (err.response?.status === 401)
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      else setError("서버 오류가 발생했습니다.");
    }
  };

  /** ✅ 로그아웃 (임시 테스트용) */
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(logout());
    alert("로그아웃 완료!");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ←
        </button>
        <h1 className={styles.headerTitle}>로그인</h1>
      </div>

      <div className={styles.content}>
        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              className={styles.input}
              placeholder="이메일 입력"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              className={styles.input}
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className={styles.errorMsg}>{error}</p>}

          <button type="submit" className={styles.loginButton}>
            로그인
          </button>
        </form>

        <div className={styles.footerLinks}>
          <Link to="/signup" className={styles.signupLink}>
            회원가입
          </Link>
          <Link to="/find-password" className={styles.findPasswordLink}>
            비밀번호 찾기
          </Link>
        </div>

        {/* ✅ 테스트용 로그아웃 버튼 */}
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            style={{
              marginTop: "16px",
              background: "transparent",
              border: "1px solid #aaa",
              borderRadius: "8px",
              padding: "6px 10px",
              cursor: "pointer",
              color: "#555",
            }}
          >
            로그아웃 (테스트용)
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
