import axios from "axios";

// Next.js API Routes를 통한 프록시 방식 사용
const api = axios.create({
  baseURL: "/api", // Next.js API Routes로 변경
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키 자동 포함
});

// Request interceptor - 쿠키 기반에서는 토큰 관리 불필요
api.interceptors.request.use(
  (config) => {
    console.log("API 요청 - URL:", config.url);
    // 쿠키는 withCredentials: true로 자동 포함
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 인증 상태 확인 요청은 리다이렉트하지 않음
      const isAuthCheck = error.config?.url?.includes("/auth/me");
      const isLikeRequest = error.config?.url?.includes("/like");
      const isCommentRequest = error.config?.url?.includes("/comments");

      if (!isAuthCheck && !isLikeRequest && !isCommentRequest) {
        // 현재 페이지가 로그인 페이지가 아닌 경우에만 리다이렉트
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/login")
        ) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
