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

// export const getSilvertownFilterOptions = async (category) => {
//   try {
//     const response = await axios.get(
//       `/api/options?category=${encodeURIComponent(category)}`
//     );
//     return response.data;
//   } catch (error) {
//     console.error("필터 옵션 불러오기 실패:", error);
//     return [];
//   }
// };
