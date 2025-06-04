import axios from "axios";

const API_BASE_URL = "https://fe-project-epigram-api.vercel.app/14-차경훈";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

// API endpoints
export const endpoints = {
  // Auth
  login: "/auth/login",
  signup: "/auth/signup",
  refresh: "/auth/refresh",

  // Epigrams
  epigrams: "/epigrams",
  epigramById: (id: string) => `/epigrams/${id}`,

  // Comments
  comments: (epigramId: string) => `/epigrams/${epigramId}/comments`,

  // Likes
  likes: (epigramId: string) => `/epigrams/${epigramId}/likes`,
};
