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
      const params = { limit, ...(cursor && { cursor }) };
      const response = await api.get<ApiResponse<PaginatedResponse<Comment>>>(
        `/${TEAM_ID}/epigrams/${epigramId}/comments`,
        { params }
      );
      return response.data.data;
    } catch (error) {
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
      const response = await api.post<ApiResponse<Comment>>(
        `/${TEAM_ID}/epigrams/${epigramId}/comments`,
        data
      );
      return response.data.data;
    } catch (error) {
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
      const response = await api.put<ApiResponse<Comment>>(
        `/${TEAM_ID}/epigrams/${epigramId}/comments/${commentId}`,
        data
      );
      return response.data.data;
    } catch (error) {
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
      await api.delete(
        `/${TEAM_ID}/epigrams/${epigramId}/comments/${commentId}`
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "댓글 삭제에 실패했습니다.";
      throw new Error(message);
    }
  },
};
