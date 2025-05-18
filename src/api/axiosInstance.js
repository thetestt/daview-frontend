import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080", // Java 백엔드 서버 주소
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키 인증이 필요한 경우
});

export default instance;