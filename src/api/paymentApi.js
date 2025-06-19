import axios from "axios";

export const createPayment = async (paymentData) => {
  const response = await axios.post(`/api/payment`, paymentData);
  return response.data;
};
