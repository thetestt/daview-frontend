import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllReviews } from "../api/reviewApi";

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
    <div
      style={{ maxWidth: "800px", margin: "50px auto", textAlign: "center" }}
    >
      <h2>후기 게시판</h2>
      <div style={{ textAlign: "right" }}>
        <button onClick={() => navigate("/review-write")}>후기 작성</button>
      </div>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #ddd",
        }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>번호</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>제목</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>
              작성자
            </th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>별점</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>
              작성일자
            </th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>
              조회수
            </th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review, index) => (
            <tr key={review.revId} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {index + 1}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {review.revTtl}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {review.memberId}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {review.revStars}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {new Date(review.revRegDate).toLocaleDateString()}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {review.revViews}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReviewBoard;
