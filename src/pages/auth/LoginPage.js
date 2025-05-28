import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/auth/LoginPage.css";
// import Footer from "../../components/Footer";
import axios from "axios";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        username,
        password,
      });
      console.log("로그인 성공:", response.data);
      localStorage.setItem("token", response.data.token);
      // 예시: 로그인 성공하면 마이페이지로 이동
      navigate("/mypage");
      
    } catch (error) {
      console.error("로그인 실패:", error);
      setErrorMsg("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="login-container">
        <div className="login-inner">
          <p className="login-subtitle">전국 모든 요양원 / 실버타운</p>
          <h1 className="login-logo">다뷰</h1>
          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="text"
              placeholder="아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">로그인</button>
          </form>
          <div className="login-links">
            <a href="/findidpage">아이디찾기</a>
            <span>|</span>
            <a href="/findpasswordpage">비밀번호찾기</a>
            <span>|</span>
            <a href="/signup">회원가입</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;