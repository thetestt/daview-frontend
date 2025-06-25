import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllReviews } from "../api/reviewApi";
import styles from "../styles/components/ReviewBoard.module.css";

function ReviewBoard() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getAllReviews();
        setReviews(data);
      } catch (error) {
        console.error("후기 가져오기 실패:", error);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className={styles["review-container"]}>
      <h2>후기 게시판</h2>
      <div className={styles["review-buttonWrapper"]}>
        <button onClick={() => navigate("/review-write")}>후기 작성</button>
      </div>

      <table className={styles["review-table"]}>
        <thead className={styles["review-thead"]}>
          <tr className={styles["review-tr"]}>
            <th className={styles["review-th"]}>번호</th>
            <th className={styles["review-th"]}>제목</th>
            <th className={styles["review-th"]}>작성자</th>
            <th className={styles["review-th"]}>별점</th>
            <th className={styles["review-th"]}>작성일자</th>
            <th className={styles["review-th"]}>조회수</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review, index) => (
            <tr key={review.revId} className={styles["review-tr"]}>
              <td className={styles["review-td"]}>{index + 1}</td>
              <td className={styles["review-td"]}>{review.revTtl}</td>
              <td className={styles["review-td"]}>{review.memberId}</td>
              <td className={styles["review-td"]}>{review.revStars}</td>
              <td className={styles["review-td"]}>
                {new Date(review.revRegDate).toLocaleDateString()}
              </td>
              <td className={styles["review-td"]}>{review.revViews}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReviewBoard;
