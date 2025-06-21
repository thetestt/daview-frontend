import axios from "axios";

const RESERVATION_API = "/api/reservation";

export const createReservation = async (reservationData) => {
  const response = await axios.post(`${RESERVATION_API}`, reservationData);
  return response.data;
};

export const getReservationById = async (memberId) => {
  const response = await axios.get(`${RESERVATION_API}/member/${memberId}`);
  return response.data;
};

export const deleteReservation = async (rsvId) => {
  const responese = await axios.put(`${RESERVATION_API}/${rsvId}/delete`);
  return responese.data;
};

export const deleteAllReservation = async () => {
  const response = await axios.put(`${RESERVATION_API}/deleteAll`);
  return response.data;
};

export const updateReservationCount = async (reservations) => {
  const responese = await axios.put(`${RESERVATION_API}/update`, reservations);
  return responese.data;
};

export const updateReservationStatus = async (rsvId) => {
  const response = await axios.put(`${RESERVATION_API}/${rsvId}/status`);
  return response.data;
};

export const getReservationByPaymentId = async (pymId) => {
  const response = await axios.get(`${RESERVATION_API}/payment/${pymId}`);
  return response.data;
};
