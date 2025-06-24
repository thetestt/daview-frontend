import axios from "axios";

export const createReview = async (reviewData) => {
  const response = await axios.post(`/api/review`, reviewData);
  return response.data;
};

export const getAllReviews = async () => {
  const response = await axios.get(`/api/review`);
  return response.data;
};
