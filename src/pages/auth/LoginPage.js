import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/auth/LoginPage.css";
// import Footer from "../../components/Footer";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const handleKakaoLogin = () => {
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=REST_API_KEY&redirect_uri=REDIRECT_URI&response_type=code`;
  }; //아직 구현 전


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        username,
        password,
      });
  
      console.log("로그인 성공:", response.data);
  
      const decoded = jwtDecode(response.data.token); 
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("role", decoded.role); // 역할 저장 (기업인지 유저인지 뭐 그런거)
  
      navigate("/");
      window.location.reload();
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
            <button type="button" onClick={handleKakaoLogin} className="kakao-login-button">카카오로 로그인하기</button>
            {/*아직 구현 전*/}<div />
            <div className="kakao-login">
              카카오로 로그인 시 자동 회원가입처리됩니다.</div>
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