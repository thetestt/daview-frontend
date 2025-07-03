import React from "react";
import { useLocation } from "react-router-dom";
import styles from "../../styles/auth/FindIdResultPage.module.css";

function FindIdResultPage() {
    const location = useLocation();
    const username = location.state?.username || "인증 실패";

    return (
        <div className={styles["findidresultpage-container"]}>
            <h2 className={styles["chj-title"]}>아이디 찾기 결과</h2>
            <p className={styles["chj-result-text"]}>
                회원님의 아이디는 <strong>{username}</strong> 입니다.
            </p>
            <div className={styles["chj-login-links"]}>
            <a href="/login">로그인</a>
            <span>|</span>
            <a href="/findpasswordpage">비밀번호찾기</a>
            </div>
        </div>
    );
}

export default FindIdResultPage;
