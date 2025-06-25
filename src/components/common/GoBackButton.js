import React from "react";
import { useNavigate } from "react-router-dom";

const GoBackButton = ({ className }) => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(-1)} className={className}>
      ← 뒤로가기
    </button>
  );
};

export default GoBackButton;
