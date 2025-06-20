import axios from "axios";

const PAYMENT_API = "/api/payment";

export const createPayment = async (paymentData) => {
  const response = await axios.post(`${PAYMENT_API}`, paymentData);
  return response.data;
};

export const mapReservationsToPayment = async (mappingList) => {
  const response = await axios.post(`${PAYMENT_API}/map`, mappingList);
  return response.data;
};

export const getPaymentById = async (pymId) => {
  const response = await axios.get(`${PAYMENT_API}/${pymId}`);
  return response.data;
};
