import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import styles from "../styles/components/WishlistPage.module.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


function WishlistPage() {
  const memberId = localStorage.getItem("memberId");
  const [wishlist, setWishlist] = useState({
    nursingHomes: [],
    caregivers: [],
    silvertowns: [],
  });
  const [selectedType, setSelectedType] = useState("nursingHomes");
  const navigate = useNavigate();

  useEffect(() => {
    if (!memberId) return;
    axios
      .get(`/api/wishlist/list/${memberId}`)
      .then((res) => setWishlist(res.data))
      .catch((err) => console.error("위시리스트 불러오기 오류:", err));
  }, [memberId]);

  const handleCardClick = (id) => {
    const base =
      selectedType === "nursingHomes"
        ? "nursinghome"
        : selectedType === "caregivers"
        ? "caregiver"
        : "silvertown";
    navigate(`/${base}/${id}`);
  };

  const renderCards = (items) => {
    if (!items || items.length === 0) {
      return <p className={styles["sh-empty"]}>찜한 항목이 없습니다.</p>;
    }

    return (
      <div className={styles["sh-card-box"]}>
        <div className={styles["sh-card-grid"]}>
          {items.map((item, index) => {
            const isCaregiver = selectedType === "caregivers";
            const name = isCaregiver && item.name
              ? item.name.length === 2
                ? item.name[0] + "*"
                : item.name[0] + "*" + item.name.slice(-1)
              : item.name || item.facilityName || item.title || "이름 없음";

            const subText = isCaregiver
              ? `희망지역: ${item.hopeWorkAreaLocation || "정보 없음"}\n` +
                `근무형태: ${item.hopeWorkType || "정보 없음"}\n` +
                `자격증: ${item.certificates?.join(", ") || "없음"}\n` +
                `경력: ${item.career?.length || 0}건`
              : `주소: ${item.facilityAddressLocation || item.address || "정보 없음"}\n` +
                `가격: ${item.facilityCharge ? item.facilityCharge.toLocaleString() + "원/월" : "가격 정보 없음"}`;

            const imageSrc = isCaregiver
              ? item.userGender === "female"
                ? "/images/female.png"
                : item.userGender === "male"
                ? "/images/male.png"
                : "/images/user.png"
              : item.photoUrl
              ? `http://localhost:8080${item.photoUrl}`
              : "/images/default.png";

            return (
              <div
                key={index}
                className={styles["sh-card"]}
                onClick={() => handleCardClick(item.id)}
              >
                <img
                  src={imageSrc}
                  alt={name}
                  className={styles["sh-card-image"]}
                />
                <div className={styles["sh-card-info"]}>
                  <h3 className={styles["sh-card-title"]}>{name}</h3>
                  <p className={styles["sh-card-sub"]}>{subText}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={styles["sh-container"]}>
      <h1 className={styles["sh-title"]}>나의 찜 목록</h1>
      <div className={styles["sh-tab-wrapper"]}>
        <div className={styles["sh-tabs"]}>
          <button
            className={`${styles["sh-tab-button"]} ${selectedType === "nursingHomes" ? styles["sh-selected"] : ""}`}
            onClick={() => setSelectedType("nursingHomes")}
          >
            요양원
          </button>
          <button
            className={`${styles["sh-tab-button"]} ${selectedType === "caregivers" ? styles["sh-selected"] : ""}`}
            onClick={() => setSelectedType("caregivers")}
          >
            요양사
          </button>
          <button
            className={`${styles["sh-tab-button"]} ${selectedType === "silvertowns" ? styles["sh-selected"] : ""}`}
            onClick={() => setSelectedType("silvertowns")}
          >
            실버타운
          </button>
        </div>
        {selectedType === "nursingHomes" && renderCards(wishlist.nursingHomes)}
        {selectedType === "caregivers" && renderCards(wishlist.caregivers)}
        {selectedType === "silvertowns" && renderCards(wishlist.silvertowns)}
      </div>
    </div>
  );
}

export default WishlistPage;
