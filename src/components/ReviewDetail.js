import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getReviewById } from "../api/reviewApi";
import styles from "../styles/components/ReviewDetail.module.css";

function ReviewDetail() {
  const navigate = useNavigate();
  const { revId } = useParams();
  const [review, setReview] = useState(null);

  useEffect(() => {
    if (!revId) return;

    const fetchReview = async () => {
      try {
        const data = await getReviewById(revId);
        setReview(data);
      } catch (error) {
        console.error("리뷰 조회 실패: ", error);
      }
    };
    fetchReview();
  }, [revId]);

  if (!review) return <p>리뷰를 불러오는 중...</p>;

  return (
    <div className={styles["rev-detail-container"]}>
      <h2>후기 상세</h2>
      <div>
        <p>작성자: {review?.memberId}</p>
        <p>상품명: {review?.prodNm}</p>
        <p>제목: {review?.revTtl}</p>
        <p>별점: {review?.revStars}</p>
        <p>
          작성일:{" "}
          {review ? new Date(review.revRegDate).toLocaleDateString() : "-"}
        </p>
        <p>조회수: {review?.revViews}</p>
        <hr />
        <p>후기 내용: {review?.revCont}</p>
      </div>
      <div>
        <button onClick={() => navigate("/review-board")}>목록으로</button>
        <button>후기 수정</button>
      </div>
    </div>
  );
}

export default ReviewDetail;
