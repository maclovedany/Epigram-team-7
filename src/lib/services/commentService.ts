import api, { TEAM_ID } from "../api";
import {
  Comment,
  CreateCommentRequest,
  ApiResponse,
  PaginatedResponse,
} from "@/types";

export const commentService = {
  // 댓글 목록 조회
  getComments: async (
    epigramId: string,
    limit = 10,
    cursor?: number
  ): Promise<PaginatedResponse<Comment>> => {
    try {
      // API 문서에 따른 올바른 엔드포인트
      const params = {
        limit,
        epigramId: parseInt(epigramId),
        ...(cursor && { cursor }),
      };
      const url = `/${TEAM_ID}/comments`;
      console.log("댓글 조회 URL:", url);
      console.log("댓글 조회 파라미터:", params);

      const response = await api.get<ApiResponse<PaginatedResponse<Comment>>>(
        url,
        { params }
      );

      console.log("댓글 조회 응답:", response.data);

      // API 문서에 따르면 직접 페이지네이션 객체를 반환할 수도 있음
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data && "list" in response.data) {
        return response.data as unknown as PaginatedResponse<Comment>;
      } else {
        return {
          list: [],
          totalCount: 0,
          nextCursor: undefined,
        };
      }
    } catch (error) {
      console.error("댓글 조회 실패:", error);
      const axiosError = error as any;

      if (axiosError.response) {
        console.error("댓글 조회 응답 상태:", axiosError.response.status);
        console.error("댓글 조회 응답 데이터:", axiosError.response.data);
      }

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
      // API 문서에 따른 올바른 엔드포인트
      const url = `/${TEAM_ID}/comments`;
      const requestData = {
        ...data,
        epigramId: parseInt(epigramId),
        isPrivate: false, // 기본적으로 공개 댓글
      };

      console.log("댓글 작성 요청 URL:", url);
      console.log("요청 데이터:", requestData);

      const response = await api.post<ApiResponse<Comment>>(url, requestData);

      console.log("댓글 작성 응답:", response.data);

      // API 문서에 따르면 직접 댓글 객체를 반환할 수도 있음
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (
        response.data &&
        typeof response.data === "object" &&
        "id" in response.data &&
        "content" in response.data
      ) {
        return response.data as unknown as Comment;
      } else {
        throw new Error("서버 응답 구조가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("댓글 작성 실패:", error);
      const axiosError = error as any;

      if (axiosError.response) {
        console.error("응답 상태:", axiosError.response.status);
        console.error("응답 데이터:", axiosError.response.data);
        console.error("요청 URL:", axiosError.config?.url);

        if (axiosError.response.status === 404) {
          throw new Error(
            "댓글 API 엔드포인트를 찾을 수 없습니다. API 경로를 확인해주세요."
          );
        }
      }

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
      // API 문서에 따른 올바른 엔드포인트 (PATCH 메서드)
      const url = `/${TEAM_ID}/comments/${commentId}`;
      console.log("댓글 수정 URL:", url);
      console.log("댓글 수정 데이터:", data);

      const response = await api.patch<ApiResponse<Comment>>(url, data);

      console.log("댓글 수정 응답:", response.data);

      // API 문서에 따르면 직접 댓글 객체를 반환할 수도 있음
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (
        response.data &&
        typeof response.data === "object" &&
        "id" in response.data &&
        "content" in response.data
      ) {
        return response.data as unknown as Comment;
      } else {
        throw new Error("서버 응답 구조가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("댓글 수정 실패:", error);
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
      // API 문서에 따른 올바른 엔드포인트
      const url = `/${TEAM_ID}/comments/${commentId}`;
      console.log("댓글 삭제 URL:", url);

      const response = await api.delete(url);

      console.log("댓글 삭제 응답:", response.data);
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      const message =
        error instanceof Error ? error.message : "댓글 삭제에 실패했습니다.";
      throw new Error(message);
    }
  },
};
