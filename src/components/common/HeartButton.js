import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { useNavigate } from "react-router";

function HeartButton({ facilityId, className }) {
  const [isLiked, setIsLiked] = useState(false);
  const memberId = localStorage.getItem("memberId");
  const navigate = useNavigate();

  useEffect(() => {
    if (!memberId) return;

    console.log("💬 CHECK 요청 memberId:", memberId);
    console.log("💬 CHECK 요청 facilityId:", facilityId);

    axios
      .get(`/api/wishlist/check`, {
        params: { memberId, facilityId },
      })
      .then((res) => setIsLiked(res.data))
      .catch(() => setIsLiked(false));
  }, [memberId, facilityId]);

  const toggleHeart = () => {
    if (!memberId) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    const url = isLiked ? "/api/wishlist/remove" : "/api/wishlist/add";

    axios
      .post(url, { memberId, facilityId })
      .then(() => setIsLiked(!isLiked))
      .catch((err) => console.error("찜 오류:", err));
  };

  return (
    <button onClick={toggleHeart} className={`heart-button ${className}`}>
      {isLiked ? "❤️" : "🤍"}
    </button>
  );
}

export default HeartButton;
