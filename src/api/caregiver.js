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

// 요양사 개인 프로필 관리 API
export const getCaregiverProfile = async () => {
  try {
    const response = await axios.get('/api/caregiver/my-profile');
    return response.data;
  } catch (error) {
    console.error("❌ 요양사 프로필 조회 오류:", error);
    throw error;
  }
};

export const updateCaregiverProfile = async (profileData) => {
  try {
    const response = await axios.put('/api/caregiver/my-profile', profileData);
    return response.data;
  } catch (error) {
    console.error("❌ 요양사 프로필 수정 오류:", error);
    throw error;
  }
};
