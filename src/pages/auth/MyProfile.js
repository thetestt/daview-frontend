import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "../../styles/auth/MyProfile.module.css";
import { getPaymentsByMemberId } from "../../api/paymentApi";

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

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        axios.get('/api/mypage/profile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                console.log("프로필 응답", res.data);
                setProfile(res.data);
            })
            .catch((err) => console.error("프로필 가져오기 실패:", err));

    }, []);

    return (
        <div className={styles["mypage-container"]}>
          <h1 className={styles["mypage-title"]}>내 정보</h1>
      
          <div className={styles["mypage-right"]}>
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

            <div className={styles["profile-box"]}>
              <div className={styles["profile-item"]}>
                <label>비밀번호 변경하기</label>
                <Link
                to="/FindPasswordPage/CPw-check"
                state={{ username: profile.username }}
                className={styles["fake-link"]}>&gt;</Link>

              </div>
            </div>
            <br />

            <div className={styles["profile-box"]}>
              <div className={styles["profile-item"]}>
                <label>환불계좌 관리</label> {/* 여기서 이제 dv_users테이블에 계좌정보 추가하는거 추가해야됨 그리고 
                페이지 만들어놓은것도 수정하고 연결해야됨 수*/}
                <Link
                to="/FindPasswordPage/CPw-check" 
                state={{ username: profile.username }}
                className={styles["fake-link"]}>&gt;</Link>

              </div>
            </div>
            <br />

            <div className={styles["profile-box"]}>
              <div className={styles["profile-item"]}>
                <label>마케팅 개인정보 제3자 제공 동의</label> {/* 딸깍이 버튼 만들어야됨*/}
                <Link
                to="/FindPasswordPage/CPw-check" 
                state={{ username: profile.username }}
                className={styles["fake-link"]}>&gt;</Link>

              </div>
            </div>
            <br />

            <div className={styles["profile-box"]}>
              <div className={styles["profile-item"]}>
                <label>로그아웃, 회원탈퇴</label>
                <Link
                to="/FindPasswordPage/CPw-check"
                state={{ username: profile.username }}
                className={styles["fake-link"]}>&gt;</Link>

              </div>
            </div>
            <br />
          </div>
        </div>
      );
      
};

            export default MyProfile;
