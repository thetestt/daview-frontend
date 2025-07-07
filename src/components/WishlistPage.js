import React, { useEffect, useState } from "react"; 
import axios from "../api/axiosInstance";
import styles from "../styles/components/WishlistPage.module.css";
import { useNavigate, Link } from "react-router-dom";
import maleImage from "../assets/male.png";
import femaleImage from "../assets/female.png";
import defaultImage from "../assets/user.png";


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
      .then((res) => {
        console.log("🔥 전체 위시리스트 응답:", res.data); // ✅ 1
        setWishlist({
          nursingHomes: Array.isArray(res.data?.nursingHomes) ? res.data.nursingHomes : [],
          caregivers: Array.isArray(res.data?.caregivers) ? res.data.caregivers : [],
          silvertowns: Array.isArray(res.data?.silvertowns) ? res.data.silvertowns : [],
        });
      })
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
    console.log("🔥 items:", items); // ✅ 2

    return (
      <div className={styles["sh-card-box"]}>
        {(!Array.isArray(items) || items.length === 0) ? (
          <p className={styles["sh-empty"]}>찜한 항목이 없습니다.</p>
        ) : (
          <div className={styles["sh-card-grid"]}>
            {items
              .filter((item) => item && Object.keys(item).length > 0)
              .map((item, index) => {
                const isCaregiver = selectedType === "caregivers";
                const id = item.facilityId || item.caregiverId || item.id;

                const link = isCaregiver
                  ? `/caregiver/${item.caregiverId}`
                  : selectedType === "nursingHomes"
                    ? `/nursinghome/${item.facilityId}`
                    : `/silvertown/${item.facilityId}`;

                console.log("🧩 photoUrl:", item.photoUrl); // ✅ 3

                const imgSrc = isCaregiver
                  ? item.photoUrl
                    ? `http://localhost:8080${item.photoUrl}`
                    : item.userGender === "male"
                      ? maleImage
                      : item.userGender === "female"
                        ? femaleImage
                        : defaultImage
                  : item.photoUrl
                    ? `http://localhost:8080${item.photoUrl}`
                    : "/images/user.png";

                console.log("🖼️ imgSrc:", imgSrc); // ✅ 4

                const name = isCaregiver
                  ? item.name?.length === 2
                    ? item.name[0] + "*"
                    : item.name?.[0] + "*" + item.name?.slice(-1)
                  : item.facilityName || "이름 없음";

                console.log("👤 name:", name); // ✅ 5
                console.log("📌 selectedType:", selectedType); // ✅ 6

                return (
                  <div key={index} className={styles["sh-card"]}>
                    <Link to={link} className={styles["sh-card-link"]}>
                      <div className={styles["sh-card-inner"]}>
                        <img src={imgSrc} alt="썸네일" className={styles["sh-card-image"]} />
                        <h3 className={styles["sh-card-name"]}>{name}</h3>
                        <p className={styles["sh-card-address"]}>
                          {isCaregiver
                            ? `${item.hopeWorkAreaLocation || ""} ${item.hopeWorkAreaCity || ""}`
                            : `${item.facilityAddressLocation || ""} ${item.facilityAddressCity || ""}`}
                        </p>
                        {isCaregiver ? (
                          <div className={styles["sh-card-info-box"]}>
                            <p className={styles["sh-card-info"]}>근무형태: {item.hopeWorkType || "정보 없음"}</p>
                            <p className={styles["sh-card-info"]}>
                              자격증: {Array.isArray(item.certificates) ? item.certificates.join(", ") : "없음"}
                            </p>
                            <p className={styles["sh-card-info"]}>
                              경력: {Array.isArray(item.career) ? item.career.length : 0}건
                            </p>
                          </div>
                        ) : (
                          <p className={styles["sh-card-price"]}>
                            {item.facilityCharge
                              ? `${item.facilityCharge.toLocaleString()}원/월`
                              : "가격 정보 없음"}
                          </p>
                        )}
                      </div>
                    </Link>
                  </div>
                );
              })}
          </div>
        )}
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
