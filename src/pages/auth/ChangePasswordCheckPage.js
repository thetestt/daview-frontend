import React, { useState } from "react";
import axiosInstance from "../../pages/auth/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../styles/auth/ChangePasswordCheckPage.module.css";

function ChangePasswordCheckPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const username = location.state?.username || "";

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPasswordVerified, setIsPasswordVerified] = useState(false);
    const [passwordMismatch, setPasswordMismatch] = useState(false);


    const handleChangePassword = async () => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{10,16}$/;

        if (!currentPassword) {
            alert("현재 비밀번호를 입력하세요.");
            return;
        }

        if (isPasswordVerified && currentPassword === newPassword) {
            alert("새 비밀번호는 기존 비밀번호와 달라야 합니다.");
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
            const res = await axiosInstance.post("/mypage/check-password", {
                password: currentPassword,
              });
              

            if (!res.data.success) {
                alert("현재 비밀번호가 일치하지 않습니다.");
                setPasswordMismatch(true);
                setIsPasswordVerified(false);
                return;
            }
            
            if (currentPassword === newPassword) {
                alert("새 비밀번호는 기존 비밀번호와 달라야 합니다.");
                return;
            }

            setIsPasswordVerified(true);
            setPasswordMismatch(false);

            await axiosInstance.post("/auth/account/change-password", {
                newPassword,
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
                onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    setPasswordMismatch(false);
                }}

            />
            {currentPassword === "" && (
                <p className={styles["input-error"]}>현재 비밀번호를 입력하세요.</p>
            )}
            {passwordMismatch && (
                <p className={styles["input-error"]}>현재 비밀번호가 일치하지 않습니다.</p>
            )}


            <input
                type="password"
                placeholder="새 비밀번호"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            {newPassword && isPasswordVerified && currentPassword === newPassword && (
                <p className={styles["input-error"]}>기존 비밀번호와 동일합니다.</p>
            )}

            {newPassword &&
                !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{10,16}$/.test(newPassword) && (
                    <p className={styles["input-error"]}>
                        비밀번호는 10~16자, 영문/숫자/기호 포함해야 합니다.
                    </p>
                )}

            <input
                type="password"
                placeholder="비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmPassword && newPassword !== confirmPassword && (
                <p className={styles["input-error"]}>비밀번호가 일치하지 않습니다.</p>
            )}

            <button className={styles["change-btn"]} onClick={handleChangePassword}>비밀번호 변경</button>
        </div>
    );
}

export default ChangePasswordCheckPage;
