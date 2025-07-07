import React, { useState } from "react";
import axiosInstance from "../../pages/auth/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../styles/auth/ChangePasswordPage.module.css";
import { motion } from "framer-motion";


function ChangePasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const username = location.state?.username || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isSameAsCurrent, setIsSameAsCurrent] = useState(false);


  const handleChangePassword = async () => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{10,16}$/;

    if (currentPassword === newPassword) {
      alert("현재 비밀번호와 동일한 비밀번호로 변경할 수 없습니다.");
      return;
    }
  
    if (!passwordRegex.test(newPassword)) {
      alert("비밀번호는 10~16자, 영문/숫자/기호를 모두 포함해야 합니다.");
      return;
    }
  
    if (newPassword !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    

    try {
      await axiosInstance.post("/auth/account/change-password", {
        newPassword,
      });
      alert("비밀번호가 변경되었습니다.");
      navigate("/login");
    } catch (err) {
      console.error("비밀번호 변경 오류", err);
      if (err.response?.data) {
        alert(err.response.data);
      } else {
        alert("비밀번호 변경 실패");
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }} className={styles["sh-wrapper"]}>
      <div className={styles["change-password-container"]}>
        <h2>비밀번호 변경</h2>
        <input
          type="password"
          placeholder="새 비밀번호"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button className={styles["pass-btn"]} onClick={handleChangePassword}>
          비밀번호 변경
        </button>
      </div>

    </motion.div>

  );


}

export default ChangePasswordPage;
