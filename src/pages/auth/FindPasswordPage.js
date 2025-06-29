import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/auth/FindPasswordPage.module.css";

function FindPasswordPage() {
  const [method, setMethod] = useState("phone");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const verifyCode = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/account/verify-code", {
        name,
        phone,
        code,
      });
  
      console.log("response.data:", response.data);
  
      navigate("/FindPasswordPage/CPw", {
        state: { username: username },
      });      
    } catch (err) {
      alert("인증 실패");
    }
  };
  

  const formatPhoneNumber = (value) => {
    const onlyNums = value.replace(/[^\d]/g, "");
    if (onlyNums.length < 4) return onlyNums;
    if (onlyNums.length < 7) return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
    return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`;
  };

  const sendVerificationCode = async () => {
    console.log("보낼 이름:", name);
    console.log("보낼 번호:", phone);

    try {
      const response = await axios.post("http://localhost:8080/api/account/send-sms-code", {
        name,
        phone
      });
      alert("인증번호 전송됨");
    } catch (err) {
      alert("전송 실패");
      console.error(err);
    }
  };

  return (
    <div className={styles["find-password-wrapper"]}>
      <h2>비밀번호 찾기</h2>

      {method === "phone" && (
        <div className={styles["form-group"]}>
          <label>이름</label>
          <input type="text" placeholder="이름 입력" value={name} onChange={(e) => setName(e.target.value)} />

          <div className={styles["form-group-id"]}>
            <label>아이디</label>
            <input type="text" placeholder="아이디 입력" value={username} onChange={(e) => setUsername(e.target.value)} />

            <br /><br /><label>전화번호</label>
            <div className={styles["phone-inputs"]}>
              <input placeholder="+82" className={styles["country-code"]} value="+82" readOnly />

              <input type="text" placeholder="휴대전화번호 '-' 없이 입력" className={styles["phone-input"]} value={phone}
                onChange={(e) => setPhone(formatPhoneNumber(e.target.value))} />
              <button className={styles["send-code-button"]} onClick={sendVerificationCode}>인증번호 전송</button>
          </div>
          <div className={styles["verify-section"]}>
            <input type="text" placeholder="인증번호 6자리 숫자 입력" value={code} onChange={(e) => setCode(e.target.value)} />
            <button className={styles["send-code-button"]} onClick={verifyCode}>인증하기</button>
          </div>

            <div className={styles["signup-links"]}>
              <a href="/findidpage"> 아이디찾기</a><span>|</span><a href="/signup"> 회원가입하기</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FindPasswordPage;
