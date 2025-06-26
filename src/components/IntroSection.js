import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/components/IntroSection.module.css";

function IntroSection() {
  return (
    <section className={styles.introSection}>
      <div className={styles.introContent}>
        <div className={styles.introText}>
          <h1 className={styles.introTitle}>
            가족을 위한
            <br />
            <span className={styles.highlight}>
              안전한 요양시설을 찾아보세요
            </span>
          </h1>
          <p className={styles.introSubtitle}>
            전국 1,200개 이상의 인증된 요양시설에서
            <br />
            전문적이고 따뜻한 케어를 제공합니다
          </p>
          <div className={styles.introButtons}>
            <Link to="/nursinghome" className={styles.primaryButton}>
              요양시설 둘러보기
            </Link>
            <Link to="/caregiver" className={styles.secondaryButton}>
              전문 요양사 찾기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default IntroSection;
