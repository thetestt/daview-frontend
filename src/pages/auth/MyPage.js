
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/auth/MyPage.css';

const MyPage = () => {
  const [profile, setProfile] = useState({
    username: '',
    name: '',
    phone: '',
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios.get("/api/mypage/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => setProfile(res.data))
      .catch(err => console.error('프로필 가져오기 실패:', err));
  }, []);


  return (
    <div className="mypage-container">
      <h1 className="mypage-title">마이 페이지</h1>
  
      <div className="mypage-body">
        <div className="mypage-left">
          <div className="mypage-avatar"></div>
          <ul className="mypage-menu">
            <li>내 프로필</li>
            <li>보안</li>
            <li>상담내역</li>
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
              <button className="btn">수정</button>
            </div>
            <div className="profile-item">
              <label>사용자 이름</label>
              <div className="value">{profile.name}</div>
              <button className="btn">수정</button>
            </div>
            <div className="profile-item">
              <label>사용자 전화번호</label>
              <div className="value">{profile.phone}</div>
              <button className="btn">수정</button>
            </div>
            <div className="action">
              <button className="btn main">추가하기 및 수정하기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default MyPage;

