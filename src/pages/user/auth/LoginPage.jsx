import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../../api/axiosInstance";
import { loginSuccess } from "../../../store/userSlice";
import styles from "./LoginPage.module.css";

const API_BASE_URL =import.meta.env.VITE_API_BASE_URL;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.user);

  /** ✅ 이미 로그인된 사용자는 접근 차단 */
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken && isLoggedIn) {
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
        const { token, user } = response.data.data;
        const { accessToken, refreshToken } = token;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        dispatch(
          loginSuccess({
            user,
            token: accessToken,
          })
        );

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
      </div>
    </div>
  );
};

export default LoginPage;
