import axios from "./axiosInstance";

// 요양원 프로필 조회
export const fetchFacilityProfile = () => {
  return axios.get("/api/facilities/me");
};

// 요양원 방 목록 조회
export const fetchFacilityRooms = () => {
  return axios.get("/api/facilities/me/rooms");
};

// 요약 대시보드 데이터
export const fetchFacilitySummary = () => {
  return axios.get("/api/facilities/summary");
};

// 최근 활동 로그
export const fetchFacilityLogs = () => {
  return axios.get("/api/facilities/logs");
};

// 특정 방 상세 정보 조회
export const fetchRoomDetail = (roomId) => {
  return axios.get(`/api/facilities/rooms/${roomId}`);
};

// 방 정보 업데이트
export const updateRoom = (roomId, roomData) => {
  return axios.put(`/api/facilities/rooms/${roomId}`, roomData);
};
