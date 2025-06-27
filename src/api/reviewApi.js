import axios from "axios";

const REVIEW_API = "/api/review";

export const createReview = async (reviewData) => {
  const response = await axios.post(`${REVIEW_API}`, reviewData);
  return response.data;
};

export const getAllReviews = async () => {
  const response = await axios.get(`${REVIEW_API}`);
  return response.data;
};

export const getReviewsByPage = async (page, size) => {
  const response = await axios.get(
    `${REVIEW_API}/page?page=${page}&size=${size}`
  );
  return response.data;
};

export const getTotalReviewCount = async () => {
  const response = await axios.get(`${REVIEW_API}/count`);
  return response.data;
};

export const getReviewById = async (revId) => {
  const response = await axios.get(`${REVIEW_API}/${revId}`);
  return response.data;
};

export const getReviewByIdForEdit = async (revId) => {
  const response = await axios.get(`${REVIEW_API}/${revId}/edit`);
  return response.data;
};

export const updateReview = async (revId, reviewData) => {
  const response = await axios.put(`${REVIEW_API}/${revId}/update`, reviewData);
  return response.data;
};
