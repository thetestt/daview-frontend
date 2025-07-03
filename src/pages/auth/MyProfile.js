import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/auth/MyProfile.module.css";

const MyProfile = () => {
  const [profile, setProfile] = useState({
    username: "",
    name: "",
    phone: "",
  });

  const navigate = useNavigate();
  const [agreeSms, setAgreeSms] = useState(false);
  const [agreeEmail, setAgreeEmail] = useState(false);
  const [agreePush, setAgreePush] = useState(false);

  const [profileImage, setProfileImage] = useState("/uploads/profile/default-profile.png");
  const [showMenu, setShowMenu] = useState(false);

  const maskName = (name) => {
    if (!name) return "";
    if (name.length === 2) return name[0] + "*";
    if (name.length >= 3) return name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
    return name;
  };

  const maskPhone = (phone) => {
    if (!phone) return "";
    const parts = phone.split("-");
    if (parts.length === 3) return `${parts[0]}-****-${parts[2]}`;
    return phone;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("memberId", localStorage.getItem("memberId"));

      try {
        await axios.post("/api/mypage/profile-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const reader = new FileReader();
        reader.onload = () => setProfileImage(reader.result);
        reader.readAsDataURL(file);
      } catch (err) {
        console.error("이미지 업로드 실패", err);
        alert("이미지 업로드에 실패했습니다.");
      }
    }
  };

  const handleMarketingToggle = (type, value) => {
    const payload = {
      username: profile.username,
      type,
      value,
    };

    axios.patch("/api/mypage/account/marketing", payload)
      .then(() => {
        if (type === "sms") setAgreeSms(value);
        if (type === "email") setAgreeEmail(value);
        if (type === "push") setAgreePush(value);
        alert(`${type.toUpperCase()} ${value ? "수신 동의" : "수신 거부"} 처리되었습니다.`);
      })
      .catch((err) => {
        console.error("마케팅 동의 변경 실패", err);
        alert("마케팅 동의 변경 실패");
      });
  };

  useEffect(() => {
    const memberId = localStorage.getItem("memberId");

    // 프로필 이미지 가져오기
    axios.get(`/api/mypage/profile-image/${memberId}`)
      .then((res) => setProfileImage(res.data))
      .catch(() => setProfileImage("/uploads/profile/default-profile.png"));

    // 사용자 정보 가져오기
    const token = localStorage.getItem("token");
    if (!token) return;

    axios.get("/api/mypage/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
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
            <div className={styles["profile-image-section"]}>
              <div className={styles.profileCircle}>
                <img src={profileImage} alt="프로필 이미지" />
              </div>
              <div className={styles["image-overlay"]}>
                <button
                  className={styles["chj-add-btn"]}
                  onClick={() => setShowMenu(!showMenu)}
                >+</button>
                {showMenu && (
                  <div className={styles["chj-image-menu"]}>
                    <button onClick={() => setProfileImage("/uploads/profile/default-profile.png")}>기본 이미지로</button>
                    <label>
                      <span>이미지 업로드</span>
                      <input type="file" className={styles["chj-file"]} accept="image/*" onChange={handleImageChange} hidden />
                    </label>
                  </div>
                )}
              </div>
            </div>
            <label>사용자 아이디</label>
            <div className={styles["chj-value"]}>{profile.username}</div>
            <button
              className={styles["chj-mod-btn"]}
              onClick={() => navigate("/mypage/ChangeIdPage", {
                state: { username: profile.username }
              })}
            >변경</button>
          </div>

          <div className={styles["profile-item"]}>
            <label>사용자 이름</label>
            <div className={styles["chj-value"]}>{maskName(profile.name)}</div>
          </div>

          <div className={styles["profile-item"]}>
            <label>사용자 전화번호</label>
            <div className={styles["chj-value"]}>{maskPhone(profile.phone)}</div>
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
            <div className={styles["chj-arrow"]}>&gt;</div>
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
            <div className={styles["chj-arrow"]}>&gt;</div>
          </div>
        </div>

        <br />

        <div className={styles["profile-box"]}>
          <div className={styles["profile-item"]}>
            <label>SMS 수신 동의</label>
            <label className={styles["chj-switch"]}>
              <input
                type="checkbox"
                checked={agreeSms}
                onChange={(e) => handleMarketingToggle("sms", e.target.checked)}
              />
              <span className={styles["chj-slider"]}></span>
            </label>
          </div>

          <div className={styles["profile-item"]}>
            <label>Email 수신 동의</label>
            <label className={styles["chj-switch"]}>
              <input
                type="checkbox"
                checked={agreeEmail}
                onChange={(e) => handleMarketingToggle("email", e.target.checked)}
              />
              <span className={styles["chj-slider"]}></span>
            </label>
          </div>

          <div className={styles["profile-item"]}>
            <label>Push 알림 수신 동의</label>
            <label className={styles["chj-switch"]}>
              <input
                type="checkbox"
                checked={agreePush}
                onChange={(e) => handleMarketingToggle("push", e.target.checked)}
              />
              <span className={styles["chj-slider"]}></span>
            </label>
          </div>
        </div>

        <br />

        <div
          className={styles["profile-box"]}
          onClick={() =>
            navigate("/mypage/myprofile/withdraw", {
              state: { username: profile.username },
            })}>
          <div className={styles["profile-item"]}>
            <label>회원 탈퇴</label>
            <div className={styles["chj-arrow"]}>&gt;</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
