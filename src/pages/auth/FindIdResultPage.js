import React from "react";
import { useLocation } from "react-router-dom";
import "../../styles/auth/FindIdResultPage.css";

function FindIdResultPage() {

    const location = useLocation();
    const username = location.state?.username || "정보 없음";

    return (
        <div className="findidresultpage-container">
            <h2>아이디 찾기 결과</h2>
            <p>회원님의 아이디는 <strong>{username}</strong> 입니다.</p>
            <a href="/login">로그인하러 가기</a>
        </div>
    );
}

export default FindIdResultPage;