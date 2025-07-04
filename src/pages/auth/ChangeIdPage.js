import axiosInstance from "../../pages/auth/axiosInstance";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../styles/auth/ChangeIdPage.module.css";
import { motion } from "framer-motion";


function ChangeIdPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [username, setUsername] = useState(location.state?.username || "");
  const [isDuplicate, setIsDuplicate] = useState(null);

  const originalUsername = location.state?.username;

  const checkUsername = async () => {
    if (!username) {
      alert("아이디를 입력해주세요.");
      return;
    }

    if (username === originalUsername) {
      alert("현재 사용 중인 아이디입니다.");
      setIsDuplicate(true);
      return;
    }


    try {
      const res = await axiosInstance.get(
        `/auth/check-username?username=${username}`
      );
      if (res.data === true) {
        alert("이미 사용 중인 아이디입니다.");
        setIsDuplicate(true);
      } else {
        alert("사용 가능한 아이디입니다.");
        setIsDuplicate(false);
      }
    } catch (err) {
      console.error("중복 확인 오류", err);
      alert("중복 확인 중 오류 발생");
    }
  };

  const handleChangeUsername = async () => {
    if (isDuplicate !== false) {
      alert("사용 가능한 아이디인지 확인해주세요.");
      return;
    }

    try {
      const res = await axiosInstance.patch("/mypage/account/username", {
        newUsername: username,
      });

      const newToken = res.data.token;
      localStorage.setItem("token", newToken);
      window.dispatchEvent(new Event("loginStatusChanged"));

      alert("아이디가 변경되었습니다.");
      navigate("/mypage/myprofile", {
        state: { username: username },
      });
    } catch (err) {
      console.error("아이디 변경 실패", err);
      alert("아이디 변경 중 오류 발생");
    }
  };



  return (
    <motion.div initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={styles["change-id-container"]}>
      <h2>아이디 변경</h2>
      <div className={styles["username-check-wrapper"]}>
        <input
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setIsDuplicate(null);
          }}
          placeholder="아이디 입력"
        />
        <button
          type="button"
          className={styles["username-check-button"]}
          onClick={checkUsername}
        >중복 확인</button>
      </div>
      {isDuplicate === true && (
        <p className={styles["chj-input-error"]}>이미 사용 중인 아이디입니다.</p>
      )}
      {isDuplicate === false && (
        <p className={styles["chj-input-success"]}>사용 가능한 아이디입니다.</p>
      )}
      <button type="button" className={styles["chj-change-button"]} onClick={handleChangeUsername}> 아이디 변경하기</button>

    </motion.div>
  );
}

export default ChangeIdPage;
