import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../styles/auth/ChangeIdPage.module.css";

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
      const res = await axios.get(
        `http://localhost:8080/api/auth/check-username?username=${username}`
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
      const token = localStorage.getItem("token");
      await axios.patch(
        "/api/mypage/account/username",
        { newUsername: username },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("아이디가 변경되었습니다.");
      navigate("/mypage/myprofile", {
        state: { username: username }});
    } catch (err) {
      console.error("아이디 변경 실패", err);
      alert("아이디 변경 중 오류 발생");
    }
  };



  return (
    <div className={styles["change-id-container"]}>
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
        <p className={styles["input-error"]}>이미 사용 중인 아이디입니다.</p>
      )}
      {isDuplicate === false && (
        <p className={styles["input-success"]}>사용 가능한 아이디입니다.</p>
      )}
      <button type="button" className={styles["change-button"]} onClick={handleChangeUsername}> 아이디 변경하기</button>

    </div>
  );
}

export default ChangeIdPage;
