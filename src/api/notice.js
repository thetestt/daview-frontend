import axios from "axios";

export const fetchNoticesByFacilityId = async (facilityId) => {
  const res = await axios.get(`/api/notices/${facilityId}`);
  return res.data;
};

export const fetchNoticesByNoticeId = async (facilityId, noticeId) => {
  const res = await axios.get(`/api/notices/${facilityId}/${noticeId}`);
  return res.data;
};
