import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../styles/auth/ChangePasswordCheckPage.module.css";

function ChangePasswordCheckPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const username = location.state?.username || "";

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleChangePassword = async () => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{10,16}$/;

        if (!currentPassword) {
            alert("현재 비밀번호를 입력하세요.");
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
            const checkRes = 
            await axios.post("http://localhost:8080/api/mypage/check-password", {
                username,
                password: currentPassword
              });
          
              if (!checkRes.data.success) {
                alert("현재 비밀번호가 일치하지 않습니다.");
                return;
              }
          
              await axios.post("http://localhost:8080/api/account/change-password", {
                username,
                newPassword
              });
          
              alert("비밀번호가 변경되었습니다.");
              navigate("/login");

            } catch (err) {
              console.error("비밀번호 변경 오류", err);
              alert("비밀번호 변경 중 오류 발생");
            }
          };

  return (
            <div className={styles["change-password-container"]}>
                <h2>비밀번호 변경</h2>

                <input
                    type="password"
                    placeholder="현재 비밀번호"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />
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

                <button onClick={handleChangePassword}>비밀번호 변경</button>
            </div>
        );
    }

    export default ChangePasswordCheckPage;
