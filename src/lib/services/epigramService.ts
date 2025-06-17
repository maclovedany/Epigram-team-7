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
    const response = await fetch(
      "https://fe-project-epigram-api.vercel.app/14-차경훈/epigrams",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) throw new Error("에피그램 저장에 실패했습니다.");
    return response.json();
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
  toggleLike: async (
    id: string
  ): Promise<{ isLiked: boolean; likeCount: number }> => {
    try {
      const response = await api.post<
        ApiResponse<{ isLiked: boolean; likeCount: number }>
      >(`/${TEAM_ID}/epigrams/${id}/likes`);
      return response.data.data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "좋아요 처리에 실패했습니다.";
      throw new Error(message);
    }
  },
};
