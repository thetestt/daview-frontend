import React, { useEffect, useState } from "react";
import axiosInstance from "../../pages/auth/axiosInstance";
import styles from "../../styles/auth/WithdrawPage.module.css";
import { useNavigate } from "react-router-dom";
import { createOrGetChatRoom } from "../../api/chat";
import { motion } from "framer-motion";


function WithdrawPage() {
  const [profile, setProfile] = useState(null);
  const [couponCount, setCouponCount] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [reasonVisible, setReasonVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [showExtraMsg, setShowExtraMsg] = useState(false);
  const navigate = useNavigate();

  const ADMIN_ID = 45;
  const ADMIN_FCID = "00000000-0000-0000-0000-000000000001";

  const token = localStorage.getItem("token");

  const REASON_LIST = [
    "서비스 이용이 불편해요",
    "오류가 자주 생겨요",
    "혜택이 부족해요",
    "쿠폰이 너무 적어요",
    "다른 계정으로 다시 가입하고 싶어요",
    "직접 입력"
  ];

  const EXTRA_MSGS = {
    "서비스 이용이 불편해요": "더 편리하게 개선할 수 있도록 노력하겠습니다.",
    "오류가 자주 생겨요": "겪은 불편을 알려주시면 도와드릴 수 있습니다. 최선을 다해 문제를 해결해보겠습니다.",
    "혜택이 부족해요": "더 좋은 혜택을 준비할 수 있도록 의견을 반영하겠습니다.",
    "쿠폰이 너무 적어요": "앞으로 더 많은 쿠폰 혜택을 제공할 수 있도록 하겠습니다.",
    "다른 계정으로 다시 가입하고 싶어요": "이메일을 변경하고 싶으신가요? 기존데이터는 유지하고 이메일만 변경해드리겠습니다"
  };

  useEffect(() => {
    if (!token) return;

    axiosInstance.get("/mypage/profile").then((res) => {
      setProfile(res.data);

      axiosInstance.get("/coupon/my").then((res) => {
        setCouponCount(res.data.length);
      });
    });
  }, []);

  const maskName = (name) => {
    if (!name) return "";
    return name[0] + "*" + name.slice(2);
  };

  const handleWithdraw = async () => {
    const reason = selectedReason === "직접 입력" ? customReason : selectedReason;

    if (!reason.trim()) {
      alert("탈퇴 사유를 입력해주세요.");
      return;
    }

    try {
      await axiosInstance.post("/mypage/account/withdraw", {
        reason,
      });
      localStorage.clear();
      window.location.href = "/";
    } catch (err) {
      alert("탈퇴 중 오류가 발생했습니다.");
    }
  };

  const handleReasonSelect = (r) => {
    setSelectedReason(r);
    setShowExtraMsg(r !== "직접 입력");
  };

  const memberId = localStorage.getItem("memberId");

  const handleContactAdmin = async () => {
    try {
      const res = await createOrGetChatRoom({
        memberId,
        receiverId: ADMIN_ID,
        facilityId: ADMIN_FCID,
      });

      const chatUrl = `/chat/${res.chatroomId}?skipValidation=true`;

      window.open(
        chatUrl,
        "chatWithAdmin",
        "width=900,height=700,left=200,top=100,noopener,noreferrer"
      );
    } catch (err) {
      alert("1:1 문의 채팅을 시작할 수 없습니다.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }} className={styles["withdraw-container"]}>
      <h1 className={styles["withdraw-page-title"]}>회원 탈퇴</h1>
      <div className={styles["withdraw-box"]}>
        {profile && (
          <>
            <h2 className={styles["withdraw-title"]}><span>{maskName(profile.name)}</span>님 탈퇴하기 전에 꼭 확인해주세요</h2>

            <ul className={styles["withdraw-notice-list"]}>
              <li>탈퇴 후 <b>14일이 지나야</b> 재가입이 가능해요.</li>
              <li>다시 가입하더라도 웰컴쿠폰은 받을 수 없어요.</li>
            </ul>

            <div className={styles["withdraw-coupon-box"]}>
              <p className={styles["withdraw-coupon-title"]}>보유 중인 쿠폰</p>
              <p className={styles["withdraw-coupon-count"]}><b>{couponCount}장</b></p>
            </div>

            <p className={styles["withdraw-outside-msg"]}>찜한 상품, 1:1 문의 등 <b>{maskName(profile.name)}님</b>의 소중한 기록이 모두 삭제돼요.</p>

            <label className={styles["withdraw-checkbox-line"]}>
              <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} />
              다뷰 회원 탈퇴 유의사항을 확인했어요.
            </label>

            {agreed && (
              <>
                <div className={styles["withdraw-reason-wrapper"]}>
                  <button className={styles["withdraw-confirm-btn"]} onClick={() => setReasonVisible(true)}>탈퇴 이유 입력하기</button>

                  {reasonVisible && (
                    <>
                      <h3 className={styles["withdraw-reason-title"]}>탈퇴 이유를 알려주세요</h3>
                      <p className={styles["withdraw-sub"]}>더 좋은 서비스를 제공하기 위해 노력하겠습니다.</p>

                      <div className={styles["withdraw-reason-list"]}>
                        {REASON_LIST.map((r) => (
                          <label key={r}>
                            <input
                              type="radio"
                              className={styles["withdraw-reason-radio"]}
                              value={r}
                              checked={selectedReason === r}
                              onChange={() => handleReasonSelect(r)}
                            />
                            {r}
                          </label>
                        ))}
                      </div>

                      {selectedReason === "직접 입력" && (
                        <textarea
                          placeholder="탈퇴 사유를 입력해주세요"
                          value={customReason}
                          onChange={(e) => setCustomReason(e.target.value)}
                        />
                      )}

                      {showExtraMsg && (
                        <div className={styles["withdraw-extra-msg"]}>
                          <p>{EXTRA_MSGS[selectedReason]}</p>
                          <div className={styles["withdraw-btn-row"]}>
                            <button className={styles["withdraw-gray"]} onClick={handleContactAdmin}>문의하기</button>
                            <button className={styles["withdraw-confirm-btn"]} onClick={handleWithdraw}>그래도 탈퇴하기</button>
                          </div>
                        </div>
                      )}

                      {selectedReason === "직접 입력" && customReason.trim() && (
                        <button className={styles["withdraw-confirm-btn"]} onClick={handleWithdraw}>회원 탈퇴하고 계정 삭제하기</button>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

export default WithdrawPage;