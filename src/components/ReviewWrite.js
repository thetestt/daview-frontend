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
    revStars: 3,
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createReview(review);
      alert("후기가 작성되었습니다.");
    } catch (error) {
      console.error("후기 작성 실패: ", error);
      alert("후기 작성 실패");
    }
  };

  return (
    <div className={styles["rev-write-container"]}>
      <h2>후기 작성</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>상품명</label>
          <select name="prodNm" value={review.prodNm} onChange={handleChange}>
            {prodNmList.map((name, idx) => (
              <option key={idx} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>제목</label>
          <input
            type="text"
            name="revTtl"
            placeholder="제목을 입력하세요"
            value={review.revTtl}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>내용</label>
          <textarea
            name="revCont"
            placeholder="내용을 입력하세요"
            value={review.revCont}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>별점</label>
          <input
            type="number"
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
          <button type="submit">후기 작성</button>
        </div>
      </form>
    </div>
  );
}

export default ReviewWrite;
