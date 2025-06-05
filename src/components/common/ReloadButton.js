import React from "react";
import { useNavigate } from "react-router-dom";

const ReloadButton = () => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    navigate(0); // 현재 URL을 기준으로 새로고침
  };

  return (
    <button onClick={handleRefresh} className="refresh-button">
      🔄 새로고침
    </button>
  );
};

export default ReloadButton;
