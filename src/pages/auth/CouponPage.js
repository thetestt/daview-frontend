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
      <h1 className={styles.title}>쿠폰</h1>

      <div className={styles.tabs}>
        <button onClick={() => setTab("owned")} className={tab === "owned" ? styles.active : ""}>
          보유
        </button>
        <button onClick={() => setTab("claim")} className={tab === "claim" ? styles.active : ""}>
          쿠폰받기
        </button>
      </div>

      <div className={styles.content}>
        {tab === "owned" ? (
          coupons.length > 0 ? (
            coupons.map((coupon, i) => (
              <div key={i} className={styles.card}>
                🎁 {coupon.description} ({coupon.discount}% 할인)
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
  );
}

export default CouponPage;
