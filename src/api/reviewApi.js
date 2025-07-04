import axios from "axios";

const REVIEW_API = "/api/review";
const COMMENT_API = "/api/review-comments";

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

export const getReviewsByProdNm = async (prodNm) => {
  const response = await axios.get(`${REVIEW_API}/product`, {
    params: { prodNm },
  });
  return response.data;
};

export const getReviewsWithCommentCount = async (page = 1, size = 10) => {
  const response = await axios.get(`${REVIEW_API}/page/comment`, {
    params: { page, size },
  });
  return response.data;
};

export const getCommentsByReview = async (revId) => {
  const response = await axios.get(`${COMMENT_API}/review/${revId}`);
  return response.data;
};

export const addComment = async (
  revId,
  commentText,
  parentCommentId = null,
  memberId
) => {
  const response = await axios.post(`${COMMENT_API}`, {
    revId,
    commentText,
    parentCommentId,
    memberId,
  });
  return response.data;
};

export const updateComment = async (commentId, commentText) => {
  const response = await axios.put(`${COMMENT_API}/${commentId}`, {
    commentText,
  });
  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await axios.put(`${COMMENT_API}/${commentId}/delete`);
  return response.data;
};
