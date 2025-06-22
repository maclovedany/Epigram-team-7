import api from "../api";
import { Comment, CreateCommentRequest } from "@/types";

export const commentService = {
  // 댓글 목록 조회
  async getComments(epigramId: string, limit: number = 10): Promise<Comment[]> {
    try {
      console.log(`댓글 목록 요청: 에피그램 ID ${epigramId}, limit: ${limit}`);
      const response = await api.get("/comments", {
        params: {
          epigramId: parseInt(epigramId),
          limit: limit,
        },
      });
      console.log("댓글 목록 응답:", response.data);

      const comments = response.data.list || [];

      // 에피그램 ID로 필터링 (API에서 필터링이 안되는 경우 대비)
      const filteredComments = comments.filter(
        (comment: Comment) => comment.epigramId === parseInt(epigramId)
      );

      console.log("필터링된 댓글:", filteredComments);
      return filteredComments;
    } catch (error: unknown) {
      console.error("댓글 목록 조회 실패:", error);
      throw new Error("댓글을 불러오는데 실패했습니다.");
    }
  },

  // 댓글 작성
  async createComment(
    epigramId: string,
    data: CreateCommentRequest
  ): Promise<Comment> {
    try {
      console.log("댓글 작성 요청:", { epigramId, data });
      const response = await api.post("/comments", {
        ...data,
        epigramId: parseInt(epigramId),
      });
      console.log("댓글 작성 응답:", response.data);
      return response.data;
    } catch (error: unknown) {
      console.error("댓글 작성 실패:", error);

      if (error instanceof Error) {
        throw error;
      }

      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      throw new Error(
        axiosError.response?.data?.message || "댓글 작성에 실패했습니다."
      );
    }
  },

  // 댓글 수정
  async updateComment(
    commentId: number,
    data: CreateCommentRequest
  ): Promise<Comment> {
    try {
      console.log("댓글 수정 요청:", { commentId, data });
      const response = await api.patch(`/comments/${commentId}`, data);
      console.log("댓글 수정 응답:", response.data);
      return response.data;
    } catch (error: unknown) {
      console.error("댓글 수정 실패:", error);

      if (error instanceof Error) {
        throw error;
      }

      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      throw new Error(
        axiosError.response?.data?.message || "댓글 수정에 실패했습니다."
      );
    }
  },

  // 댓글 삭제
  async deleteComment(commentId: number): Promise<void> {
    try {
      console.log("댓글 삭제 요청:", commentId);
      await api.delete(`/comments/${commentId}`);
      console.log("댓글 삭제 완료");
    } catch (error: unknown) {
      console.error("댓글 삭제 실패:", error);

      if (error instanceof Error) {
        throw error;
      }

      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      throw new Error(
        axiosError.response?.data?.message || "댓글 삭제에 실패했습니다."
      );
    }
  },
};
