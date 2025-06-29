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
        (response.data as any).user &&
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
        (response.data as any).user &&
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

  // 네이버 로그인
  naverLogin: async (code: string, state?: string): Promise<AuthResponse> => {
    try {
      console.log("Naver login request:", { code, state });

      // 1. 네이버 액세스 토큰 요청
      const tokenResponse = await fetch(
        "https://nid.naver.com/oauth2.0/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: process.env.NAVER_CLIENT_ID || "",
            client_secret: process.env.NAVER_CLIENT_SECRET || "",
            code,
            redirect_uri: `${
              process.env.NEXT_PUBLIC_BASE_URL ||
              "https://epigram-team-7.vercel.app"
            }/api/auth/naver/callback`,
          }),
        }
      );

      if (!tokenResponse.ok) {
        console.log("Token response error:", tokenResponse);
        throw new Error("네이버 토큰 요청 실패");
      }

      const tokenData = await tokenResponse.json();
      console.log("Token data:", tokenData);

      if (tokenData.error) {
        throw new Error(`네이버 토큰 오류: ${tokenData.error_description}`);
      }

      // 2. 네이버 사용자 정보 요청
      const userResponse = await fetch("https://openapi.naver.com/v1/nid/me", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error("네이버 사용자 정보 요청 실패");
      }

      const userData = await userResponse.json();
      console.log("User data:", userData);

      if (userData.resultcode !== "00") {
        throw new Error("네이버 사용자 정보 오류");
      }

      // 3. 자체 API에 로그인 요청 (서버사이드에서는 전체 URL 사용)
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "https://epigram-team-7.vercel.app";
      console.log("API 요청 URL:", `${baseUrl}/api/auth/naver`);
      const apiResponse = await fetch(`${baseUrl}/api/auth/naver`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessToken: tokenData.access_token,
          userInfo: userData.response,
        }),
      });

      if (!apiResponse.ok) {
        throw new Error(`API 요청 실패: ${apiResponse.status}`);
      }

      const response = await apiResponse.json();
      console.log("Naver login response:", response);

      // 응답 구조 확인 및 처리
      if (response.data) {
        return response.data;
      } else if (response.user && response.accessToken) {
        return response as AuthResponse;
      } else {
        throw new Error(
          "Invalid response structure: " + JSON.stringify(response)
        );
      }
    } catch (error) {
      console.error("Naver login error:", error);

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const responseData = axiosError.response?.data;

        console.error("Error status:", status);
        console.error("Error response:", responseData);

        if (status === 400 && responseData?.message) {
          throw new Error(responseData.message);
        } else if (status === 401) {
          throw new Error("네이버 로그인 인증에 실패했습니다.");
        } else if (status === 500) {
          throw new Error(
            "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
          );
        }
      }

      const message =
        error instanceof Error
          ? error.message
          : "네이버 로그인에 실패했습니다.";
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

  // 현재 사용자 정보 조회 (쿠키 기반)
  getCurrentUser: async () => {
    try {
      console.log("사용자 정보 조회 중...");
      const response = await api.get("/auth/me");
      console.log("사용자 정보 조회 성공:", response.data.user);
      return response.data.user;
    } catch (error: any) {
      console.log("현재 사용자 정보 없음 (정상):", error?.response?.status);
      // 401은 정상적인 로그아웃 상태이므로 조용히 처리
      if (error?.response?.status === 401) {
        return null;
      }
      // 다른 에러는 로그 출력
      console.error("사용자 정보 조회 에러:", error);
      return null;
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
