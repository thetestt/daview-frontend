import axios from "axios";

export const fetchNoticesByFacilityId = async (facilityId) => {
  const res = await axios.get(`/api/notices/${facilityId}`);
  return res.data;
};
