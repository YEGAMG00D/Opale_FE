import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/userSlice";
import styles from "./MainMyPage.module.css";

const MainMyPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /** ✅ 로그아웃 */
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <h1>마이페이지</h1>
      <p>사용자 정보를 관리하고 활동 내역을 볼 수 있는 페이지입니다.</p>

      <div className={styles.navigation}>
        <h2>마이페이지 메뉴</h2>
        <div className={styles.linkGrid}>
          <Link to="/my/update-info" className={styles.link}>
            정보 변경
          </Link>
          <Link to="/my/change-password" className={styles.link}>
            비밀번호 변경
          </Link>
          <Link to="/my/favorite-performances" className={styles.link}>
            관심 공연
          </Link>
          <Link to="/my/booking-performances" className={styles.link}>
            예매한 공연
          </Link>
          <Link to="/my/booking-performances/register" className={styles.link}>
            예매 등록
          </Link>
        </div>
      </div>

      {/* ✅ 로그아웃 버튼 */}
      <div className={styles.logoutContainer}>
        <button
          onClick={handleLogout}
          style={{
            marginTop: "24px",
            backgroundColor: "#f5f5f5",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px 16px",
            cursor: "pointer",
            fontSize: "15px",
            color: "#333",
          }}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default MainMyPage;
