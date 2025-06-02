import axios from "./axiosInstance";

export async function fetchSilvertowns() {
  const response = await fetch(
    "http://localhost:8080/api/facilities/silvertowns"
  );
  if (!response.ok) {
    throw new Error("데이터 불러오기 실패");
  }
  return await response.json();
}

export const fetchSilvertownDetail = async (id) => {
  const response = await axios.get(
    `http://localhost:8080/api/facilities/silvertown/${id}`
  );
  return response.data;
};

export const fetchFilteredSilvertowns = async (filters) => {
  try {
    const response = await axios.post(
      "/api/facilities/silvertown/search",
      filters
    );
    return response.data;
  } catch (error) {
    console.error("실버타운 필터 검색 실패:", error);
    return [];
  }
};
