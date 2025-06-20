import axios from "axios";

export const createPayment = async (paymentData) => {
  const response = await axios.post(`/api/payment`, paymentData);
  return response.data;
};

export const mapReservationsToPayment = async (mappingList) => {
  const responese = await axios.post(`/api/payment/map`, mappingList);
  return responese.data;
};
