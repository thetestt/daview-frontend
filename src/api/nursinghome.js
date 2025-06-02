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

// export const getNursingHomeFilterOptions = async (category) => {
//   try {
//     const response = await axios.get(
//       `/api/searchfilter/nursinghome?category=${category}`
//     );
//     return response.data;
//   } catch (error) {
//     console.error("요양원 필터 옵션 불러오기 오류:", error);
//     return [];
//   }
// };
