import api from "../api";
import {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  ApiResponse,
} from "@/types";

export const authService = {
  // 로그인
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      console.log("Login request:", credentials);
      const response = await api.post<ApiResponse<AuthResponse>>(
        "/auth/login",
        credentials
      );
      console.log("Login response:", response.data);

      // 응답 구조 확인 및 처리
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (
        response.data &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (response.data as any).user &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (response.data as any).accessToken
      ) {
        // 직접 응답 구조인 경우 (data wrapper 없음)
        return response.data as unknown as AuthResponse;
      } else {
        throw new Error(
          "Invalid response structure: " + JSON.stringify(response.data)
        );
      }
    } catch (error) {
      console.error("Login error:", error);

      // Axios 에러 처리
      if (error && typeof error === "object" && "response" in error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const responseData = axiosError.response?.data;

        console.error("Error status:", status);
        console.error("Error response:", responseData);

        if (status === 400 && responseData?.message) {
          throw new Error(responseData.message);
        } else if (status === 401) {
          throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
        } else if (status === 500) {
          throw new Error(
            "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
          );
        }
      }

      const message =
        error instanceof Error ? error.message : "로그인에 실패했습니다.";
      throw new Error(message);
    }
  },

  // 회원가입
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    try {
      // 서버에서 passwordConfirmation 필드를 요구하므로 모든 필드를 포함
      console.log("Signup request:", data);
      const response = await api.post<ApiResponse<AuthResponse>>(
        "/auth/signup",
        data
      );
      console.log("Signup response:", response.data);

      // 응답 구조 확인 및 처리
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (
        response.data &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (response.data as any).user &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (response.data as any).accessToken
      ) {
        // 직접 응답 구조인 경우 (data wrapper 없음)
        return response.data as unknown as AuthResponse;
      } else {
        throw new Error(
          "Invalid response structure: " + JSON.stringify(response.data)
        );
      }
    } catch (error) {
      console.error("Signup error:", error);

      // Axios 에러 처리
      if (error && typeof error === "object" && "response" in error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const responseData = axiosError.response?.data;

        console.error("Error status:", status);
        console.error("Error response:", responseData);

        if (responseData?.details) {
          console.error("Validation details:", responseData.details);
        }

        if (status === 400 && responseData?.message) {
          // 상세한 유효성 검사 에러 메시지 생성
          let errorMessage = responseData.message;
          if (responseData.details) {
            const detailMessages = Object.entries(responseData.details)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .map(([field, detail]: [string, any]) => {
                if (typeof detail === "object" && detail.message) {
                  return `${field}: ${detail.message}`;
                }
                return `${field}: ${detail}`;
              })
              .join(", ");
            errorMessage = `${responseData.message} - ${detailMessages}`;
          }
          throw new Error(errorMessage);
        } else if (status === 409) {
          throw new Error("이미 존재하는 이메일입니다.");
        } else if (status === 500) {
          throw new Error(
            "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
          );
        }
      }

      const message =
        error instanceof Error ? error.message : "회원가입에 실패했습니다.";
      throw new Error(message);
    }
  },

  // 토큰 갱신
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>(
        "/auth/refresh-token",
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
      await api.post("/auth/logout");
    } catch (error) {
      console.warn("서버 로그아웃 요청 실패:", error);
    }
  },
};
