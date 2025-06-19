import axios from "axios";

const API_BASE_URL = "https://fe-project-epigram-api.vercel.app";
export const TEAM_ID = "14-98"; // 팀 ID

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // localStorage와 sessionStorage 모두 확인
    let token = localStorage.getItem("authToken");
    if (!token) {
      token = sessionStorage.getItem("authToken");
    }

    console.log("API 요청 - 토큰:", token ? "존재함" : "없음");
    console.log("API 요청 - URL:", config.url);

    if (token) {
      try {
        // JWT 토큰 유효성 검사
        const payload = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Math.floor(Date.now() / 1000);

        // 토큰이 만료된 경우 제거
        if (currentTime > payload.exp) {
          console.log("만료된 토큰 감지 - 제거");
          localStorage.removeItem("authToken");
          sessionStorage.removeItem("authToken");
          token = null;
        }
        // 팀 ID가 일치하지 않는 경우 제거
        else if (payload.teamId !== TEAM_ID) {
          console.log("팀 ID 불일치 토큰 감지 - 제거");
          localStorage.removeItem("authToken");
          sessionStorage.removeItem("authToken");
          token = null;
        }
      } catch {
        // 토큰 파싱 실패 시 제거
        console.log("유효하지 않은 토큰 감지 - 제거");
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
        token = null;
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("API 요청 - Authorization 헤더 설정됨");
    } else {
      console.log("API 요청 - 토큰 없음, Authorization 헤더 없음");
    }

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
      // 좋아요 요청이나 댓글 요청이 아닌 경우에만 자동 리다이렉트
      const isLikeRequest = error.config?.url?.includes("/like");
      const isCommentRequest = error.config?.url?.includes("/comments");
      if (!isLikeRequest && !isCommentRequest) {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
