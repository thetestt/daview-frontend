import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createReview } from "../api/reviewApi";
import { getProdNmList } from "../api/paymentApi";
import styles from "../styles/components/ReviewWrite.module.css";

function ReviewWrite() {
  const navigate = useNavigate();
  const memberId = localStorage.getItem("memberId");
  const [prodNmList, setProdNmList] = useState([]);
  const [review, setReview] = useState({
    memberId,
    prodNm: "",
    revTtl: "",
    revCont: "",
    revStars: 5,
  });
  const [hover, setHover] = useState(0);

  useEffect(() => {
    const fetchProdNm = async () => {
      try {
        const prodList = await getProdNmList(review.memberId);
        setProdNmList(prodList);
        if (prodList.length > 0) {
          setReview((prev) => ({ ...prev, prodNm: prodList[0] }));
        }
      } catch (error) {
        console.error("상품명 불러오기 실패: ", error);
      }
    };
    fetchProdNm();
  }, [review.memberId]);

  const handleChange = (e) => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  const handleStarClick = (star) => {
    setReview({ ...review, revStars: star });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createReview(review);
      alert("후기가 작성되었습니다.");
      navigate("/review-board");
    } catch (error) {
      console.error("후기 작성 실패: ", error);
      alert("후기 작성 실패");
    }
  };

  return (
    <div className={styles["review-container"]}>
      <div className={styles["review-title"]}>후기 작성</div>
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
                style={{
                  marginTop: "10px",
                  height: "40px",
                  borderRadius: "10px",
                  paddingLeft: "17px",
                }}
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
            <label className={styles["review-label"]}>
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
          <div className={styles["review-row"]}>
            <label className={styles["review-label"]}>
              후기 내용 <span className={styles["review-required"]}>*</span>
            </label>
            <textarea
              className={styles["review-textarea"]}
              name="revCont"
              placeholder="후기를 입력하세요"
              value={review.revCont}
              onChange={handleChange}
              rows="8"
            />
          </div>
          <div className={styles["review-button-row"]}>
            <button
              className={styles["review-btn-back"]}
              type="button"
              onClick={() => navigate("/review-board")}
            >
              이전
            </button>
            <button className={styles["review-btn-submit"]} type="submit">
              후기 작성
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReviewWrite;
