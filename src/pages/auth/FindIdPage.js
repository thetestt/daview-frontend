import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../styles/auth/FindIdPage.module.css";
import { motion } from "framer-motion";

axios.defaults.withCredentials = true;

function FindIdPage() {
  const navigate = useNavigate();

  const [method, setMethod] = useState("phone");
  const [name, setName] = useState("");

  // 전화 인증용
  const [phone, setPhone] = useState("");
  const [phoneCode, setPhoneCode] = useState("");

  // 이메일 인증용
  const [email, setEmail] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [emailCode, setEmailCode] = useState("");

  const fullEmail = `${email}@${emailDomain}`;

  // 이메일 인증번호 전송
  const sendEmailCode = async () => {
    try {
      await axios.post("http://localhost:8080/api/auth/email/send", {
        email: fullEmail,
      });
      alert("이메일로 인증번호를 전송했습니다.");
    } catch (err) {
      if (err.response?.status === 400) {
        alert("입력하신 이름과 이메일을 다시 확인해주세요.");
      } else {
        alert("이메일 전송 중 오류가 발생했습니다.");
      }
    }


  };

  // 이메일 인증 확인 + 아이디 찾기
  const verifyEmailCode = async () => {
    try {
      const verifyRes = await axios.post("http://localhost:8080/api/auth/email/verify", {
        code: emailCode,
      });

      if (verifyRes.data === true) {
        const result = await axios.post("http://localhost:8080/api/auth/find-id", {
          name,
          email: fullEmail,
          code: emailCode,
        });

        navigate("/FindIdPage/result", {
          state: { username: result.data },
        });
      } else {
        alert("인증번호가 일치하지 않습니다.");
      }
    } catch (err) {
      alert("인증 실패");
    }
  };

  // 전화번호 인증번호 전송
  const sendVerificationCode = async () => {
    console.log("보낼 이름:", name);
    console.log("보낼 번호:", phone);

    try {
      await axios.post("http://localhost:8080/api/account/send-sms-code", {
        name,
        phone
      });
      alert("인증번호 전송됨");
    } catch (err) {
      if (err.response?.status === 400) {
        alert("입력하신 이름과 전화번호를 다시 확인해주세요.");
      } else {
        alert("문자 전송 중 오류가 발생했습니다.");
      }
    }

  };

  // 전화 인증 확인 + 아이디 찾기
  const verifyPhoneCode = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/account/verify-code", {
        name,
        phone,
        code: phoneCode,
      });

      navigate("/FindIdPage/result", {
        state: { username: response.data.username }
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

  return (
    <motion.div initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }} className={styles["find-id-wrapper"]}>
      <h2 className={styles["find-title"]}>아이디 찾기</h2>
      <div className={styles["chj-radio-group"]}>
        <div className={styles["chj-radio-option"]}>
          <label>
            <input
              type="radio"
              value="phone"
              checked={method === "phone"}
              onChange={() => setMethod("phone")}
            />
            회원번호에 등록한 전화번호로 인증
          </label>
        </div>
        <div className={styles["chj-radio-option"]}>
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
      </div>

      {method === "phone" ? (
        <div className={styles["chj-form-group"]}>
          <label className={styles["form-label"]}>이름</label>
          <input
            type="text"
            placeholder="이름 입력"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles["chj-input"]}
          />

          <label className={styles["form-label"]}>전화번호</label>
          <div className={styles["chj-phone-inputs"]}>
            <input
              type="text"
              className={styles["chj-input"]}
              placeholder="휴대전화번호 '-' 없이 입력"
              value={phone}
              onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
            />
            <button className={styles["send-code-button"]} onClick={sendVerificationCode}>인증번호 전송</button>
          </div>

          <div className={styles["chj-verify-section"]}>
            <input
              type="text"
              placeholder="인증번호 6자리 숫자 입력"
              value={phoneCode}
              onChange={(e) => setPhoneCode(e.target.value)}
              className={styles["chj-input"]}
            />
            <button className={styles["send-code-button"]} onClick={verifyPhoneCode}>인증하기</button>
          </div>

          <div className={styles["chj-signup-links"]}>
            <span>회원가입이 필요하신가요?</span><a href="/signup"> 회원가입하기</a>
          </div>
        </div>
      ) : (
        <div className={styles["chj-form-group"]}>
          <label className={styles["form-label"]}>이름</label>
          <input
            type="text"
            placeholder="이름 입력"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles["chj-input"]}
          />

          <label className={styles["form-label"]}>이메일주소</label>
          <div className={styles["chj-email-row"]}>
            <input
              type="text"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles["chj-input"]}
            />
            <span>@</span>
            <select
              value={emailDomain}
              onChange={(e) => setEmailDomain(e.target.value)}
              className={styles["chj-select"]}
            >
              <option value="">직접 입력</option>
              <option value="naver.com">naver.com</option>
              <option value="gmail.com">gmail.com</option>
              <option value="daum.net">daum.net</option>
            </select>
            <button className={styles["send-code-button"]} onClick={sendEmailCode}>인증번호전송</button>
          </div>

          <div className={styles["chj-verify-section"]}>
            <input
              type="text"
              placeholder="인증번호 6자리 숫자 입력"
              value={emailCode}
              onChange={(e) => setEmailCode(e.target.value)}
              className={styles["chj-input"]}
            />
            <button className={styles["send-code-button"]} onClick={verifyEmailCode}>인증하기</button>
          </div>

          <div className={styles["chj-signup-links"]}>
            <span>회원가입이 필요하신가요?</span><a href="/signup"> 회원가입하기</a>
          </div>
        </div>
      )}
    </motion.div>


  );
}

export default FindIdPage;
