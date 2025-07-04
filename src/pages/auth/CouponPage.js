import React, { useState, useEffect } from "react";
import styles from "../../styles/auth/CouponPage.module.css";
import axios from "axios";

function CouponPage() {
  const [tab, setTab] = useState("owned");
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("/coupon/my", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => setCoupons(res.data))
      .catch((err) => console.error("쿠폰 가져오기 실패:", err));
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>내 쿠폰</h1>
      <div className={styles.tabWrapper}>
        <div className={styles.tabs}>
          <button
            onClick={() => setTab("owned")}
            className={`${styles.chjTabButton} ${tab === "owned" ? styles.selected : ""}`}
          >
            보유 쿠폰
          </button>
          <button
            onClick={() => setTab("claim")}
            className={`${styles.chjTabButton} ${tab === "claim" ? styles.selected : ""}`}
          >
            쿠폰 받기
          </button>
        </div>
        <div className={styles.cardBox}>
          {tab === "owned" ? (
            coupons.length > 0 ? (
              coupons.map((coupon, i) => (
                <div key={i} className={styles.card}>
                  {coupon.description} ({coupon.discount}% 할인)
                </div>
              ))
            ) : (
              <p className={styles.empty}>보유한 쿠폰이 없습니다</p>
            )
          ) : (
            <p className={styles.empty}>현재 받을 수 있는 쿠폰이 없습니다</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CouponPage;
