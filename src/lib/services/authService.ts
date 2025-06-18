import api from "../api";
import {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  ApiResponse,
} from "@/types";

const TEAM_ID = "14-차경훈";

export const authService = {
  // 로그인
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>(
        `/${TEAM_ID}/auth/signIn`,
        credentials
      );
      return response.data.data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "로그인에 실패했습니다.";
      throw new Error(message);
    }
  },

  // 회원가입
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>(
        `/${TEAM_ID}/auth/signUp`,
        data
      );
      return response.data.data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "회원가입에 실패했습니다.";
      throw new Error(message);
    }
  },

  // 토큰 갱신
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>(
        `/${TEAM_ID}/auth/refresh-token`,
        { refreshToken }
      );
      return response.data.data;
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
      await api.post(`/${TEAM_ID}/auth/signOut`);
    } catch (error) {
      console.warn("서버 로그아웃 요청 실패:", error);
    }
  },
};
