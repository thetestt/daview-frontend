import React, { useState } from "react";
import "../../styles/auth/FindIdPage.css";


function FindIdPage() {
  const [method, setMethod] = useState("phone"); // 기본: 전화번호 인증

  return (
    <div className="find-id-wrapper">
      <h2>아이디 찾기</h2>
      <div className="radio-group">
        <label>
          <input
            type="radio"
            value="phone"
            checked={method === "phone"}
            onChange={() => setMethod("phone")}
          />
          회원번호에 등록한 전화번호로 인증
        </label>
        <label>
          <input
            type="radio"
            value="email"
            checked={method === "email"}
            onChange={() => setMethod("email")}
          />
          본인확인 이메일로 인증
        </label>
      </div>

      {method === "phone" ? (
        <div className="form-group">
          <label>이름</label>
          <input type="text" placeholder="이름 입력" />

          <label>전화번호</label>
          <div className="phone-inputs">
          <input placeholder="+82" className="country-code" />
          <input type="text" placeholder="휴대전화번호 입력 ((-)제외)" className="phone-input" />
          <button className="send-code-button">인증번호 전송</button>
          </div>
          <input type="text" placeholder="인증번호 6자리 숫자 입력" />
          <div className="signup-links">
            <span>회원가입이 필요하신가요?</span><a href="/signup">  회원가입하기</a>
          </div>
        </div>
      ) : (
        <div className="form-group">
          <label>이름</label>
          <input type="text" placeholder="이름 입력" />
          <label>이메일 주소</label>
          <div className="email-inputs">
            <input type="text" placeholder="이메일" />
            <span>@</span>
            <input type="text" placeholder="도메인" />
            <button className="findid-send-code-button">인증번호 전송</button>
          </div>
          <input type="text" placeholder="인증번호 6자리 숫자 입력" />

          <div className="signup-links">
            <span>회원가입이 필요하신가요?</span><a href="/signup">  회원가입하기</a>
          </div>
        </div>
        
      
      )}
    </div>
  );
}

export default FindIdPage;