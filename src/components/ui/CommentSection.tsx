"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, User } from "lucide-react";
import { Button } from "@/components/ui";
import Textarea from "@/components/ui/Textarea";
import { createCommentSchema } from "@/lib/validations";
import { commentService } from "@/lib/services/commentService";
import { useAuthStore } from "@/store/authStore";
import { Comment } from "@/types";

interface CommentSectionProps {
  epigramId: string;
  variant?: "default" | "detailed";
}

interface CommentFormData {
  content: string;
}

export default function CommentSection({
  epigramId,
  variant = "default",
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>("");

  const { isAuthenticated, user } = useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommentFormData>({
    resolver: zodResolver(createCommentSchema),
  });

  // 댓글 목록 로드
  const loadComments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await commentService.getComments(epigramId);
      setComments(response);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "댓글을 불러오는데 실패했습니다.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [epigramId]);

  // 댓글 작성
  const onSubmitComment = async (data: CommentFormData) => {
    if (!isAuthenticated) {
      setError("로그인이 필요합니다.");
      return;
    }

    try {
      const commentData = {
        ...data,
        epigramId: parseInt(epigramId),
        isPrivate: false,
      };
      await commentService.createComment(epigramId, commentData);
      reset();
      loadComments();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "댓글 작성에 실패했습니다.";
      setError(message);
    }
  };

  // 댓글 수정
  const handleEdit = async (commentId: number) => {
    try {
      await commentService.updateComment(commentId, {
        content: editContent,
        isPrivate: false,
      });
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? { ...comment, content: editContent }
            : comment
        )
      );
      setEditingCommentId(null);
      setEditContent("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "댓글 수정에 실패했습니다.";
      setError(message);
    }
  };

  // 댓글 삭제
  const deleteComment = async (commentId: number) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      await commentService.deleteComment(commentId);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "댓글 삭제에 실패했습니다.";
      setError(message);
    }
  };

  // 수정 모드 시작
  const startEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  // 수정 모드 취소
  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "방금 전";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}일 전`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 604800)}주 전`;
    if (diffInSeconds < 31536000)
      return `${Math.floor(diffInSeconds / 2592000)}개월 전`;
    return `${Math.floor(diffInSeconds / 31536000)}년 전`;
  };

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // Variant에 따른 스타일링
  const containerClass =
    variant === "detailed" ? "space-y-6" : "w-full bg-gray-100 py-8";

  const formClass =
    variant === "detailed"
      ? "bg-white rounded-lg border border-gray-200 p-6"
      : "mb-6 bg-gray-100 p-4 rounded-lg";

  const commentItemClass =
    variant === "detailed"
      ? "bg-white rounded-lg border border-gray-200 p-4"
      : "bg-gray-100 p-4 mb-3 mx-2.5";

  return (
    <div className={containerClass}>
      {variant === "default" && (
        <div className="max-w-[640px] mx-auto px-4">
          <div className="bg-transparent p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              댓글 ({comments.length})
            </h3>
          </div>
        </div>
      )}

      {/* 댓글 작성 폼 */}
      {isAuthenticated && (
        <div
          className={variant === "default" ? "max-w-[640px] mx-auto px-4" : ""}
        >
          <div className={formClass}>
            {variant === "detailed" && (
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                댓글 작성
              </h3>
            )}
            <form
              onSubmit={handleSubmit(onSubmitComment)}
              className={variant === "detailed" ? "space-y-4" : "flex gap-3"}
            >
              {variant === "default" && (
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              )}
              <div className="flex-1">
                <Textarea
                  placeholder={
                    variant === "detailed"
                      ? "댓글을 입력해주세요..."
                      : "100자 이내로 입력해주세요."
                  }
                  rows={variant === "detailed" ? 3 : 2}
                  className={
                    variant === "detailed"
                      ? ""
                      : "resize-none bg-gray-100 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  }
                  error={errors.content?.message}
                  {...register("content")}
                />
                <div
                  className={`flex justify-end ${
                    variant === "detailed" ? "" : "mt-2"
                  }`}
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size={variant === "detailed" ? "md" : "sm"}
                    className={
                      variant === "detailed"
                        ? "flex items-center gap-2"
                        : "bg-[#BFC6D1] hover:bg-[#A7B2C5] disabled:bg-[#E9EBF0] text-white px-4 py-2 rounded-md text-sm"
                    }
                  >
                    {variant === "detailed" && <Send className="w-4 h-4" />}
                    {isSubmitting
                      ? "작성 중..."
                      : variant === "detailed"
                      ? "댓글 작성"
                      : "등록"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* 댓글 목록 */}
      <div
        className={variant === "default" ? "max-w-[640px] mx-auto px-4" : ""}
      >
        <div className={variant === "detailed" ? "space-y-4" : ""}>
          {variant === "detailed" && (
            <h3 className="text-lg font-semibold text-gray-900">
              댓글 ({comments.length})
            </h3>
          )}

          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mr-3"></div>
                <p className="text-gray-500">댓글을 불러오는 중...</p>
              </div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">아직 댓글이 없습니다.</p>
            </div>
          ) : (
            <div className={variant === "detailed" ? "space-y-4" : ""}>
              {comments.map((comment, index) => (
                <div key={comment.id}>
                  <div className={commentItemClass}>
                    {editingCommentId === comment.id ? (
                      // 수정 모드
                      <div className="space-y-3">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={3}
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700"
                          >
                            취소
                          </button>
                          <button
                            onClick={() => handleEdit(comment.id)}
                            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            저장
                          </button>
                        </div>
                      </div>
                    ) : (
                      // 일반 모드
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm text-gray-900">
                                {comment.writer?.nickname || "익명"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(comment.createdAt)}
                              </p>
                            </div>
                          </div>

                          {/* 작성자만 수정/삭제 가능 */}
                          {user && comment.writer?.id === user.id && (
                            <div className="flex gap-2 text-sm">
                              <button
                                onClick={() => startEdit(comment)}
                                className="text-gray-500 hover:text-gray-700 underline"
                              >
                                수정
                              </button>
                              <button
                                onClick={() => deleteComment(comment.id)}
                                className="text-red-500 hover:text-red-600 underline"
                              >
                                삭제
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-700 leading-relaxed text-sm ml-10">
                          {comment.content}
                        </p>
                      </div>
                    )}
                  </div>
                  {/* 댓글 사이 구분선 - 마지막 댓글이 아닐 때만 표시 */}
                  {variant === "default" && index < comments.length - 1 && (
                    <div className="border-b border-gray-300 mx-6"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
