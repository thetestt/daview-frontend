import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createReview } from "../api/reviewApi";

function ReviewWrite() {
  const [review, setReview] = useState({
    memberId: 1,
    prodNm: "",
    revTtl: "",
    revCont: "",
    revStars: 3,
  });
  const navigate = useNavigate();
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
    <div
      style={{
        maxWidth: "500px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid",
        textAlign: "center",
      }}
    >
      <h2>후기 작성</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label style={{ width: "50px" }}>상품명</label>
          <input
            type="text"
            name="prodNm"
            placeholder="상품명을 입력하세요"
            value={review.prodNm}
            onChange={handleChange}
            style={{ flex: "1", padding: "10px", fontSize: "16px" }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label style={{ width: "50px" }}>제목</label>
          <input
            type="text"
            name="revTtl"
            placeholder="제목을 입력하세요"
            value={review.revTtl}
            onChange={handleChange}
            style={{ flex: "1", padding: "10px", fontSize: "16px" }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label style={{ width: "50px" }}>내용</label>
          <textarea
            name="revCont"
            placeholder="내용을 입력하세요"
            value={review.revCont}
            onChange={handleChange}
            style={{
              flex: "1",
              padding: "10px",
              fontSize: "16px",
              height: "120px",
              resize: "none",
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label style={{ width: "50px" }}>별점</label>
          <input
            type="number"
            name="revStars"
            placeholder="1~5 사이의 별점을 입력하세요"
            value={review.revStars}
            onChange={handleChange}
            min="1"
            max="5"
            style={{ flex: "1", padding: "10px", fontSize: "16px" }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            type="button"
            onClick={() => navigate("/review-board")}
            style={{ padding: "10px", fontSize: "16px", cursor: "pointer" }}
          >
            이전
          </button>
          <button
            type="submit"
            style={{ padding: "10px", fontSize: "16px", cursor: "pointer" }}
          >
            후기 작성
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReviewWrite;
