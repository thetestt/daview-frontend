import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/components/ReviewBoard.module.css";
import {
  getReviewsWithCommentCount,
  getTotalReviewCount,
} from "../api/reviewApi";

function ReviewBoard() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const reviewsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const memberId = localStorage.getItem("memberId");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviewsWithCommentCount(page, reviewsPerPage);
        setReviews(data);

        const totalResponse = await getTotalReviewCount();
        setTotalPages(Math.ceil(totalResponse / reviewsPerPage));
      } catch (error) {
        console.error("후기 가져오기 실패:", error);
      }
    };
    fetchReviews();
  }, [page]);

  const handleWriteClick = () => {
    if (!memberId) {
      alert("로그인 후 이용해주세요.");
      navigate("/login");
    } else {
      navigate("/review-write");
    }
  };

  const stars = (count) => {
    const filled = "★".repeat(count);
    const empty = "☆".repeat(5 - count);
    return filled + empty;
  };

  return (
    <div className={styles["review-container"]}>
      <h2 className={styles["review-title"]}>후기 게시판</h2>

      <div className={styles["review-buttonWrapper"]}>
        <button className={styles["review-btn"]} onClick={handleWriteClick}>
          후기 작성
        </button>
      </div>

      <table className={styles["review-table"]}>
        <thead className={styles["review-thead"]}>
          <tr className={styles["review-tr"]}>
            <th className={styles["review-th"]}>번호</th>
            <th className={styles["review-th"]}>제목</th>
            <th className={styles["review-th"]}>작성자</th>
            <th className={styles["review-th"]}>별점</th>
            <th className={styles["review-th"]}>조회수</th>
            <th className={styles["review-th"]}>작성일자</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review, index) => (
            <tr key={review.revId} className={styles["review-tr"]}>
              <td className={styles["review-td"]}>
                {(page - 1) * reviewsPerPage + index + 1}
              </td>
              <td className={styles["review-td"]}>
                <button
                  className={styles["review-revttl"]}
                  onClick={() => navigate(`/review/${review.revId}`)}
                >
                  {review.revTtl}
                  <span> ({review.commentCount})</span>
                </button>
              </td>
              <td className={styles["review-td"]}>{review.memberName}</td>
              <td className={styles["review-td"]}>
                <span className={styles["review-stars"]}>
                  {stars(review.revStars)}
                </span>
              </td>
              <td className={styles["review-td"]}>{review.revViews}</td>
              <td className={styles["review-td"]}>
                {new Date(review.revRegDate).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles["review-page"]}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          이전
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={page === i + 1 ? styles.active : ""}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default ReviewBoard;
