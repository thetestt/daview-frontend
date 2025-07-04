import React, { useEffect, useState } from "react";
import axiosInstance from "../../pages/auth/axiosInstance";
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
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleResetToDefault = () => {
    setPreviewImage("/uploads/profile/default-profile.png");
    setUploadFile("default");
  };

  const handleUpload = async () => {
    if (!uploadFile) return;

    const isDefault = uploadFile === "default";
    const formData = new FormData();

    if (isDefault) {
      try {
        await axiosInstance.post("/mypage/profile-image/default");
        alert("기본 이미지로 변경되었습니다.");
        setProfileImage("/uploads/profile/default-profile.png");
      } catch (err) {
        alert("기본 이미지 변경 실패");
        return;
      }
    } else {
      formData.append("file", uploadFile);
      try {
        await axiosInstance.post("/mypage/profile-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("프로필 이미지가 변경되었습니다.");
        setProfileImage(previewImage);
      } catch (err) {
        alert("이미지 업로드 실패");
        return;
      }
    }

    setPreviewImage(null);
    setUploadFile(null);
  };



  const handleMarketingToggle = (type, value) => {
    const payload = {
      username: profile.username,
      type,
      value,
    };

    axiosInstance.patch("/mypage/account/marketing", payload)
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
    // 프로필 이미지 가져오기 
    axiosInstance.get("/mypage/profile-image")
      .then((res) => {
        const url = res.data;
        setProfileImage(url && url.trim() !== "" ? url : "/uploads/profile/default-profile.png");
      })
      .catch(() => setProfileImage("/uploads/profile/default-profile.png"));

    // 사용자 정보 가져오기
    axiosInstance.get("/mypage/profile")
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
                <img src={previewImage || profileImage} alt="프로필 이미지" />
              </div>
              <div>
                <button className={styles["chj-plain-btn"]} onClick={() => setShowMenu(!showMenu)}>
                  프로필 변경하기
                </button>
                {showMenu && (
                  <div className={styles["chj-image-menu"]}>
                    <button className={styles["chj-default-btn"]} onClick={handleResetToDefault}>기본 이미지로</button>
                    <label>
                      <span>이미지 업로드</span>
                      <input type="file" className={styles["chj-file"]} accept="image/*" onChange={handleImageChange} hidden />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {previewImage && (
            <div className={styles["confirm-buttons"]}>
              <button className={styles["chj-cancel-btn"]} onClick={() => { setPreviewImage(null); setUploadFile(null); }}>취소</button>
              <button className={styles["chj-confirm-btn"]} onClick={handleUpload}>완료</button>
            </div>
          )}

          <div className={styles["profile-grid"]}>
            <div className={styles["profile-label"]}>사용자 아이디</div>
            <div className={styles["profile-value"]}>{profile.username}</div>
            <div className={styles["profile-change-btn"]}>
              <button
                className={styles["chj-mod-btn"]}
                onClick={() => navigate("/mypage/ChangeIdPage", {
                  state: { username: profile.username }
                })}
              >변경</button>
            </div>

            <div className={styles["profile-label"]}>사용자 이름</div>
            <div className={styles["profile-value"]}>{maskName(profile.name)}</div>
            <div></div>

            <div className={styles["profile-label"]}>사용자 전화번호</div>
            <div className={styles["profile-value"]}>{maskPhone(profile.phone)}</div>
            <div></div>
          </div>
        </div>


        <div
          className={styles["profile-box"]}
          onClick={() =>
            navigate("/FindPasswordPage/CPw-check", {
              state: { username: profile.username },
            })}>
          <div className={styles["profile-item"]}>
            <label>비밀번호 변경하기</label>
          </div>
        </div>


        <div
          className={styles["profile-box"]}
          onClick={() =>
            navigate("/mypage/myprofile/refundaccount", {
              state: { username: profile.username },
            })}>
          <div className={styles["profile-item"]}>
            <label>환불계좌 관리</label>
          </div>
        </div>
        <div className={styles["profile-box"]}>
          <div className={styles["consent-box"]}>
            <label className={styles["consent-label"]}>SMS 수신 동의</label>
            <label className={styles["toggle-switch"]}>
              <input
                type="checkbox"
                checked={agreeSms}
                onChange={() => handleMarketingToggle("sms", !agreeSms)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles["consent-box"]}>
            <label className={styles["consent-label"]}>Email 수신 동의</label>
            <label className={styles["toggle-switch"]}>
              <input
                type="checkbox"
                checked={agreeEmail}
                onChange={() => handleMarketingToggle("email", !agreeEmail)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles["consent-box"]}>
            <label className={styles["consent-label"]}>Push 알림 수신 동의</label>
            <label className={styles["toggle-switch"]}>
              <input
                type="checkbox"
                checked={agreePush}
                onChange={() => handleMarketingToggle("push", !agreePush)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>



        <div
          className={styles["profile-box"]}
          onClick={() =>
            navigate("/mypage/myprofile/withdraw", {
              state: { username: profile.username },
            })}>
          <div className={styles["profile-item"]}>
            <label>회원 탈퇴</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
