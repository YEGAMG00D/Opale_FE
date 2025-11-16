import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./SuccessedNewPasswordPage.module.css";

const SuccessedNewPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "user11@example.com";

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <Link to="/" className={styles.logo}>opale</Link>
          </div>
          <div className={styles.headerRight}>
            <Link to="/login" className={styles.loginBtn}>로그인</Link>
          </div>
        </div>
        <div className={styles.headerDivider}></div>
      </div>

      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.emailText}>{email}</div>
          <div className={styles.messageText}>
            해당 이메일로 임시비밀번호를 발송하였습니다.
          </div>
        </div>

        <button
          className={styles.loginButton}
          onClick={() => navigate("/login")}
        >
          로그인 페이지로 이동
        </button>
      </div>
    </div>
  );
};

export default SuccessedNewPasswordPage;
