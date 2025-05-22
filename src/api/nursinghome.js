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
