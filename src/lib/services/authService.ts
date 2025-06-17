import api from "../api";
import { LoginRequest, SignupRequest, AuthResponse } from "@/types";

export const authService = {
  // 로그인
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    // 목업: 항상 로그인 성공
    return {
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
      user: {
        id: 1,
        email: credentials.email,
        nickname: "MockUser",
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        image: undefined,
      },
    };
  },

  // 회원가입
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    // 목업: 항상 회원가입 성공
    return {
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
      user: {
        id: 2,
        email: data.email,
        nickname: data.nickname,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        image: undefined,
      },
    };
  },

  // 토큰 갱신
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>("/auth/refresh-token", {
        refreshToken,
      });
      return response.data;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "토큰 갱신 중 오류가 발생했습니다.";
      throw new Error(message);
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
