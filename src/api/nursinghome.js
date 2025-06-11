import axios from "./axiosInstance";

export async function fetchNursinghome() {
  const response = await fetch(
    "http://localhost:8080/api/facilities/nursinghomes"
  );
  if (!response.ok) {
    throw new Error("데이터 불러오기 실패");
  }
  return await response.json();
}

export const fetchNursinghomeDetail = async (id) => {
  const response = await axios.get(
    `http://localhost:8080/api/facilities/nursinghome/${id}`
  );
  return response.data;
};

export const fetchFilteredNursinghomes = async (filters) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/facilities/nursinghome/search",
      filters
    );
    return response.data;
  } catch (error) {
    console.error("요양원 검색 실패:", error);
    throw error;
  }
};
