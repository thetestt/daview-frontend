import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "../../styles/auth/MyProfile.module.css";
import { getPaymentsByMemberId } from "../../api/paymentApi";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const [profile, setProfile] = useState({
    username: "",
    name: "",
    phone: "",
  });
  const [consults, setConsults] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [payments, setPayments] = useState([]);
  const memberId = localStorage.getItem("memberId");
  const navigate = useNavigate();
  const [isMarketingAgreed, setIsMarketingAgreed] = useState(false);

  const [agreeSms, setAgreeSms] = useState(false);
  const [agreeEmail, setAgreeEmail] = useState(false);
  const [agreePush, setAgreePush] = useState(false);


  const maskName = (name) => {
    if (!name) return "";
    if (name.length === 2) {
      return name[0] + "*";
    }
    if (name.length >= 3) {
      return name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
    }
    return name;
  };

  const maskPhone = (phone) => {
    if (!phone) return "";
    const parts = phone.split("-");
    if (parts.length === 3) {
      return `${parts[0]}-****-${parts[2]}`;
    }
    return phone;
  };

  const handleMarketingToggle = (type, value) => {
    const payload = {
      username: profile.username,
      type,
      value,
    };

    axios.patch("/api/mypage/account/marketing", payload)
      .then(() => {
        console.log(`[${type}] 마케팅 동의 변경 완료`);
        if (type === "sms") {
          setAgreeSms(value);
          alert(value ? "SMS 수신에 동의하셨습니다." : "SMS 수신을 거부하셨습니다.");
        }
        if (type === "email") {
          setAgreeEmail(value);
          alert(value ? "Email 수신에 동의하셨습니다." : "Email 수신을 거부하셨습니다.");
        }
        if (type === "push") {
          setAgreePush(value);
          alert(value ? "Push 알림 수신에 동의하셨습니다." : "Push 알림 수신을 거부하셨습니다.");
        }
      })
      .catch(err => {
        console.error(`[${type}] 동의 변경 실패`, err);
        alert("마케팅 동의 변경 실패");
      });
  };


  useEffect(() => {

    const token = localStorage.getItem("token");
    if (!token) return;

    axios.get("/api/mypage/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log("프로필 응답", res.data);
        setProfile(res.data);

        setAgreeSms(res.data.agreeSms ?? false);
        setAgreeEmail(res.data.agreeEmail ?? false);
        setAgreePush(res.data.agreePush ?? false);

      })
      .catch((err) => console.error("프로필 가져오기 실패:", err));
  }, []);

  return (
    <div className={styles["mypage-container"]}>
      <h1 className={styles["myprofile-title"]}>내 정보</h1>

      <div className={styles["myprofile-right"]}>
        <div className={styles["profile-box"]}>
          <h2 className={styles["profile-title"]}>회원정보 수정</h2>
          <div className={styles["profile-item"]}>
            <label>사용자 아이디</label>
            <div className={styles["value"]}>{profile.username}</div>
            <button className={styles["mod-btn"]}>변경</button>
          </div>
          <div className={styles["profile-item"]}>
            <label>사용자 이름</label>
            <div className={styles["value"]}>{maskName(profile.name)}</div>
          </div>
          <div className={styles["profile-item"]}>
            <label>사용자 전화번호</label>
            <div className={styles["value"]}>{maskPhone(profile.phone)}</div>
          </div>
        </div>
        <br />

        <div
          className={styles["profile-box"]}
          onClick={() =>
            navigate("/FindPasswordPage/CPw-check", {
              state: { username: profile.username },
            })}>
          <div className={styles["profile-item"]}>
            <label>비밀번호 변경하기</label>
            <div className={styles["arrow"]}>&gt;</div>
          </div>
        </div>

        <br />

        <div
          className={styles["profile-box"]}
          onClick={() =>
            navigate("/mypage/myprofile/refundaccount", {
              state: { username: profile.username },
            })}>
          <div className={styles["profile-item"]}>
            <label>환불계좌 관리</label>
            <div className={styles["arrow"]}>&gt;</div>
          </div>
        </div>

        <br />

        <div className={styles["profile-box"]}>
          <div className={styles["profile-item"]}>
            <label>SMS 수신 동의</label>
            <label className={styles["switch"]}>
              <input
                type="checkbox"
                checked={agreeSms}
                onChange={(e) => handleMarketingToggle("sms", e.target.checked)}
              />
              <span className={styles["slider"]}></span>
            </label>
          </div>

          <div className={styles["profile-item"]}>
            <label>Email 수신 동의</label>
            <label className={styles["switch"]}>
              <input
                type="checkbox"
                checked={agreeEmail}
                onChange={(e) => handleMarketingToggle("email", e.target.checked)}
              />
              <span className={styles["slider"]}></span>
            </label>
          </div>

          <div className={styles["profile-item"]}>
            <label>Push 알림 수신 동의</label>
            <label className={styles["switch"]}>
              <input
                type="checkbox"
                checked={agreePush}
                onChange={(e) => handleMarketingToggle("push", e.target.checked)}
              />
              <span className={styles["slider"]}></span>
            </label>
          </div>
        </div>

        <br />
        <div
          className={styles["profile-box"]}
          onClick={() =>
            navigate("/mypage/myprofile/withdraw", {
              state: { username: profile.username },})}>
          <div className={styles["profile-item"]}>
            <label>회원 탈퇴</label>
            <div className={styles["arrow"]}>&gt;</div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default MyProfile;

