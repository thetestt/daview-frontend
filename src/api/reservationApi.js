import axios from "axios";

export const createReservation = async (reservationData) => {
  const response = await axios.post("/api/reservation", reservationData);
  return response.data;
};

export const getReservationById = async (memberId) => {
  const response = await axios.get(`/api/reservation/member/${memberId}`);
  return response.data;
};

export const deleteReservation = async (rsvId) => {
  const responese = await axios.put(`/api/reservation/${rsvId}/delete`);
  return responese.data;
};

export const deleteAllReservation = async () => {
  const response = await axios.put(`/api/reservation/deleteAll`);
  return response.data;
};

export const updateReservationCount = async (reservations) => {
  const responese = await axios.put(`/api/reservation/update`, reservations);
  return responese.data;
};
