import axios from "./axiosInstance";

const API_BASE_URL = "http://localhost:8080/api/caregivers";

export const getCaregivers = async (params) => {
  return axios.get(`${API_BASE_URL}/`, { params }); // 필터 조건 전달 가능
};

export const getCaregiverById = async (id) => {
  return axios.get(`${API_BASE_URL}/${id}`);
};

//필터검색
export const fetchFilteredCaregivers = async (filters) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/search`, filters);
    return response.data;
  } catch (error) {
    console.error("❌ 요양사 필터 검색 오류:", error);
    throw error;
  }
};
