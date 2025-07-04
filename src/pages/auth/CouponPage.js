import React, { useState, useEffect } from "react";
import styles from "../../styles/auth/CouponPage.module.css";
import axiosInstance from "../../pages/auth/axiosInstance";

function CouponPage() {
  const [tab, setTab] = useState("owned");
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    axiosInstance.get("/coupon/my")
      .then((res) => setCoupons(res.data))
      .catch((err) => console.error("쿠폰 가져오기 실패:", err));
  }, []);


  return (
    <div className={styles["sh-container"]}>
      <h1 className={styles["sh-title"]}>내 쿠폰</h1>
      <div className={styles["sh-tab-wrapper"]}>
        <div className={styles["sh-tabs"]}>
          <button
            onClick={() => setTab("owned")}
            className={`${styles["sh-tab-button"]} ${tab === "owned" ? styles["sh-selected"] : ""}`}
          >
            보유 쿠폰
          </button>
          <button
            onClick={() => setTab("claim")}
            className={`${styles["sh-tab-button"]} ${tab === "claim" ? styles["sh-selected"] : ""}`}
          >
            쿠폰 받기
          </button>
        </div>
        <div className={styles["sh-card-box"]}>
          {tab === "owned" ? (
            coupons.length > 0 ? (
              coupons.map((coupon, i) => (
                <div key={i} className={styles["sh-card"]}>
                  {coupon.description} ({coupon.discount}% 할인)
                </div>
              ))
            ) : (
              <p className={styles["sh-empty"]}>보유한 쿠폰이 없습니다</p>
            )
          ) : (
            <p className={styles["sh-empty"]}>현재 받을 수 있는 쿠폰이 없습니다</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponPage;
