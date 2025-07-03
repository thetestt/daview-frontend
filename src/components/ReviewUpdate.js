import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getReviewByIdForEdit, updateReview } from "../api/reviewApi";
import { getProdNmList } from "../api/paymentApi";
import styles from "../styles/components/ReviewUpdate.module.css";

function ReviewModifyTest() {
  const navigate = useNavigate();
  const { revId } = useParams();
  const [review, setReview] = useState(null);
  const [prodNmList, setProdNmList] = useState([]);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    if (!revId) return;
    const fetchReview = async () => {
      try {
        const reviewData = await getReviewByIdForEdit(revId);
        setReview(reviewData);
        const prodList = await getProdNmList(reviewData.memberId);
        setProdNmList(prodList);
      } catch (error) {
        console.error("후기 조회 실패: ", error);
      }
    };
    fetchReview();
  }, [revId]);

  const handleChange = (e) => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  const handleStarClick = (star) => {
    setReview({ ...review, revStars: star });
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
    <div className={styles["review-container"]}>
      <div className={styles["review-title"]}>후기 수정</div>
      <div className={styles["review-box"]}>
        <div className={styles["review-notice"]}>
          *** 따뜻하고 매너있는 후기를 부탁 드립니다. 감사합니다 🙂 ***
        </div>
        <form className={styles["review-write-box"]} onSubmit={handleSubmit}>
          <div className={styles["review-form-row"]}>
            <div className={styles["review-title-row"]}>
              <label className={styles["review-title-label"]}>
                상품명 <span className={styles["review-required"]}>*</span>
              </label>
              <select
                className={styles["review-prodnm-input"]}
                name="prodNm"
                value={review.prodNm}
                onChange={handleChange}
              >
                {prodNmList.map((name, idx) => (
                  <option key={idx} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles["review-stars-row"]}>
              <label className={styles["review-rating-label"]}>
                별점 <span className={styles["review-required"]}>*</span>
              </label>
              <div className={styles["review-star-container"]}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`${styles["review-star"]} ${
                      star <= (hover || review.revStars)
                        ? styles["review-filled"]
                        : styles["review-empty"]
                    }`}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className={styles["review-row"]}>
            <label
              className={styles["review-title-label"]}
              style={{ marginTop: "20px" }}
            >
              제목 <span className={styles["review-required"]}>*</span>
            </label>
            <input
              className={styles["review-prodttl-input"]}
              type="text"
              name="revTtl"
              placeholder="제목을 입력해주세요"
              value={review.revTtl}
              onChange={handleChange}
            />
          </div>
          <div className={styles["review-content-row"]}>
            <label className={styles["review-label"]}>
              후기 내용 <span className={styles["review-required"]}>*</span>
            </label>
            <textarea
              className={styles["review-textarea"]}
              name="revCont"
              rows="8"
              placeholder="후기를 입력하세요"
              value={review.revCont}
              onChange={handleChange}
            />
          </div>
          <div className={styles["review-button-row"]}>
            <button
              className={styles["review-btn-back"]}
              type="button"
              onClick={() => navigate("/review-board")}
            >
              취소
            </button>
            <button className={styles["review-btn-submit"]} type="submit">
              수정
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReviewModifyTest;
