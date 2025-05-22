import axios from "./axiosInstance";

export const fetchCaregiverProfile = () => axios.get("/api/caregivers/me");

export const fetchCaregiverPatients = () => axios.get("/api/caregivers/patients");

export const fetchCaregiverReservations = () =>
  axios.get("/api/caregivers/me/reservations");
