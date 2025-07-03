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
        console.log("응답 데이터:", res.data);
        setWishlist(res.data);
      })
      .catch((err) => console.error("위시리스트 불러오기 오류:", err));
  }, [memberId]);

  return (
    <div className={styles["chj-container"]}>
      <div className={styles.pageTitle}>나의 찜 목록</div>
      <div className={styles.tabs}>
        <button
          className={styles["chj-tabButton"]}
          onClick={() => setSelectedType("nursingHomes")}
        >
          요양원
        </button>
        <button
          className={styles["chj-tabButton"]}
          onClick={() => setSelectedType("caregivers")}
        >
          요양사
        </button>
        <button
          className={styles["chj-tabButton"]}
          onClick={() => setSelectedType("silvertowns")}
        >
          실버타운
        </button>
      </div>

      <div className={styles["chj-cardGrid"]}>
        {wishlist[selectedType].map((item) => (
          <div
            key={item.id}
            className={styles["chj-card"]}
            onClick={() => handleCardClick(item.id)}
            style={{ cursor: "pointer" }}
          >
            <div className={styles["chj-cardTitle"]}>{item.name}</div>
            <div className={styles["chj-cardText"]}>ID: {item.id}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WishlistPage;
