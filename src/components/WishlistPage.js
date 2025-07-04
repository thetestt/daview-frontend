import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import styles from "../styles/components/WishlistPage.module.css";
import { useNavigate } from "react-router-dom";

function WishlistPage() {
  const memberId = localStorage.getItem("memberId");
  const [wishlist, setWishlist] = useState({
    nursingHomes: [],
    caregivers: [],
    silvertowns: [],
  });
  const [selectedType, setSelectedType] = useState("nursingHomes");
  const navigate = useNavigate();

  const handleCardClick = (id) => {
    if (selectedType === "nursingHomes") {
      navigate(`/nursinghome/${id}`);
    } else if (selectedType === "caregivers") {
      navigate(`/caregiver/${id}`);
    } else if (selectedType === "silvertowns") {
      navigate(`/silvertown/${id}`);
    }
  };

  useEffect(() => {
    if (!memberId) return;

    axios
      .get(`/api/wishlist/list/${memberId}`)
      .then((res) => {
        setWishlist(res.data);
      })
      .catch((err) => console.error("위시리스트 불러오기 오류:", err));
  }, [memberId]);

  const renderCards = (items) => {
    if (!items || items.length === 0) {
      return <p className={styles.empty}>찜한 항목이 없습니다.</p>;
    }
    return (
      <>
        {items.map((item, index) => (
          <div
            key={index}
            className={styles.card}
            onClick={() => handleCardClick(item.id)}
          >
            <h3>{item.name}</h3>
            <p>{item.address}</p>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>나의 찜 목록</h1>
      <div className={styles.tabWrapper}>
        <div className={styles.tabs}>
          <button
            className={`${styles.chjTabButton} ${selectedType === "nursingHomes" ? styles.selected : ""}`}
            onClick={() => setSelectedType("nursingHomes")}
          >
            요양원
          </button>
          <button
            className={`${styles.chjTabButton} ${selectedType === "caregivers" ? styles.selected : ""}`}
            onClick={() => setSelectedType("caregivers")}
          >
            요양사
          </button>
          <button
            className={`${styles.chjTabButton} ${selectedType === "silvertowns" ? styles.selected : ""}`}
            onClick={() => setSelectedType("silvertowns")}
          >
            실버타운
          </button>
        </div>
        <div className={styles.cardBox}>
          <div className={styles.chjCardGrid}>
            {selectedType === "nursingHomes" && renderCards(wishlist.nursingHomes)}
            {selectedType === "caregivers" && renderCards(wishlist.caregivers)}
            {selectedType === "silvertowns" && renderCards(wishlist.silvertowns)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WishlistPage;
