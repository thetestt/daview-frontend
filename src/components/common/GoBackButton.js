import React from "react";
import { useNavigate } from "react-router-dom";

const GoBackButton = ({ label = "⬅ 뒤로가기" }) => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(-1)} className="fnav-button">
      {label}
    </button>
  );
};

export default GoBackButton;
