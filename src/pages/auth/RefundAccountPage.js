import React, { useState, useEffect } from "react";
import axiosInstance from "../../pages/auth/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../styles/auth/RefundAccountPage.module.css";
import { motion } from "framer-motion";


function RefundAccountPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const username = state?.username || "";

  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [name, setName] = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    // 이름 불러오기
    axiosInstance.get("/mypage/profile")
      .then(res => setName(res.data.name || ""))
      .catch(err => console.log("이름 불러오기 실패", err));

    // 계좌 불러오기
    axiosInstance.get("/mypage/account/refund")
      .then(res => {
        setBankName(res.data.bankName || "");
        setAccountNumber(res.data.accountNumber || "");
      })
      .catch(err => console.log("계좌 조회 실패", err));
  }, []);

  const handleSave = async () => {
    if (!bankName || !accountNumber.trim()) {
      alert("은행명과 계좌번호를 입력하세요.");
      console.log("은행명:", `"${bankName}"`);
      console.log("계좌번호:", `"${accountNumber}"`);
      console.log("username:", username);
      return;
    }

    try {
      const res = await axiosInstance.post("/mypage/account/refund", {
        bankName,
        accountNumber,
      });

      console.log("저장 응답:", res.data);

      alert("환불 계좌가 저장되었습니다.");
      navigate("/mypage/myprofile");
    } catch (err) {
      console.error("저장 오류", err);
      alert("저장 실패");
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete("/mypage/account/refund");
      alert("환불 계좌가 해지되었습니다.");
      setBankName("");
      setAccountNumber("");
    } catch (err) {
      console.error("해지 오류", err);
      alert("해지 실패");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }} className={styles["refund-container"]}>
      <h1 className={styles["refund-title"]}>환불 계좌 관리</h1>
      <div className={styles["refund-box"]}>
        <div className={styles["refund-field"]}>
          <label className={styles["refund-label"]}>계좌주</label>
          <input type="text" className={styles["refund-input"]} value={name} disabled />
        </div>

        <div className={styles["refund-field"]}>
          <label className={styles["refund-label"]}>은행명</label>
          <select
            className={styles["refund-select"]}
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
          >
            <option value="">은행을 선택해주세요.</option>
            <option value="국민은행">국민은행</option>
            <option value="하나은행">하나은행</option>
            <option value="신한은행">신한은행</option>
            <option value="우리은행">우리은행</option>
            <option value="카카오뱅크">카카오뱅크</option>
            <option value="산업은행">산업은행</option>
            <option value="외환은행">외환은행</option>
            <option value="SC제일은행">SC제일은행</option>
            <option value="상호저축은행">상호저축은행</option>
            <option value="HSBC은행">HSBC은행</option>
            <option value="한국씨티은행">한국씨티은행</option>
            <option value="광주은행">광주은행</option>
            <option value="경남은행">경남은행</option>
            <option value="iM뱅크(대구)">iM뱅크(대구)</option>
            <option value="부산은행">부산은행</option>
            <option value="전북은행">전북은행</option>
            <option value="우체국">우체국</option>
            <option value="토스뱅크">토스뱅크</option>
            <option value="케이뱅크">케이뱅크</option>
            <option value="산림조합중앙회">산림조합중앙회</option>
            <option value="유안타증권">유안타증권</option>
            <option value="삼성증권">삼성증권</option>
            <option value="한국투자증권">한국투자증권</option>
            <option value="NH투자증권">NH투자증권</option>
            <option value="대신증권">대신증권</option>
            <option value="신한금융투자">신한금융투자</option>
            <option value="유진투자증권">유진투자증권</option>
            <option value="메리츠증권">메리츠증권</option>
          </select>
        </div>
        <div className={styles["refund-field"]}>
          <label className={styles["refund-label"]}>계좌번호</label>
          <input
            type="text"
            className={styles["refund-input"]}
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="계좌번호 '-' 없이 입력"
          />
        </div>

        <div className={styles["refund-buttons"]}>
          <button onClick={handleDelete} className={styles["refund-cancel-btn"]}>
            해지
          </button>
          <button onClick={handleSave} className={styles["refund-save-btn"]}>
            저장
          </button>
        </div>
      </div>
    </motion.div>

  );
}

export default RefundAccountPage;
