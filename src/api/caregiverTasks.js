import axiosInstance from './axiosInstance';

// 일정 목록 조회 (페이징)
export const getTasks = async (page = 0, size = 10) => {
  try {
    const response = await axiosInstance.get('/api/caregiver/tasks', {
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 특정 날짜의 일정 목록 조회
export const getTasksByDate = async (date) => {
  try {
    const response = await axiosInstance.get(`/api/caregiver/tasks/date/${date}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 일정 상세 조회
export const getTaskById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/caregiver/tasks/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 일정 생성
export const createTask = async (taskData) => {
  try {
    const response = await axiosInstance.post('/api/caregiver/tasks', taskData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 일정 수정
export const updateTask = async (id, taskData) => {
  try {
    const response = await axiosInstance.put(`/api/caregiver/tasks/${id}`, taskData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 일정 삭제
export const deleteTask = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/caregiver/tasks/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 일정 완료 상태 토글
export const toggleTaskCompletion = async (id, completed) => {
  try {
    const response = await axiosInstance.patch(`/api/caregiver/tasks/${id}/completion`, { completed });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 오늘의 일정 목록 조회
export const getTodayTasks = async () => {
  try {
    const response = await axiosInstance.get('/api/caregiver/tasks/today');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 이번 주 일정 목록 조회
export const getWeeklyTasks = async () => {
  try {
    const response = await axiosInstance.get('/api/caregiver/tasks/weekly');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 특정 기간의 일정 목록 조회
export const getTasksByDateRange = async (startDate, endDate) => {
  try {
    const response = await axiosInstance.get('/api/caregiver/tasks/range', {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 최근 일정 목록 조회 (대시보드용)
export const getRecentTasks = async (limit = 5) => {
  try {
    const response = await axiosInstance.get('/api/caregiver/tasks/recent', {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 통계 정보 조회
export const getTaskStats = async () => {
  try {
    const response = await axiosInstance.get('/api/caregiver/tasks/stats');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 