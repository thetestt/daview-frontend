import axios from "./axiosInstance";

// 검색어 기반으로 전체 데이터 검색
export const fetchSearchResults = async (query) => {
  try {
    const response = await axios.get("/api/search", {
      params: { query },
    });
    return response.data; // nursinghomes, silvertowns, caregivers 포함
  } catch (error) {
    console.error("❌ 검색 API 오류:", error);
    throw error;
  }
};

//서치 박스에서 지역을 선택하면 시구군을 바꿔주는 API
export const getCityListByRegion = async (regionId) => {
  const response = await axios.get(`/api/region/${regionId}/cities`);
  return response.data;
};

//지역 가져오는 API
export const getRegionList = async () => {
  const response = await axios.get("/api/region");
  return response.data;
};
