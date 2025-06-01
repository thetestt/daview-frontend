import axios from "axios";

export const createReservation = async (reservationData) => {
  const response = await axios.post("/api/reservation", reservationData);
  return response.data;
};

export const getReservationById = async (memberId) => {
  const response = await axios.get(`/api/reservation/member/${memberId}`);
  return response.data;
};