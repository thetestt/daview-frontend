import React, { useState, useEffect } from "react";
import { getAllReviews } from "../api/reviewApi";
import styles from "../styles/components/ReviewSection.module.css";

function ReviewSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [review, setReview] = useState([]);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const reviews = await getAllReviews();

        const fiveStarReviews = reviews.filter(
          (review) => review.revStars === 5
        );

        const formattedReviews = fiveStarReviews.map((review) => ({
          name: `고객${review.memberId}`,
          role: "이용고객",
          content: review.revCont,
          rating: review.revStars,
          facility: review.prodNm || "요양시설",
        }));

        const limitedReviews = formattedReviews.slice(0, 3);
        console.log("최종 표시할 후기들:", limitedReviews);

        setReview(limitedReviews);
      } catch (error) {
        console.error("후기 데이터 가져오기 실패:", error);
        setReview([]);
      }
    };

    fetchReview();
  }, []);

  const nextReview = () => {
    if (review.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % review.length);
    }
  };

  const prevReview = () => {
    if (review.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + review.length) % review.length);
    }
  };

  if (review.length === 0) {
    return (
      <section className={styles.revSection}>
        <div className={styles.revSecContainer}>
          <div className={styles.revSecSectionHeader}>
            <h2 className={styles.revSecSectionTitle}>고객들의 생생한 후기</h2>
            <p className={styles.revSecSectionSubtitle}>
              실제 이용 고객들의 솔직한 경험담을 들어보세요
            </p>
          </div>
          <div className={styles.revSecNoReviews}>
            <p>아직 후기가 없습니다.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.revSection}>
      <div className={styles.revSecContainer}>
        <div className={styles.revSecSectionHeader}>
          <h2 className={styles.revSecSectionTitle}>고객들의 생생한 후기</h2>
          <p className={styles.revSecSectionSubtitle}>
            실제 이용 고객들의 솔직한 경험담을 들어보세요
          </p>
        </div>

        <div className={styles.revSecCardContainer}>
          <button className={styles.revSecNavButton} onClick={prevReview}>
            ‹
          </button>

          <div className={styles.revSecCard}>
            <div className={styles.revSecContent}>
              <p className={styles.revSecText}>
                {review[currentIndex].content}
              </p>
              <div className={styles.revSecAuthor}>
                <div className={styles.revSecAuthorInfo}>
                  <h4 className={styles.revSecAuthorName}>
                    {review[currentIndex].name}
                  </h4>
                  <p className={styles.revSecAuthorRole}>
                    {review[currentIndex].role}
                  </p>
                  <p className={styles.revSecFacilityName}>
                    {review[currentIndex].facility}
                  </p>
                </div>
                <div className={styles.revSecRating}>
                  {[...Array(review[currentIndex].rating)].map((_, i) => (
                    <span key={i} className={styles.revSecStar}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button className={styles.revSecNavButton} onClick={nextReview}>
            ›
          </button>
        </div>

        <div className={styles.revSecIndicators}>
          {review.map((_, index) => (
            <button
              key={index}
              className={`${styles.revSecIndicator} ${
                index === currentIndex ? styles.revSecActive : ""
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ReviewSection;
