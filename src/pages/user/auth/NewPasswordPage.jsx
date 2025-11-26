import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../../../api/userApi";
import styles from "./NewPasswordPage.module.css";

const NewPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await resetPassword(email);

      if (response.success) {
        // 성공 시 다음 페이지로 이동
        navigate("/new-password/success", { state: { email: response.email || email } });
      } else {
        setError("임시 비밀번호 발급에 실패했습니다.");
      }
    } catch (err) {
      console.error("비밀번호 재발급 실패:", err);
      if (err.response?.status === 404 || err.response?.status === 400) {
        setError("일치하는 회원 정보가 없습니다.");
      } else if (err.response?.status === 422) {
        setError("이메일 형식이 올바르지 않습니다.");
      } else {
        setError(err.response?.data?.message || "서버 오류가 발생했습니다.");
      }
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
