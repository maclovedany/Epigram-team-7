import api from "./api";
import {
  Epigram,
  CreateEpigramRequest,
  ApiResponse,
  PaginatedResponse,
} from "@/types";

const TEAM_ID = "14-차경훈";

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

      const data = response.data.data;

      // 데이터 구조 검증 및 기본값 설정
      if (!data) {
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
      const response = await api.get<ApiResponse<Epigram>>(
        `/${TEAM_ID}/epigrams/${id}`
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
  createEpigram: async (data: {
    content: string;
    author: string;
    referenceTitle?: string;
    referenceUrl?: string;
    tags: string[];
  }) => {
    try {
      console.log("에피그램 생성 요청:", data);
      const token = localStorage.getItem("authToken");
      console.log("인증 토큰:", token);

      // JWT 토큰 만료 시간 확인
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          console.log("토큰 만료 시간:", new Date(payload.exp * 1000));
          console.log("현재 시간:", new Date());
          console.log("토큰 만료 여부:", currentTime > payload.exp);
          console.log("토큰의 teamId:", payload.teamId);
        } catch (e) {
          console.log("토큰 파싱 실패:", e);
        }
      }

      console.log("요청 URL:", `/${TEAM_ID}/epigrams`);
      console.log("실제 TEAM_ID:", TEAM_ID);

      const response = await api.post<ApiResponse<Epigram>>(
        `/${TEAM_ID}/epigrams`,
        data
      );
      return response.data.data;
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
    const url = `https://fe-project-epigram-api.vercel.app/14-차경훈/epigrams/${id}/like`;
    const response = await fetch(url, {
      method: isLiked ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("좋아요 처리에 실패했습니다.");
    return response.json(); // { likeCount, isLiked, ... }
  },
};
