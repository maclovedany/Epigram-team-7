import api from "../api";
import { LoginRequest, SignupRequest, AuthResponse } from "@/types";

export const authService = {
  // 로그인
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>(
        "/auth/signin",
        credentials
      );
      return response.data;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "로그인 중 오류가 발생했습니다.";
      throw new Error(message);
    }
  },

  // 회원가입
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>(
        "/14-차경훈/auth/signUp",
        data
      );
      return response.data;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "회원가입 중 오류가 발생했습니다.";
      throw new Error(message);
    }
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
