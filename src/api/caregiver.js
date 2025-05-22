import axios from "./axiosInstance";

const API_BASE_URL = "http://localhost:8080/api/caregivers";

export const getCaregivers = async (params) => {
  return axios.get(`${API_BASE_URL}/`, { params }); // 필터 조건 전달 가능
};

export const getCaregiverById = async (id) => {
  return axios.get(`${API_BASE_URL}/${id}`);
};
