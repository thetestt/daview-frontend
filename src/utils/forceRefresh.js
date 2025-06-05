import { useNavigate } from "react-router-dom";

export const useForceRefresh = () => {
  const navigate = useNavigate();
  return () => {
    navigate(0); // 현재 URL 기준 새로고침
  };
};
