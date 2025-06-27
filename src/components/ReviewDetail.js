import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getReviewById } from "../api/reviewApi";
import styles from "../styles/components/ReviewDetail.module.css";

function ReviewDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromEdit = location.state?.fromEdit;
  const editedReview = location.state?.editedReview;
  const { revId } = useParams();
  const [review, setReview] = useState(editedReview || null);
  const memberId = localStorage.getItem("memberId");

  useEffect(() => {
    if (!revId || fromEdit) return;

    const fetchReview = async () => {
      try {
        const data = await getReviewById(revId);
        setReview(data);
      } catch (error) {
        console.error("리뷰 조회 실패: ", error);
      }
    };
    fetchReview();
  }, [revId, fromEdit]);

  const handleUpdateClick = () => {
    if (!memberId) {
      alert("로그인 후 이용해주세요.");
      navigate(`/login`);
    } else {
      navigate(`/review/${revId}/update`);
    }
  };

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
        <button type="submit" onClick={handleUpdateClick}>
          후기 수정
        </button>
      </div>
    </div>
  );
}

export default ReviewDetail;
