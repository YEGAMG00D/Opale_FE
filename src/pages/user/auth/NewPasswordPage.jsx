import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import styles from "./NewPasswordPage.module.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const NewPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axiosInstance.post(
        `${API_BASE_URL}/auth/reset-password`,
        { email }
      );

      if (response.data.success) {
        // 성공 시 다음 페이지로 이동 (예: 임시 비밀번호 발급 완료 페이지)
        navigate("/new-password/success", { state: { email } });
      } else {
        setError(response.data.message || "일치하는 회원 정보가 없습니다.");
      }
    } catch (err) {
      console.error("비밀번호 재발급 실패:", err);
      // API 연동 전이므로 임시로 성공 처리
      navigate("/new-password/success", { state: { email } });
      // if (err.response?.status === 404 || err.response?.status === 400) {
      //   setError("일치하는 회원 정보가 없습니다.");
      // } else {
      //   setError("서버 오류가 발생했습니다.");
      // }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ←
        </button>
        <h1 className={styles.headerTitle}>비밀번호 재발급</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.card}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>이메일</label>
              <input
                type="email"
                className={styles.input}
                placeholder="user12@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {error && <p className={styles.errorMsg}>{error}</p>}
            </div>

            <button type="submit" className={styles.submitButton}>
              임시 비밀번호 발급
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewPasswordPage;
