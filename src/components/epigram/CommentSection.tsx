"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
import { Button } from "@/components/ui";
import Textarea from "@/components/ui/Textarea";
import {
  createCommentSchema,
  type CreateCommentFormData,
} from "@/lib/validations";
import { commentService } from "@/lib/services/commentService";
import { useAuthStore } from "@/store/authStore";
import { Comment } from "@/types";

interface CommentSectionProps {
  epigramId: string;
}

export default function CommentSection({ epigramId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  const { isAuthenticated, user } = useAuthStore();

  console.log("CommentSection - 인증 상태:", { isAuthenticated, user });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCommentFormData>({
    resolver: zodResolver(createCommentSchema),
  });

  // 댓글 목록 로드
  const loadComments = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await commentService.getComments(epigramId);
      setComments(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "댓글을 불러오는데 실패했습니다.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 댓글 작성
  const onSubmitComment = async (data: CreateCommentFormData) => {
    console.log("댓글 작성 시도:", { isAuthenticated, data });

    if (!isAuthenticated) {
      console.log("인증되지 않음 - 댓글 작성 중단");
      setError("로그인이 필요합니다.");
      return;
    }

    try {
      const commentData = {
        ...data,
        epigramId: parseInt(epigramId),
        isPrivate: false,
      };

      console.log("댓글 서비스 호출:", commentData);
      await commentService.createComment(epigramId, commentData);
      console.log("댓글 작성 성공");

      reset();
      loadComments(); // 댓글 목록 새로고침
    } catch (err) {
      console.error("댓글 작성 에러:", err);
      const errorMessage =
        err instanceof Error ? err.message : "댓글 작성에 실패했습니다.";
      setError(errorMessage);
    }
  };

  // 댓글 삭제
  const deleteComment = async (commentId: number) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      await commentService.deleteComment(commentId);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "댓글 삭제에 실패했습니다.";
      setError(errorMessage);
    }
  };

  // 수정 시작
  const startEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  // 수정 취소
  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const formatDate = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "방금 전";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}분 전`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}시간 전`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}일 전`;
    } else if (diffInSeconds < 2592000) {
      const weeks = Math.floor(diffInSeconds / 604800);
      return `${weeks}주 전`;
    } else if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months}개월 전`;
    } else {
      const years = Math.floor(diffInSeconds / 31536000);
      return `${years}년 전`;
    }
  };

  const handleEdit = async (commentId: number) => {
    try {
      await commentService.updateComment(commentId, {
        content: editContent,
        isPrivate: false,
      });
      setEditingId(null);
      setEditContent("");
      loadComments();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "댓글 수정에 실패했습니다.";
      setError(errorMessage);
    }
  };

  return (
    <div className="w-full bg-gray-100 py-8">
      <div className="max-w-[640px] mx-auto px-4">
        <div className="bg-transparent p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            댓글 ({comments.length})
          </h3>
          {/* 댓글 작성 폼 */}
          {isAuthenticated ? (
            <form
              onSubmit={handleSubmit(onSubmitComment)}
              className="mb-6 bg-gray-100 p-4 rounded-lg"
            >
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <Textarea
                    placeholder="100자 이내로 입력해주세요."
                    rows={2}
                    className="resize-none bg-gray-100 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    error={errors.content?.message}
                    {...register("content")}
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      type="submit"
                      size="sm"
                      isLoading={isSubmitting}
                      disabled={isSubmitting}
                      className="bg-[#BFC6D1] hover:bg-[#A7B2C5] disabled:bg-[#E9EBF0] text-white px-4 py-2 rounded-md text-sm"
                    >
                      등록
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
              <p className="mb-3">댓글을 작성하려면 로그인이 필요합니다.</p>
              <button
                onClick={() => (window.location.href = "/login")}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                로그인하기
              </button>
            </div>
          )}

          {/* 에러 메시지 */}
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* 댓글 목록 */}
          <div className="space-y-4">
            {isLoading ? (
              // 로딩 스켈레톤
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="p-4 border border-gray-200 rounded-lg animate-pulse"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-gray-100 p-4 rounded-lg mb-4 last:mb-0"
                >
                  <div className="flex gap-3">
                    {/* 프로필 이미지 */}
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>

                    {/* 댓글 내용 */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {comment.writer.nickname}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>

                        {/* 댓글 작성자만 수정/삭제 가능 */}
                        {user && user.id === comment.writer.id && (
                          <div className="flex items-center gap-1 ml-auto">
                            <button
                              onClick={() => startEdit(comment)}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              수정
                            </button>
                            <span className="text-xs text-gray-300">|</span>
                            <button
                              onClick={() => deleteComment(comment.id)}
                              className="text-xs text-red-600 hover:text-red-800"
                            >
                              삭제
                            </button>
                          </div>
                        )}
                      </div>

                      {/* 댓글 텍스트 */}
                      {editingId === comment.id ? (
                        // 수정 모드
                        <div className="space-y-2">
                          <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={2}
                            className="text-sm"
                          />
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              size="sm"
                              className="text-xs px-3 py-1"
                              onClick={() => handleEdit(comment.id)}
                            >
                              저장
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="text-xs px-3 py-1"
                              onClick={cancelEdit}
                            >
                              취소
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // 일반 표시 모드
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {comment.content}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // 빈 상태
              <div className="text-center py-8 text-gray-500">
                <p>아직 댓글이 없습니다.</p>
                <p className="text-sm">첫 번째 댓글을 작성해보세요!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
