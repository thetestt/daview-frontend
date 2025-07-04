import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/auth/FindPasswordPage.module.css";
import { motion } from "framer-motion";


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
      if (err.response?.status === 400) {
        alert("입력하신 정보를 다시 확인해주세요.");
      } else {
        alert("문자 전송 중 오류가 발생했습니다.");
      }
    }

  };

  return (
    <motion.div initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }} className={styles["find-password-wrapper"]}>
      <h2 className={styles["find-title"]}>비밀번호 찾기</h2>

      {method === "phone" && (
        <div className={styles["chj-form-group"]}>
          <label className={styles["form-label"]}>이름</label>
          <input
            type="text"
            placeholder="이름 입력"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles["chj-input"]}
          />

          <label className={styles["form-label"]}>아이디</label>
          <input
            type="text"
            placeholder="아이디 입력"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles["chj-input"]}
          />

          <label className={styles["form-label"]}>전화번호</label>
          <div className={styles["chj-phone-inputs"]}>
            <input
              type="text"
              placeholder="휴대전화번호 '-' 없이 입력"
              className={styles["chj-input"]}
              value={phone}
              onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
            />
            <button className={styles["send-code-button"]} onClick={sendVerificationCode}>인증번호전송</button>
          </div>

          <label className={styles["form-label"]}>전화번호 인증</label>
          <div className={styles["chj-verify-section"]}>
            <input
              type="text"
              placeholder="인증번호 입력"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={styles["chj-input"]}
            />
            <button className={styles["send-code-button"]} onClick={verifyCode}>인증하기</button>
          </div>

          <div className={styles["chj-signup-links"]}>
            <a href="/findidpage">아이디찾기</a><span> | </span><a href="/signup">회원가입</a>
          </div>
        </div>
      )}
    </motion.div>

  );
}

export default FindPasswordPage;
