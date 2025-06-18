"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Trash2, Edit, X, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { commentService } from "@/lib/services";
import { useAuthStore } from "@/store/authStore";
import { Comment } from "@/types";
import { createCommentSchema } from "@/lib/validations";

interface CommentSectionProps {
  epigramId: string;
}

interface CommentFormData {
  content: string;
}

export default function CommentSection({ epigramId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const { user, isAuthenticated } = useAuthStore();

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
      setComments(response.list);
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
    try {
      // 인증 상태 확인
      console.log("댓글 작성 시 user:", user);
      console.log("댓글 작성 시 isAuthenticated:", isAuthenticated);
      console.log(
        "댓글 작성 시 localStorage 토큰:",
        localStorage.getItem("authToken")
      );
      console.log(
        "댓글 작성 시 sessionStorage 토큰:",
        sessionStorage.getItem("authToken")
      );

      const newComment = await commentService.createComment(epigramId, {
        content: data.content,
      });
      setComments((prev) => [newComment, ...prev]);
      reset();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "댓글 작성에 실패했습니다.";
      setError(message);
    }
  };

  // 댓글 수정
  const handleEdit = async (commentId: number) => {
    try {
      await commentService.updateComment(epigramId, commentId.toString(), {
        content: editContent,
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
  const handleDelete = async (commentId: number) => {
    try {
      await commentService.deleteComment(epigramId, commentId.toString());
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

  useEffect(() => {
    loadComments();
  }, [epigramId, loadComments]);

  return (
    <div className="space-y-6">
      {/* 댓글 작성 폼 */}
      {isAuthenticated && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            댓글 작성
          </h3>
          <form onSubmit={handleSubmit(onSubmitComment)} className="space-y-4">
            <Textarea
              placeholder="댓글을 입력해주세요..."
              rows={3}
              error={errors.content?.message}
              {...register("content")}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "작성 중..." : "댓글 작성"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* 댓글 목록 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          댓글 ({comments.length})
        </h3>

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
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white rounded-lg border border-gray-200 p-4"
              >
                {editingCommentId === comment.id ? (
                  // 수정 모드
                  <div className="space-y-3">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={cancelEdit}
                        className="flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        취소
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleEdit(comment.id)}
                        className="flex items-center gap-1"
                      >
                        <Check className="w-4 h-4" />
                        수정
                      </Button>
                    </div>
                  </div>
                ) : (
                  // 일반 모드
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {comment.writer.nickname}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {user && comment.writer.id === user.id && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEdit(comment)}
                            className="flex items-center gap-1"
                          >
                            <Edit className="w-4 h-4" />
                            수정
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(comment.id)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                            삭제
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
