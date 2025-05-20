import React from "react";
import "../../styles/auth/SignupPage.css";
import Footer from "../../components/Footer";

function SignupPage() {
  return (
    <div className="signup-container">
      <h2>회원가입</h2>

      <form className="signup-form">
        <label>이메일</label>
        <div className="email-box">
          <input type="email" placeholder="이메일" />
          <span className="at">@</span>
          <input type="text" />
        </div>

        <label>비밀번호</label>
        <input type="password" placeholder="영문, 숫자 포함 8자 이상" />

        <label>비밀번호 확인</label>
        <input type="password" placeholder="비밀번호 확인" />

        <label>닉네임</label>
        <input type="text" placeholder="한글 2~10자" />

        <label>약관동의</label>
        <textarea placeholder="여기에 약관 들어감 (스크롤 가능)" rows={4} />

        <button type="submit">회원가입하기</button>
      </form>
    </div>
  );
}

export default SignupPage;
