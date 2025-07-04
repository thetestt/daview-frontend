import axiosInstance from "../../pages/auth/axiosInstance";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/auth/MyPage.module.css";
import { getPaymentsByMemberId } from "../../api/paymentApi";
import { getChatRooms } from "../../api/chat";
import { useNavigate } from "react-router-dom";


const MyPage = () => {
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
  const [profileImage, setProfileImage] = useState("/images/default-profile.png");



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

  const handleChatOpen = async () => {
    try {
      const chatRooms = await getChatRooms(memberId);

      if (!chatRooms.length) {
        alert("채팅방이 없습니다.");
        setConsults([]);
        return;
      }

      setConsults(chatRooms);
      const chatUrl = `/chat`;

      window.open(
        chatUrl,
        "chatWindow",
        "width=900,height=700,left=200,top=100,noopener,noreferrer"
      );
    } catch (error) {
      console.error("채팅방 열기 실패:", error);
      alert("채팅방을 여는 데 실패했습니다.");
    }
  };

  useEffect(() => {
    const handleLoadProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      console.log("[프론트] 사용하는 토큰:", token);
      console.log("[프론트] memberId:", memberId);

      try {
        const profileRes = await axiosInstance.get("/mypage/profile");
        setProfile(profileRes.data);
      } catch (err) {
        console.error("프로필 가져오기 실패:", err);
      }

      try {
        const res = await getChatRooms(memberId);
        setConsults(res ?? []);
      } catch (err) {
        console.error("1:1 문의 가져오기 실패:", err);
      }

      try {
        const res = await getPaymentsByMemberId(memberId);
        setPayments(res ?? []);
      } catch (err) {
        console.error("주문 내역 불러오기 실패:", err);
      }

      try {
        const couponRes = await axiosInstance.get("/coupon/my");
        setCoupons(couponRes.data ?? []);
      } catch (err) {
        console.error("쿠폰 불러오기 실패:", err);
      }

      try {
        const reviewRes = await axiosInstance.get("/review/my");
        setReviews(reviewRes.data ?? []);
      } catch (err) {
        console.error("내 후기 불러오기 실패:", err);
      }

      try {
        const imageRes = await axiosInstance.get("/mypage/profile-image");
        setProfileImage(imageRes.data || "/uploads/profile/default-profile.png");
      } catch (err) {
        console.error("프로필 이미지 불러오기 실패:", err);
        setProfileImage("/uploads/profile/default-profile.png");
      }

    };

    handleLoadProfile();
  }, []);

  return (
    <div className={styles["mypage-container"]}>
      <h1 className={styles["mypage-title"]}>마이 페이지</h1>

      <div className={styles["mypage-wrapper"]}>
        <div className={styles["mypage-left"]}>
          <div className={styles.profileCircle}>
            <img
              src={profileImage ? profileImage : "/images/default-profile.png"}
              alt="프로필 이미지"
              className={styles.profileImage}
            />
          </div>
          <div className={styles["user-info"]}>
            <div className={styles["username"]}>{profile.username}</div>
            <div className={styles["name"]}>{maskName(profile.name)}</div>
            <button className={styles["mod-btn"]} onClick={() => navigate("/mypage/ChangeIdPage", {
              state: { username: profile.username },
            })}>
              변경
            </button>
          </div>

          <ul className={styles["mypage-menu"]}>
            <li><Link to="/mypage/myprofile">내 정보</Link></li>
            <li><Link to={`/payments/member/${memberId}`}>주문 내역</Link></li>
            <li><button type="button" onClick={handleChatOpen} className={styles["fake-link"]}>1:1 문의</button></li>
            <li><Link to="/mypage/myprofile/myreview">내가 쓴 후기</Link></li>
            <li><Link to="/mypage/wishlist">나의 찜 목록</Link></li>
            <li><Link to="/mypage/mycoupon">내 쿠폰 보기</Link></li>
          </ul>
        </div>

        <div className={styles["mypage-right"]}>
          <div className={styles["profile-box"]}>
            <h2 className={styles["profile-title"]}>주문 내역</h2>
            <div className={styles["profile-item"]}>
              <label>주문 건수</label>
              <div className={styles["chj-value"]}>{payments.length} 건</div>
            </div>
          </div>

          <div className={styles["profile-box"]}>
            <h2 className={styles["profile-title"]}>1:1 문의</h2>
            <div className={styles["profile-item"]}>
              <label>상담 건수</label>
              <div className={styles["chj-value"]}>{consults.length} 건</div>
            </div>
          </div>

          <div className={styles["profile-box"]}>
            <h2 className={styles["profile-title"]}>내가 쓴 후기</h2>
            <div className={styles["profile-item"]}>
              <label>총 후기</label>
              <div className={styles["chj-value"]}>{reviews.length} 건</div>
            </div>
          </div>

          <div className={styles["profile-box"]}>
            <h2 className={styles["profile-title"]}>내 쿠폰 보기</h2>
            <div className={styles["profile-item"]}>
              <label>사용 가능한 쿠폰</label>
              <div className={styles["chj-value"]}>{coupons.length} 장</div>
            </div>
          </div>
        </div>
      </div>
    </div>


  );
};

export default MyPage;
