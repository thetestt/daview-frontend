import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getReviewByIdForEdit, updateReview } from "../api/reviewApi";
import styles from "../styles/components/ReviewUpdate.module.css";

function ReviewUpdate() {
  const navigate = useNavigate();
  const { revId } = useParams();
  const [review, setReview] = useState(null);

  useEffect(() => {
    if (!revId) return;

    const fetchReview = async () => {
      try {
        const data = await getReviewByIdForEdit(revId);
        setReview(data);
      } catch (error) {
        console.error("후기 조회 실패: ", error);
      }
    };
    fetchReview();
  }, [revId]);

  const handleChange = (e) => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateReview(revId, review);
      alert("후기 수정 완료");
      navigate(`/review/${revId}`, {
        state: { fromEdit: true, editedReview: review },
      });
    } catch (error) {
      console.error("후기 수정 실패: ", error);
      alert("후기 수정 실패");
    }
  };

  if (!review) return <p>리뷰를 불러오는 중...</p>;

  return (
    <div className={styles["rev-update-container"]}>
      <h2>후기 수정</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>상품명</label>
          <input
            type="type"
            name="prodNm"
            placeholder="상품명을 입력하세요"
            value={review.prodNm}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>제목</label>
          <input
            type="text"
            name="revTtl"
            placeholder="후기 제목을 입력하세요"
            value={review.revTtl}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>내용</label>
          <textarea
            name="revCont"
            placeholder="후기 내용을 입력하세요"
            value={review.revCont}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>별점</label>
          <input
            type="text"
            name="revStars"
            placeholder="1~5 사이의 별점을 입력하세요"
            value={review.revStars}
            onChange={handleChange}
            min="1"
            max="5"
          />
        </div>
        <div>
          <button type="button" onClick={() => navigate("/review-board")}>
            이전
          </button>
          <button type="submit">후기 수정</button>
        </div>
      </form>
    </div>
  );
}

export default ReviewUpdate;
