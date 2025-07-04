import axiosInstance from './axiosInstance';

// 보고서 목록 조회 (페이징)
export const getReports = async (page = 0, size = 10) => {
  try {
    const response = await axiosInstance.get('/api/caregiver/reports', {
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 특정 날짜의 보고서 조회
export const getReportByDate = async (date) => {
  try {
    const response = await axiosInstance.get(`/api/caregiver/reports/date/${date}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 보고서 상세 조회
export const getReportById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/caregiver/reports/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 보고서 생성
export const createReport = async (reportData) => {
  try {
    const response = await axiosInstance.post('/api/caregiver/reports', reportData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 보고서 수정
export const updateReport = async (id, reportData) => {
  try {
    const response = await axiosInstance.put(`/api/caregiver/reports/${id}`, reportData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 보고서 삭제
export const deleteReport = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/caregiver/reports/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 보고서 상태 변경
export const updateReportStatus = async (id, status) => {
  try {
    const response = await axiosInstance.patch(`/api/caregiver/reports/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 최근 보고서 목록 조회 (대시보드용)
export const getRecentReports = async (limit = 5) => {
  try {
    const response = await axiosInstance.get('/api/caregiver/reports/recent', {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 특정 기간의 보고서 목록 조회
export const getReportsByDateRange = async (startDate, endDate) => {
  try {
    const response = await axiosInstance.get('/api/caregiver/reports/range', {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 