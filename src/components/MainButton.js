import React from "react";
import mainButtonData from "../data/MainButtonImages";
import styles from "../styles/components/MainButton.module.css";
import { Link } from "react-router";

function MainButton() {
  return (
    <section className={styles.mainButtonSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>어떤 서비스를 찾고 계신가요?</h2>
          <p className={styles.sectionSubtitle}>
            전문적이고 신뢰할 수 있는 요양 서비스를 선택하세요
          </p>
        </div>

        <div className={styles.mainButtonContainer}>
          {mainButtonData.map((item) => (
            <Link key={item.id} to={item.url} className={styles.buttonCard}>
              <div className={styles.circleImageContainer}>
                <img
                  src={item.image}
                  alt={item.alt}
                  className={styles.circleImage}
                />
                <div className={styles.imageOverlay}>
                  <div className={styles.overlayText}>자세히 보기</div>
                </div>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{item.alt}</h3>
                <p className={styles.cardDescription}>
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
