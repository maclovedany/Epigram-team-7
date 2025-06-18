import api, { TEAM_ID } from "../api";
import {
  Epigram,
  CreateEpigramRequest,
  ApiResponse,
  PaginatedResponse,
} from "@/types";

export const epigramService = {
  // 에피그램 목록 조회
  getEpigrams: async (params?: {
    limit?: number;
    cursor?: number;
    keyword?: string;
    writerId?: number;
  }): Promise<PaginatedResponse<Epigram>> => {
    try {
      console.log("API 호출 시작:", `/${TEAM_ID}/epigrams`, params);

      const response = await api.get<ApiResponse<PaginatedResponse<Epigram>>>(
        `/${TEAM_ID}/epigrams`,
        { params }
      );

      console.log("API 응답:", response.data);

      // 응답 데이터 검증
      if (!response.data) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      }

      // 응답 구조 확인: response.data.data가 있는지 또는 response.data가 직접 데이터인지
      let data: any;
      if ((response.data as any).data) {
        // ApiResponse<T> 구조: { data: T }
        data = (response.data as any).data;
        console.log("중첩된 데이터 구조 사용:", data);
      } else if ((response.data as any).list !== undefined) {
        // 직접 데이터 구조: { list, totalCount, nextCursor }
        data = response.data as any;
        console.log("직접 데이터 구조 사용:", data);
      } else {
        console.log("데이터가 없음, 빈 배열 반환");
        return {
          list: [],
          totalCount: 0,
          nextCursor: undefined,
        };
      }

      const result = {
        list: Array.isArray(data.list) ? data.list : [],
        totalCount: typeof data.totalCount === "number" ? data.totalCount : 0,
        nextCursor: data.nextCursor,
      };

      console.log("처리된 결과:", result);
      return result;
    } catch (error) {
      console.error("API 호출 실패:", error);

      // axios 에러 처리
      if (error instanceof Error) {
        throw error;
      }

      const axiosError = error as unknown as {
        response?: {
          data?: { message?: string };
          status?: number;
          statusText?: string;
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
      console.log("에피그램 상세 조회 요청:", `/${TEAM_ID}/epigrams/${id}`);
      const response = await api.get<Epigram>(`/${TEAM_ID}/epigrams/${id}`);

      console.log("에피그램 상세 응답:", response.data);

      // 응답 구조 확인 및 처리
      if (
        response.data &&
        typeof response.data === "object" &&
        "id" in response.data
      ) {
        // 직접 에피그램 객체가 반환된 경우
        console.log("에피그램 상세 데이터:", response.data);
        return response.data as Epigram;
      } else if (response.data && (response.data as any).data) {
        // ApiResponse 구조인 경우
        console.log("중첩된 에피그램 데이터:", (response.data as any).data);
        return (response.data as any).data;
      } else {
        console.error("예상치 못한 응답 구조:", response.data);
        throw new Error("서버 응답 구조가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("에피그램 상세 조회 실패:", error);

      // axios 에러 처리
      const axiosError = error as any;
      if (axiosError.response) {
        console.error("응답 데이터:", axiosError.response.data);
        console.error("응답 상태:", axiosError.response.status);

        if (axiosError.response.status === 404) {
          throw new Error("요청한 에피그램이 존재하지 않습니다.");
        }

        const message =
          axiosError.response.data?.message ||
          `서버 오류 (${axiosError.response.status})`;
        throw new Error(message);
      }

      const message =
        error instanceof Error
          ? error.message
          : "에피그램을 불러오는데 실패했습니다.";
      throw new Error(message);
    }
  },

  // 에피그램 생성
  createEpigram: async (data: {
    content: string;
    author: string;
    referenceTitle?: string;
    referenceUrl?: string;
    tags: string[];
  }) => {
    try {
      console.log("에피그램 생성 요청:", data);
      // localStorage와 sessionStorage 모두 확인
      let token = localStorage.getItem("authToken");
      if (!token) {
        token = sessionStorage.getItem("authToken");
      }
      console.log("인증 토큰:", token);

      // 토큰이 없으면 즉시 에러
      if (!token) {
        throw new Error("로그인이 필요합니다.");
      }

      // JWT 토큰 검증
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          console.log("토큰 만료 시간:", new Date(payload.exp * 1000));
          console.log("현재 시간:", new Date());
          console.log("토큰 만료 여부:", currentTime > payload.exp);
          console.log("토큰의 teamId:", payload.teamId);
          console.log("현재 설정된 TEAM_ID:", TEAM_ID);

          // 토큰 만료 확인
          if (currentTime > payload.exp) {
            console.log("토큰이 만료되었습니다.");
            localStorage.removeItem("authToken");
            throw new Error("토큰이 만료되었습니다. 다시 로그인해주세요.");
          }

          // 팀 ID 불일치 확인
          if (payload.teamId !== TEAM_ID) {
            console.log("토큰의 팀 ID와 현재 설정된 팀 ID가 다릅니다.");
            localStorage.removeItem("authToken");
            throw new Error(
              "인증 정보가 일치하지 않습니다. 다시 로그인해주세요."
            );
          }
        } catch (e) {
          console.log("토큰 검증 실패:", e);
          if (e instanceof Error && e.message.includes("로그인")) {
            throw e;
          }
          localStorage.removeItem("authToken");
          throw new Error("유효하지 않은 토큰입니다. 다시 로그인해주세요.");
        }
      } else {
        throw new Error("로그인이 필요합니다.");
      }

      console.log("요청 URL:", `/${TEAM_ID}/epigrams`);
      console.log("실제 TEAM_ID:", TEAM_ID);

      const response = await api.post<ApiResponse<Epigram>>(
        `/${TEAM_ID}/epigrams`,
        data
      );

      console.log("에피그램 생성 응답:", response.data);
      console.log("응답의 tags:", (response.data as any).tags);

      // 응답 구조 확인 및 처리
      if (response.data && response.data.data) {
        console.log("응답 데이터:", response.data.data);
        console.log("응답 데이터의 tags:", response.data.data.tags);
        return response.data.data;
      } else if (
        response.data &&
        typeof response.data === "object" &&
        "id" in response.data
      ) {
        // 직접 에피그램 객체가 반환된 경우
        console.log("직접 에피그램 데이터:", response.data);
        return response.data as unknown as Epigram;
      } else {
        console.error("예상치 못한 응답 구조:", response.data);
        throw new Error("서버 응답 구조가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("에피그램 생성 실패:", error);

      // axios 에러 처리
      const axiosError = error as any;
      if (axiosError.response) {
        console.error("응답 데이터:", axiosError.response.data);
        console.error("응답 상태:", axiosError.response.status);
        console.error("응답 헤더:", axiosError.response.headers);

        if (axiosError.response.status === 403) {
          throw new Error("권한이 없습니다. 다시 로그인해주세요.");
        }

        const message =
          axiosError.response.data?.message ||
          `서버 오류 (${axiosError.response.status})`;
        throw new Error(message);
      }

      const message =
        error instanceof Error
          ? error.message
          : "에피그램 저장에 실패했습니다.";
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
        `/${TEAM_ID}/epigrams/${id}`,
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
      await api.delete(`/${TEAM_ID}/epigrams/${id}`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "에피그램 삭제에 실패했습니다.";
      throw new Error(message);
    }
  },

  // 좋아요 토글
  toggleLike: async (id: number, isLiked: boolean) => {
    try {
      const response = await api.request({
        method: isLiked ? "DELETE" : "POST",
        url: `/${TEAM_ID}/epigrams/${id}/like`,
      });

      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data && typeof response.data === "object") {
        return response.data;
      } else {
        throw new Error("서버 응답 구조가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
      const axiosError = error as any;
      if (axiosError.response) {
        console.error("응답 데이터:", axiosError.response.data);
        console.error("응답 상태:", axiosError.response.status);

        if (axiosError.response.status === 401) {
          throw new Error("로그인이 필요합니다.");
        }
        if (axiosError.response.status === 403) {
          throw new Error("권한이 없습니다.");
        }
      }

      const message =
        error instanceof Error ? error.message : "좋아요 처리에 실패했습니다.";
      throw new Error(message);
    }
  },
};
