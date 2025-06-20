import api, { TEAM_ID } from "../api";
import { Epigram, ApiResponse, PaginatedResponse } from "@/types";

export const epigramCRUD = {
  // 에피그램 목록 조회
  getEpigrams: async (params?: {
    limit?: number;
    cursor?: number;
    keyword?: string;
    writerId?: number;
  }): Promise<PaginatedResponse<Epigram>> => {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<Epigram>>>(
        `/${TEAM_ID}/epigrams`,
        { params }
      );

      // 응답 데이터 검증
      if (!response.data) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      }

      // 응답 구조 확인: response.data.data가 있는지 또는 response.data가 직접 데이터인지
      let data: any;
      if ((response.data as any).data) {
        // ApiResponse<T> 구조: { data: T }
        data = (response.data as any).data;
      } else if ((response.data as any).list !== undefined) {
        // 직접 데이터 구조: { list, totalCount, nextCursor }
        data = response.data as any;
      } else {
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

      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }

      const axiosError = error as {
        response?: {
          data?: { message?: string };
          status?: number;
          statusText?: string;
        };
        message?: string;
      };

      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message);
      } else if (axiosError.response?.status) {
        throw new Error(
          `서버 오류 (${axiosError.response.status}): ${
            axiosError.response.statusText || "알 수 없는 오류"
          }`
        );
      } else if (axiosError.message) {
        throw new Error(axiosError.message);
      }

      throw new Error("에피그램을 불러오는데 실패했습니다.");
    }
  },

  // 에피그램 상세 조회
  getEpigramById: async (id: string): Promise<Epigram> => {
    try {
      const response = await api.get<Epigram>(`/${TEAM_ID}/epigrams/${id}`);

      // 응답 구조 확인 및 처리
      if (
        response.data &&
        typeof response.data === "object" &&
        "id" in response.data
      ) {
        return response.data as Epigram;
      } else if (response.data && (response.data as any).data) {
        return (response.data as any).data;
      } else {
        throw new Error("서버 응답 구조가 올바르지 않습니다.");
      }
    } catch (error) {
      const axiosError = error as any;
      if (axiosError.response) {
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
  }): Promise<Epigram> => {
    try {
      const response = await api.post<ApiResponse<Epigram>>(
        `/${TEAM_ID}/epigrams`,
        data
      );

      if (response.data && (response.data as any).data) {
        return (response.data as any).data;
      } else if (
        response.data &&
        typeof response.data === "object" &&
        "id" in response.data
      ) {
        return response.data as unknown as Epigram;
      } else {
        throw new Error("에피그램 생성 응답이 올바르지 않습니다.");
      }
    } catch (error) {
      const axiosError = error as any;

      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message);
      } else if (axiosError.response?.status) {
        throw new Error(
          `서버 오류 (${axiosError.response.status}): ${
            axiosError.response.statusText || "알 수 없는 오류"
          }`
        );
      } else if (axiosError.message) {
        throw new Error(axiosError.message);
      }

      throw new Error("에피그램 생성에 실패했습니다.");
    }
  },

  // 에피그램 수정
  updateEpigram: async (
    id: string,
    data: {
      content?: string;
      author?: string;
      referenceTitle?: string;
      referenceUrl?: string;
      tags?: string[];
    }
  ): Promise<Epigram> => {
    try {
      const response = await api.patch<ApiResponse<Epigram>>(
        `/${TEAM_ID}/epigrams/${id}`,
        data
      );

      if (response.data && (response.data as any).data) {
        return (response.data as any).data;
      } else if (
        response.data &&
        typeof response.data === "object" &&
        "id" in response.data
      ) {
        return response.data as unknown as Epigram;
      } else {
        throw new Error("에피그램 수정 응답이 올바르지 않습니다.");
      }
    } catch (error) {
      const axiosError = error as any;

      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message);
      } else if (axiosError.response?.status) {
        throw new Error(
          `서버 오류 (${axiosError.response.status}): ${
            axiosError.response.statusText || "알 수 없는 오류"
          }`
        );
      } else if (axiosError.message) {
        throw new Error(axiosError.message);
      }

      throw new Error("에피그램 수정에 실패했습니다.");
    }
  },

  // 에피그램 삭제
  deleteEpigram: async (id: string): Promise<void> => {
    try {
      await api.delete(`/${TEAM_ID}/epigrams/${id}`);
    } catch (error) {
      const axiosError = error as any;

      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message);
      } else if (axiosError.response?.status) {
        throw new Error(
          `서버 오류 (${axiosError.response.status}): ${
            axiosError.response.statusText || "알 수 없는 오류"
          }`
        );
      } else if (axiosError.message) {
        throw new Error(axiosError.message);
      }

      throw new Error("에피그램 삭제에 실패했습니다.");
    }
  },
};
