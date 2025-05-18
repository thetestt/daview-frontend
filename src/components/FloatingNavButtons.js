import React from "react";
import { useNavigate } from "react-router-dom";
import "./FloatingNavButtons.css";

function FloatingNavButtons({ backTo = "/" }) {
  const navigate = useNavigate();

  return (
    <div className="floating-nav-container">
      <button onClick={() => navigate(backTo)} className="fnav-button">
        ⬅ 목록으로
      </button>
      <button onClick={() => navigate("/silvertown")} className="fnav-button">실버타운</button>
      <button onClick={() => navigate("/nursinghome")} className="fnav-button">요양원</button>
      <button onClick={() => navigate("/caregiver")} className="fnav-button">요양사</button>
    </div>
  );
}

export default FloatingNavButtons;