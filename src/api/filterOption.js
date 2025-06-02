import axios from "./axiosInstance";

export const getFilterOptions = async (targetType, category) => {
  try {
    const response = await axios.get(
      `/api/options?targetType=${encodeURIComponent(
        targetType
      )}&category=${encodeURIComponent(category)}`
    );
    return response.data;
  } catch (error) {
    console.error("필터 옵션 불러오기 실패:", error);
    return [];
  }
};
