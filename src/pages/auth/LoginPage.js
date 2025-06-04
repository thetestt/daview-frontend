import React, { useState } from "react";
import axios from "axios";
import "../../styles/auth/LoginPage.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleKakaoLogin = () => {
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=REST_API_KEY&redirect_uri=REDIRECT_URI&response_type=code`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        { username, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        const token = response.data.token;
        const decoded = jwtDecode(token);
  
        localStorage.setItem("token", token);
        localStorage.setItem("username", decoded.sub);
        localStorage.setItem("role", decoded.role); // 역할 저장

        alert("로그인 성공");
        localStorage.setItem("token", response.data.token);
        navigate("/");
      } else {
        setErrorMsg("아이디 또는 비밀번호가 틀렸습니다.");
        alert("로그인 실패: 아이디 또는 비밀번호가 틀렸습니다.");
      }
    } catch (error) {
      console.error("로그인 에러", error);
      setErrorMsg("서버 오류가 발생했습니다.");
      alert("서버 오류");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="login-container">
        <div className="login-inner">
          <p className="login-subtitle">전국 모든 요양원 / 실버타운</p>
          <h1 className="login-logo">다뷰</h1>

          <form onSubmit={handleLogin} className="login-form">
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

            <button type="submit" className="login-button">로그인</button>

            <button
              type="button"
              onClick={handleKakaoLogin}
              className="kakao-login-button"
            >
              카카오로 로그인하기
            </button>

            <div className="kakao-login">
              카카오로 로그인 시 자동 회원가입 처리됩니다.
            </div>

            {errorMsg && <p className="error-message">{errorMsg}</p>}
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
