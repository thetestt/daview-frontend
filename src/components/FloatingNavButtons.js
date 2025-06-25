import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../styles/components/FloatingNavButtons.module.css";
import GoBackButton from "./common/GoBackButton";

//tofh

function FloatingNavButtons({ backTo = "/" }) {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로 확인용

  const handleNavClick = (path) => {
    if (location.pathname === path) {
      navigate(0); // 같은 경로면 새로고침
    } else {
      navigate(path); // 다른 경로면 이동
    }
  };

  return (
    <div className={styles["floating-nav-container"]}>
      {/* 25.06.05 -히스토리기반으로 뒤로가기 버튼 생성  
      네비 사용하는 모든 페이지 에서 기존 
      Backto(수동경로 설정) 지우고 단일 버튼으로 사용 합니다.*/}
      <GoBackButton className={styles["fnav-button"]} />
      <button
        onClick={() => handleNavClick("/silvertown")}
        className={styles["fnav-button"]}
      >
        실버타운
      </button>
      <button
        onClick={() => handleNavClick("/nursinghome")}
        className={styles["fnav-button"]}
      >
        요양원
      </button>
      <button
        onClick={() => handleNavClick("/caregiver")}
        className={styles["fnav-button"]}
      >
        요양사
      </button>
    </div>
  );
}

export default FloatingNavButtons;
