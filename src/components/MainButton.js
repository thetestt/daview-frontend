import React, { useState } from "react";
import mainButtonData from "../data/MainButtonImages";
import styles from "../styles/components/MainButton.module.css";
import { Link } from "react-router-dom";

function MainButton() {
  const [loadedImages, setLoadedImages] = useState({});

  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section className={styles.mainBtnSection}>
      <div className={styles.mainBtnContainer}>
        <div className={styles.mainBtnSectionHeader}>
          <h2 className={styles.mainBtnSectionTitle}>
            어떤 서비스를 찾고 계신가요?
          </h2>
          <p className={styles.mainBtnSectionSubtitle}>
            전문적이고 신뢰할 수 있는 요양 서비스를 선택하세요
          </p>
        </div>

        <div className={styles.mainBtnContainer}>
          {mainButtonData.map((item) => (
            <Link key={item.id} to={item.url} className={styles.mainBtnCard}>
              <div className={styles.mainBtnCircleImageContainer}>
                <img
                  src={item.image}
                  alt={item.alt}
                  className={`${styles.mainBtnCircleImage} ${
                    loadedImages[item.id] ? styles.mainBtnLoaded : ""
                  }`}
                  onLoad={() => handleImageLoad(item.id)}
                  loading="lazy"
                />
                <div className={styles.mainBtnImageOverlay}>
                  <div className={styles.mainBtnOverlayText}>자세히 보기</div>
                </div>
              </div>
              <div className={styles.mainBtnCardContent}>
                <h3 className={styles.mainBtnCardTitle}>{item.alt}</h3>
                <p className={styles.mainBtnCardDescription}>
                  {item.id === "caregiver" && "전문 요양사와 1:1 매칭"}
                  {item.id === "nursinghome" && "24시간 전문 케어 시설"}
                  {item.id === "slivertown" && "편안한 노후 생활 공간"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MainButton;
