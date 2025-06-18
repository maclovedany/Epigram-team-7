import axios from "axios";
import {
  Epigram,
  CreateEpigramRequest,
  Comment,
  CreateCommentRequest,
  LoginRequest,
  SignupRequest,
  AuthResponse,
  ApiResponse,
  PaginatedResponse,
} from "@/types";

const API_BASE_URL = "https://fe-project-epigram-api.vercel.app";
export const TEAM_ID = "14-7"; // 팀 ID

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
  epigrams: `/${TEAM_ID}/epigrams`,
  epigramById: (id: string) => `/${TEAM_ID}/epigrams/${id}`,

  // Comments
  comments: (epigramId: string) => `/${TEAM_ID}/epigrams/${epigramId}/comments`,

  // Likes
  likes: (epigramId: string) => `/${TEAM_ID}/epigrams/${epigramId}/likes`,
};

// API Service Functions
export const epigramService = {
  // 에피그램 목록 조회
  getEpigrams: async (params?: {
    limit?: number;
    cursor?: number;
    keyword?: string;
    writerId?: number;
  }): Promise<PaginatedResponse<Epigram>> => {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<Epigram>>>(
        endpoints.epigrams,
        { params }
      );

      // 응답 데이터 검증
      if (!response.data) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      }

      const data = response.data.data;

      // 데이터 구조 검증 및 기본값 설정
      if (!data) {
        return {
          list: [],
          totalCount: 0,
          nextCursor: undefined,
        };
      }

      return {
        list: Array.isArray(data.list) ? data.list : [],
        totalCount: typeof data.totalCount === "number" ? data.totalCount : 0,
        nextCursor: data.nextCursor,
      };
    } catch (error) {
      // axios 에러 처리
      if (error instanceof Error) {
        throw error;
      }

      const axiosError = error as {
        response?: {
          data?: { message?: string };
          status?: number;
        };
        message?: string;
      };
      let message = "에피그램을 불러오는데 실패했습니다.";

      if (axiosError.response?.data?.message) {
        message = axiosError.response.data.message;
      } else if (axiosError.response?.status) {
        message = `서버 오류 (${axiosError.response.status})`;
      } else if (axiosError.message) {
        message = axiosError.message;
      }

      throw new Error(message);
    }
  },

  // 에피그램 상세 조회
  getEpigramById: async (id: string): Promise<Epigram> => {
    try {
      const response = await api.get<ApiResponse<Epigram>>(
        endpoints.epigramById(id)
      );
      return response.data.data;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "에피그램을 불러오는데 실패했습니다.";
      throw new Error(message);
    }
  },

  // 에피그램 생성
  createEpigram: async (data: CreateEpigramRequest): Promise<Epigram> => {
    try {
      const response = await api.post<ApiResponse<Epigram>>(
        endpoints.epigrams,
        data
      );
      return response.data.data;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "에피그램 작성에 실패했습니다.";
      throw new Error(message);
    }
  },

  // 에피그램 수정
  updateEpigram: async (
    id: string,
    data: CreateEpigramRequest
  ): Promise<Epigram> => {
    try {
      const response = await api.put<ApiResponse<Epigram>>(
        endpoints.epigramById(id),
        data
      );
      return response.data.data;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "에피그램 수정에 실패했습니다.";
      throw new Error(message);
    }
  },

  // 에피그램 삭제
  deleteEpigram: async (id: string): Promise<void> => {
    try {
      await api.delete(endpoints.epigramById(id));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "에피그램 삭제에 실패했습니다.";
      throw new Error(message);
    }
  },

  // 좋아요 토글
  toggleLike: async (
    id: string
  ): Promise<{ isLiked: boolean; likeCount: number }> => {
    try {
      const response = await api.post<
        ApiResponse<{ isLiked: boolean; likeCount: number }>
      >(endpoints.likes(id));
      return response.data.data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "좋아요 처리에 실패했습니다.";
      throw new Error(message);
    }
  },
};

// Comment Service Functions
export const commentService = {
  // 댓글 목록 조회
  getComments: async (
    epigramId: string,
    limit = 10,
    cursor?: number
  ): Promise<PaginatedResponse<Comment>> => {
    try {
      const params = { limit, ...(cursor && { cursor }) };
      const response = await api.get<ApiResponse<PaginatedResponse<Comment>>>(
        endpoints.comments(epigramId),
        { params }
      );
      return response.data.data;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "댓글을 불러오는데 실패했습니다.";
      throw new Error(message);
    }
  },

  // 댓글 작성
  createComment: async (
    epigramId: string,
    data: CreateCommentRequest
  ): Promise<Comment> => {
    try {
      const response = await api.post<ApiResponse<Comment>>(
        endpoints.comments(epigramId),
        data
      );
      return response.data.data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "댓글 작성에 실패했습니다.";
      throw new Error(message);
    }
  },

  // 댓글 수정
  updateComment: async (
    epigramId: string,
    commentId: string,
    data: CreateCommentRequest
  ): Promise<Comment> => {
    try {
      const response = await api.put<ApiResponse<Comment>>(
        `${endpoints.comments(epigramId)}/${commentId}`,
        data
      );
      return response.data.data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "댓글 수정에 실패했습니다.";
      throw new Error(message);
    }
  },

  // 댓글 삭제
  deleteComment: async (
    epigramId: string,
    commentId: string
  ): Promise<void> => {
    try {
      await api.delete(`${endpoints.comments(epigramId)}/${commentId}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "댓글 삭제에 실패했습니다.";
      throw new Error(message);
    }
  },
};

// Auth Service Functions
export const authService = {
  // 로그인
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "로그인에 실패했습니다.");
      }

      return await response.json();
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("로그인 중 오류가 발생했습니다.");
    }
  },

  // 회원가입
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "회원가입에 실패했습니다.");
      }

      return await response.json();
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("회원가입 중 오류가 발생했습니다.");
    }
  },

  // 토큰 갱신
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("토큰 갱신에 실패했습니다.");
      }

      return await response.json();
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("토큰 갱신 중 오류가 발생했습니다.");
    }
  },

  // 로그아웃
  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.warn("서버 로그아웃 요청 실패:", error);
    }
  },
};
