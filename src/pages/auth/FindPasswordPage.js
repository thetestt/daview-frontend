import React, { useState } from "react";
import "../../styles/auth/FindPasswordPage.css";

function FindPasswordPage() {
  const [method] = useState("phone");

  return (
    <div className="find-password-wrapper">
      <h2>비밀번호 찾기</h2>

      {method === "phone" && (
        <div className="form-group">
          <label>이름</label>
          <input type="text" placeholder="이름 입력" />

          <div className="form-group-id">
            <label>아이디</label>
            <input type="text" placeholder="아이디 입력" />
            
            <br/><br/><label>전화번호</label>
            <div className="phone-inputs">
              <input placeholder="+82" className="country-code" />
              <input type="text" placeholder="휴대전화번호 입력 ((-)제외)" className="phone-input" />
              <button className="send-code-button">인증번호 전송</button>
            </div>
            <br/>
            <input type="text" placeholder="인증번호 6자리 숫자 입력" /><br/><br/>

            <div className="signup-links">
            <a href="/findidpage"> 아이디찾기</a><span>|</span><a href="/signup"> 회원가입하기</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FindPasswordPage;
