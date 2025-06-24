import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/auth/MyPage.css";
import { getPaymentsByMemberId } from "../../api/paymentApi";
import { getChatRooms } from "../../api/chat";

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

  const handleChatOpen = async () => {
    try {
      const chatRooms = await getChatRooms(memberId);

      if (!chatRooms.length) {
        alert("채팅방이 없습니다.");
        setConsults([]);
        return;
      }

      setConsults(chatRooms);

      const chatroomId = chatRooms[0].chatroomId;
      const chatUrl = `/chat/${chatroomId}?skipValidation=true`;

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
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("/api/mypage/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("프로필 응답", res.data);
        setProfile(res.data);
      })
      .catch((err) => console.error("프로필 가져오기 실패:", err));

    //   axios
    //     .get("/api/mypage/consults", {
    //       headers: { Authorization: `Bearer ${token}` },
    //     })
    //     .then((res) => setConsults(res.data))
    //     .catch((err) => console.error("상담내역 불러오기 실패", err));

    //   axios
    //     .get("/api/mypage/reviews", {
    //       headers: { Authorization: `Bearer ${token}` },
    //     })
    //     .then((res) => setReviews(res.data))
    //     .catch((err) => console.error("리뷰 불러오기 실패", err));

    getPaymentsByMemberId(memberId)
      .then((res) => setPayments(res ?? []))
      .catch((err) => console.error("주문 내역 불러오기 실패", err));

    //   // 나중에 백엔드 붙이면 아래 axios 요청 추가 예정
    //   setFavorites([]); // 임시 빈 배열
    //   setCoupons([]); // 임시 빈 배열
  }, [memberId]);

  return (
    <div className="mypage-container">
      <h1 className="mypage-title">마이 페이지</h1>

      <div className="mypage-body">
        <div className="mypage-left">
          <div className="mypage-avatar"></div>
          <ul className="mypage-menu">
            <li>
              <Link to="/mypage/myprofile">내 프로필</Link>
            </li>
            <li>
              <Link to="/FindPasswordPage/CPw">비밀번호 변경</Link>
            </li>
            <li>
              <Link to={`/payments/member/${memberId}`}>주문 내역</Link>
            </li>
            <li>
              <button type="button" onClick={handleChatOpen}>
                1:1 채팅룸
              </button>
            </li>
            <li>내가 쓴 후기</li>
            <li>나의 찜 목록</li>
            <li>내 쿠폰 보기</li>
          </ul>
        </div>

        <div className="mypage-right">
          <div className="profile-box">
            <h2 className="profile-title">내 프로필</h2>
            <div className="profile-item">
              <label>사용자 아이디</label>
              <div className="value">{profile.username}</div>
              <button className="mod-btn">수정</button>
            </div>
            <div className="profile-item">
              <label>사용자 이름</label>
              <div className="value">{profile.name}</div>
              <button className="mod-btn">수정</button>
            </div>
            <div className="profile-item">
              <label>사용자 전화번호</label>
              <div className="value">{profile.phone}</div>
              <button className="mod-btn">수정</button>
            </div>
          </div>
          <br />

          <div className="profile-box">
            <h2 className="profile-title">비밀번호 변경</h2>
            <div className="profile-item">
              <label>비밀번호</label>
              <Link to="/FindPasswordPage/CPw" className="mod-btn">
                비밀번호 변경
              </Link>
            </div>
          </div>
          <br />

          <div className="profile-box">
            <h2 className="profile-title">주문 내역</h2>
            <div className="profile-item">
              <label>주문 건수</label>
              <div className="value">{payments.length} 건</div>
            </div>
          </div>
          <br />

          <div className="profile-box">
            <h2 className="profile-title">1:1 상담 내역</h2>
            <div className="profile-item">
              <label>상담 건수</label>
              <div className="value">{consults.length} 건</div>
            </div>
          </div>
          <br />

          <div className="profile-box">
            <h2 className="profile-title">내가 쓴 후기</h2>
            <div className="profile-item">
              <label>총 후기</label>
              <div className="value">{reviews.length} 건</div>
            </div>
          </div>
          <br />

          <div className="profile-box">
            <h2 className="profile-title">나의 찜 목록</h2>
            <div className="profile-item">
              <label>찜한 시설</label>
              <div className="value">{favorites.length} 개</div>
            </div>
          </div>
          <br />

          <div className="profile-box">
            <h2 className="profile-title">내 쿠폰 보기</h2>
            <div className="profile-item">
              <label>사용 가능한 쿠폰</label>
              <div className="value">{coupons.length} 장</div>
            </div>
          </div>
          <br />
        </div>
      </div>
    </div>
  );
};

export default MyPage;
