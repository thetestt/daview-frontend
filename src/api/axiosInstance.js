import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080", // Java 백엔드 서버 주소
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키 인증이 필요한 경우
});

// 요청 인터셉터: JWT 토큰을 자동으로 헤더에 포함
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('JWT 토큰 헤더에 포함:', `Bearer ${token.substring(0, 20)}...`);
    } else {
      console.log('JWT 토큰이 localStorage에 없음');
    }
    return config;
  },
  (error) => {
    console.error('요청 인터셉터 오류:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 401 에러 시 로그인 페이지로 리다이렉트
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log('401 에러: 토큰이 만료되었거나 유효하지 않음');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;