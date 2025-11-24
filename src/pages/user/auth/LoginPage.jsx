import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../../store/userSlice";
import styles from "./LoginPage.module.css";

import { login as loginApi } from "../../../api/authApi";
import { initializeUserTickets, clearPreviousUserTickets, hasUserTickets } from "../../../utils/ticketUtils";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.user);

  /** 이미 로그인 상태라면 접근 차단 */
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken && isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  /** 로그인 요청 */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await loginApi(email, password);

      if (result.success) {
        const { token, user } = result.data;
        const { accessToken, refreshToken } = token;
        const userId = user?.userId || user?.id;

        // ⬇️ 이전 사용자의 티켓 데이터 정리
        clearPreviousUserTickets(userId);

        // ⬇️ localStorage 할당
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        // ⬇️ Redux 반영
        dispatch(
          loginSuccess({
            user,
            token: accessToken,
          })
        );

        // 티켓 데이터가 없으면 초기화
        if (userId && !hasUserTickets(userId)) {
          initializeUserTickets(userId);
        }

        navigate("/");
      } else {
        setError(result.message || "로그인 실패");
      }
    } catch (err) {
      console.error("로그인 실패:", err);
      if (err.response?.status === 401) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else {
        setError("서버 오류가 발생했습니다.");
      }
    }
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
            <div className={styles.passwordInputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                className={styles.input}
                placeholder="비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
            <Link to="/new-password" className={styles.findPasswordLink}>
              비밀번호 찾기
            </Link>
          </div>

          {error && <p className={styles.errorMsg}>{error}</p>}

          <button type="submit" className={styles.loginButton}>
            로그인
          </button>
        </form>

        <Link to="/signup" className={styles.signupLink}>
          회원가입
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
