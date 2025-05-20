import React, { useState } from "react";
import "../../styles/auth/LoginPage.css";
import Footer from "../../components/Footer";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("아이디:", username);
    console.log("비밀번호:", password);
  };

  return (
    <div className="page-wrapper">
    <div className="login-container"></div>
    <div className="login-container">
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
        <a href="#">아이디찾기</a>
        <span>|</span>
        <a href="#">비밀번호찾기</a>
        <span>|</span>
        <a href="/signup">회원가입</a>
      </div>

    </div>
    </div>
   
  );
}

export default LoginPage;
