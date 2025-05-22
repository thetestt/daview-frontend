import axios from "./axiosInstance";

export const fetchAdminSummary = () =>
  axios.get("/api/admin/summary", {
    headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
  });
