import axios from "./axiosInstance";

// 검색어 기반으로 전체 데이터 검색
export const fetchSearchResults = async (query) => {
  try {
    const response = await axios.get("/api/search", {
      params: { query },
    });
    return response.data; // nursinghomes, silvertowns, caregivers 포함
  } catch (error) {
    console.error("❌ 검색 API 오류:", error);
    throw error;
  }
};
