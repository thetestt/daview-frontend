import axios from "./axiosInstance";

export const getFilterOptions = async (targetType, category) => {
  try {
    const response = await axios.get(
      `/api/options?targetType=${encodeURIComponent(
        targetType
      )}&category=${encodeURIComponent(category)}`
    );
    return response.data;
  } catch (error) {
    console.error("필터 옵션 불러오기 실패:", error);
    return [];
  }
};

// 지역(시/도) 목록 조회
export const getRegions = async () => {
  try {
    const response = await axios.get('/api/region');
    return response.data;
  } catch (error) {
    console.error('지역 목록 조회 실패:', error);
    throw error;
  }
};

// 특정 지역의 시/군/구 목록 조회
export const getCitiesByRegion = async (regionId) => {
  try {
    const response = await axios.get(`/api/region/${regionId}/cities`);
    return response.data;
  } catch (error) {
    console.error('시/군/구 목록 조회 실패:', error);
    throw error;
  }
};

// 요양사 관련 필터 옵션들을 한 번에 조회
export const getCaregiverFilterOptions = async () => {
  try {
    const [genders, certificates, workTypes, employmentTypes] = await Promise.all([
      getFilterOptions('요양사', '성별'),
      getFilterOptions('요양사', '자격증'),
      getFilterOptions('요양사', '근무형태'),
      getFilterOptions('요양사', '고용형태')
    ]);
    
    return {
      genders,
      certificates,
      workTypes,
      employmentTypes
    };
  } catch (error) {
    console.error('요양사 필터 옵션 조회 실패:', error);
    throw error;
  }
};
