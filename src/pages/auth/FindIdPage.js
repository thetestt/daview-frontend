import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/auth/FindIdPage.css";


function FindIdPage() {
  const [method, setMethod] = useState("phone"); // 기본: 전화번호 인증
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  const formatPhoneNumber = (value) => {
    const onlyNums = value.replace(/[^\d]/g, "");
    if (onlyNums.length < 4) return onlyNums;
    if (onlyNums.length < 7) return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
    return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`;
  };

  const sendVerificationCode = async () => {
    const plainPhone = phone.replace(/-/g, "");
    console.log("보낼 이름:", name);
    console.log("보낼 번호:", plainPhone);

    try {
      const response = await axios.post("http://localhost:8080/api/account/send-sms-code", {
        name,
        phone: plainPhone
      });
      alert("인증번호 전송됨");
    } catch (err) {
      alert("전송 실패");
      console.error(err);
    }
  };

  const navigate = useNavigate();
  const verifyCode = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/account/verify-code", {
        phone,
        code
      });
      navigate("/FindIdPage/result", { state: { username: response.data } });
    } catch (err) {
      alert("인증 실패");
    }
  };


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
          <input type="text" placeholder="이름 입력" value={name} onChange={(e) => setName(e.target.value)} />

          <label>전화번호</label>
          <div className="phone-inputs">
            <input placeholder="+82" className="country-code" value="+82" readOnly />
            <input type="text" placeholder="휴대전화번호 입력 ((-)제외)" className="phone-input" value={phone}
              onChange={(e) => setPhone(formatPhoneNumber(e.target.value))} />
            <button className="send-code-button" onClick={sendVerificationCode}>인증번호 전송</button>
          </div>
          <div className="verify-section">
            <input type="text" placeholder="인증번호 6자리 숫자 입력" value={code} onChange={(e) => setCode(e.target.value)} />
            <button className="send-code-button" onClick={verifyCode}>인증하기</button>
          </div>
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