import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/components/CallSection.module.css";

function CallSection() {
  return (
    <section className={styles.callSecSection}>
      <div className={styles.callSecContainer}>
        <div className={styles.callSecContent}>
          <h2 className={styles.callSecTitle}>지금 바로 시작하세요</h2>
          <p className={styles.callSecSubtitle}>
            가족의 안전과 편안함을 위한 최적의 요양시설을 찾아보세요
          </p>
          <div className={styles.callSecButtons}>
            <Link to="/nursinghome" className={styles.callSecPrimaryCall}>
              요양시설 찾기
            </Link>
            <Link to="/caregiver" className={styles.callSecSecondaryCall}>
              요양사 매칭
            </Link>
          </div>
          <div className={styles.callSecFeatures}>
            <div className={styles.callSecFeature}>
              <span className={styles.callSecFeatureIcon}>✓</span>
              <span>무료 상담</span>
            </div>
            <div className={styles.callSecFeature}>
              <span className={styles.callSecFeatureIcon}>✓</span>
              <span>24시간 지원</span>
            </div>
            <div className={styles.callSecFeature}>
              <span className={styles.callSecFeatureIcon}>✓</span>
              <span>전문 상담사</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CallSection;
