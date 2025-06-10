"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MessageCircle,
  Send,
  User,
  MoreVertical,
  Edit3,
  Trash2,
} from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui";
import Textarea from "@/components/ui/Textarea";
import {
  createCommentSchema,
  type CreateCommentFormData,
} from "@/lib/validations";
import { commentService } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Comment } from "@/types";
import { cn } from "@/lib/utils";

interface CommentSectionProps {
  epigramId: string;
}

export default function CommentSection({ epigramId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  const { isAuthenticated, user } = useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCommentFormData>({
    resolver: zodResolver(createCommentSchema),
  });

  const {
    register: editRegister,
    handleSubmit: handleEditSubmit,
    setValue: setEditValue,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm<CreateCommentFormData>({
    resolver: zodResolver(createCommentSchema),
  });

  // 댓글 목록 로드
  const loadComments = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await commentService.getComments(epigramId);
      setComments(response.list);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [epigramId]);

  // 댓글 작성
  const onSubmitComment = async (data: CreateCommentFormData) => {
    if (!isAuthenticated) return;

    try {
      setIsSubmitting(true);
      await commentService.createComment(epigramId, data);
      reset();
      loadComments(); // 댓글 목록 새로고침
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 댓글 수정
  const onEditComment = async (data: CreateCommentFormData) => {
    if (!editingId) return;

    try {
      await commentService.updateComment(epigramId, editingId.toString(), data);
      setEditingId(null);
      resetEdit();
      loadComments();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 댓글 삭제
  const deleteComment = async (commentId: number) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      await commentService.deleteComment(epigramId, commentId.toString());
      loadComments();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 수정 시작
  const startEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditValue("content", comment.content);
  };

  // 수정 취소
  const cancelEdit = () => {
    setEditingId(null);
    resetEdit();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card id="comments">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          댓글 ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 댓글 작성 폼 */}
        {isAuthenticated ? (
          <form onSubmit={handleSubmit(onSubmitComment)} className="space-y-3">
            <Textarea
              placeholder="댓글을 작성해주세요..."
              rows={3}
              error={errors.content?.message}
              {...register("content")}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                size="sm"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                <Send className="w-4 h-4 mr-1" />
                댓글 작성
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 text-text-secondary">
            <p>댓글을 작성하려면 로그인이 필요합니다.</p>
          </div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <div className="p-3 text-sm text-error bg-red-50 border border-red-200 rounded-lg">
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
                className="p-4 border border-gray-200 rounded-lg"
              >
                {/* 댓글 헤더 */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {comment.writer.nickname}
                      </p>
                      <p className="text-xs text-text-tertiary">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* 댓글 작성자만 수정/삭제 가능 */}
                  {user && user.id === comment.writer.id && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(comment)}
                        className="p-1 text-text-tertiary hover:text-text-secondary"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteComment(comment.id)}
                        className="p-1 text-text-tertiary hover:text-error"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* 댓글 내용 */}
                {editingId === comment.id ? (
                  // 수정 모드
                  <form
                    onSubmit={handleEditSubmit(onEditComment)}
                    className="space-y-3"
                  >
                    <Textarea
                      rows={2}
                      error={editErrors.content?.message}
                      {...editRegister("content")}
                    />
                    <div className="flex gap-2">
                      <Button type="submit" size="sm" variant="primary">
                        저장
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={cancelEdit}
                      >
                        취소
                      </Button>
                    </div>
                  </form>
                ) : (
                  // 일반 표시 모드
                  <p className="text-sm text-text-primary leading-relaxed">
                    {comment.content}
                  </p>
                )}
              </div>
            ))
          ) : (
            // 빈 상태
            <div className="text-center py-8 text-text-secondary">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>아직 댓글이 없습니다.</p>
              <p className="text-sm">첫 번째 댓글을 작성해보세요!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
