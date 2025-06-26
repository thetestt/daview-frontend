import axios from "axios";

export const createReview = async (reviewData) => {
  const response = await axios.post(`/api/review`, reviewData);
  return response.data;
};

export const getAllReviews = async () => {
  const response = await axios.get(`/api/review`);
  return response.data;
};

export const getReviewsByPage = async (page, size) => {
  const response = await axios.get(
    `/api/review/page?page=${page}&size=${size}`
  );
  return response.data;
};

export const getTotalReviewCount = async () => {
  const response = await axios.get(`/api/review/count`);
  return response.data;
};

export const getReviewById = async (revId) => {
  const response = await axios.get(`/api/review/${revId}`);
  return response.data;
};
