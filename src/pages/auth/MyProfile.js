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
            <h1 className={styles["mypage-title"]}>내 프로필</h1>

            <div className={styles["mypage-right"]}>
                <div className={styles["profile-box"]}>
                    <h2 className={styles["profile-title"]}>내 프로필</h2>
                    <div className={styles["profile-item"]}>
                        <label>사용자 아이디</label>
                        <div className={styles["value"]}>{profile.username}</div>
                        <button className={styles["mod-btn"]}>수정</button>
                    </div>
                    <div className={styles["profile-item"]}>
                        <label>사용자 이름</label>
                        <div className={styles["value"]}>{profile.name}</div>
                        <button className={styles["mod-btn"]}>수정</button>
                    </div>
                    <div className={styles["profile-item"]}>
                        <label>사용자 전화번호</label>
                        <div className={styles["value"]}>{profile.phone}</div>
                        <button className={styles["mod-btn"]}>수정</button>
                    </div>
                    <div className={styles["profile-item"]}>
                        <label>탈퇴하기</label>
                        <button className={styles["mod-btn"]}>탈퇴하기</button>
                    </div>
                </div>
                <br />
                <br />
            </div>
        </div>
    );
};

export default MyProfile;
