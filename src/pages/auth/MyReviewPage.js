import React, { useEffect, useState } from "react";
import axiosInstance from "../../pages/auth/axiosInstance";
import styles from "../../styles/auth/MyReviewPage.module.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";


function MyReviewPage() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axiosInstance.get("/review/my");
        console.log("내 리뷰:", response.data);
        setReviews(response.data);
      } catch (err) {
        console.error("후기 불러오기 실패:", err);
      }
    };

    fetchReviews();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }} className={styles["sh-container"]}>
      <h1 className={styles["sh-title"]}>내가 쓴 후기</h1>
      {reviews.length === 0 ? (
        <p className={styles["sh-no-review"]}>작성한 후기가 없습니다.</p>
      ) : (
        reviews.map((review) => (
          <Link
            to={`/review/${review.revId}`}
            key={review.revId}
            className={styles["sh-review-link"]}
          >
            <div className={styles["sh-review-box"]}>
              <div className={styles["sh-review-header"]}>
                <div className={styles["sh-review-title-rating"]}>
                  <div className={styles["sh-review-title"]}>{review.revTtl}</div>
                  <div className={styles["sh-review-rating"]}>
                  {Array.from({ length: review.revStars }).map((_, i) => <span key={i}>⭐</span>)}
                  </div>
                </div>
              </div>

              <div className={styles["sh-review-content"]}>
                {review.revCont ? review.revCont : "(내용 없음)"}
              </div>

              <div className={styles["sh-review-date"]}>
                {new Date(review.revRegDate).toLocaleDateString("ko-KR")}
              </div>
            </div>

          </Link>
        ))
      )}
    </motion.div>
  );
}

export default MyReviewPage;
