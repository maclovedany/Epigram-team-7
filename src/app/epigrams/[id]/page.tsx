"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Header from "@/components/layout/Header";
import { epigramService } from "@/lib/services/epigramService";
import { commentService } from "@/lib/services/commentService";
import { Epigram, Comment } from "@/types";
import { LoadingSpinner, ErrorMessage } from "@/components/ui";

export default function EpigramDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // State
  const [epigram, setEpigram] = useState<Epigram | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  // 에피그램 데이터 로드
  useEffect(() => {
    const loadEpigram = async () => {
      try {
        setIsLoading(true);
        const data = await epigramService.getEpigramById(id);
        setEpigram(data);
        setIsLiked(data.isLiked || false);

        // 댓글 로드
        const commentsData = await commentService.getComments(id);
        setComments(commentsData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "데이터를 불러오는데 실패했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadEpigram();
    }
  }, [id]);

  const loadMoreComments = useCallback(async () => {
    if (!epigram) return;

    try {
      const nextComments = await commentService.getComments(String(epigram.id));
      setComments(nextComments);
    } catch (err) {
      console.error("댓글 로드 실패:", err);
    }
  }, [epigram]);

  // 무한스크롤
  useEffect(() => {
    if (!loaderRef.current || !epigram) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMoreComments();
      }
    });

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [epigram, loadMoreComments]);

  // 댓글 등록
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !epigram) return;

    try {
      const newComment = await commentService.createComment(
        String(epigram.id),
        {
          content: comment.trim(),
          isPrivate: false,
        }
      );
      setComments((prev) => [newComment, ...prev]);
      setComment("");
    } catch (err) {
      console.error("댓글 등록 실패:", err);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    if (!epigram) return;

    try {
      await commentService.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("댓글 삭제 실패:", err);
    }
  };

  // 좋아요 토글
  const handleLike = async () => {
    if (!epigram) return;

    try {
      const result = await epigramService.toggleLike(epigram.id, isLiked);
      setEpigram((prev) =>
        prev ? { ...prev, likeCount: result.likeCount } : null
      );
      setIsLiked(result.isLiked);
    } catch (err) {
      console.error("좋아요 처리 실패:", err);
    }
  };

  // 에피그램 삭제
  const handleDelete = async () => {
    if (!epigram) return;

    try {
      await epigramService.deleteEpigram(String(epigram.id));
      router.push("/epigramlist");
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f6fa]">
        <Header />
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner text="에피그램을 불러오는 중..." />
        </div>
      </div>
    );
  }

  if (error || !epigram) {
    return (
      <div className="min-h-screen bg-[#f5f6fa]">
        <Header />
        <div className="max-w-3xl mx-auto py-10 px-4">
          <ErrorMessage
            message={error || "에피그램을 찾을 수 없습니다."}
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <Header />
      <main className="max-w-3xl mx-auto py-10 px-4">
        {/* 태그 */}
        <div className="flex gap-2 mb-2">
          {epigram.tags?.map((tag, index) => (
            <span key={index} className="text-[#ABB8CE] text-sm">
              #{typeof tag === "string" ? tag : tag.name}
            </span>
          ))}
        </div>

        {/* 카드 배경 */}
        <div
          className="relative bg-white rounded-xl border p-10 mb-6"
          style={{
            backgroundImage: "url('/notebook-bg.png')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* 본문 */}
          <div className="text-2xl font-serif mb-6 whitespace-pre-line">
            {epigram.content}
          </div>
          <div className="flex justify-end text-[#ABB8CE] text-base mb-2">
            - {epigram.author} -
          </div>

          {/* 좋아요/참조 링크 */}
          <div className="flex justify-center items-center gap-2 mt-4 mb-2">
            <button
              className="inline-flex items-center px-4 py-2 rounded-full bg-black"
              style={{ color: "#fff" }}
              onClick={handleLike}
            >
              <Image
                src="/like.png"
                alt="like"
                width={20}
                height={20}
                className="w-5 h-5 mr-2"
              />
              <span className="font-semibold text-white">
                {epigram.likeCount || 0}
              </span>
            </button>
            {epigram.referenceUrl && (
              <a
                href={epigram.referenceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 rounded-full border border-[#CFDBEA] bg-[#f5f6fa] text-gray-700 ml-2"
              >
                <span>왕도로 가는 길</span>
                <Image
                  src="/md.png"
                  alt="arrow"
                  width={20}
                  height={20}
                  className="w-5 h-5 ml-2"
                />
              </a>
            )}
          </div>

          {/* 수정/삭제 버튼 (본인 에피그램인 경우) */}
          {epigram.writerId && (
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => router.push(`/epigramlist/${epigram.id}/edit`)}
                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
              >
                수정
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-800"
              >
                삭제
              </button>
            </div>
          )}
        </div>

        {/* 댓글 섹션 */}
        <div className="bg-white rounded-xl border p-8">
          <div className="font-semibold mb-4">댓글 ({comments.length})</div>

          {/* 댓글 작성 */}
          <form
            onSubmit={handleCommentSubmit}
            className="mb-6 flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm text-gray-500">👤</span>
            </div>
            <input
              className="flex-1 border rounded-lg px-4 py-3 text-base bg-[#f5f6fa] focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={100}
              placeholder="100자 이내로 입력해주세요."
            />
          </form>

          {/* 댓글 목록 */}
          <div className="space-y-6">
            {comments.map((c) => (
              <div key={c.id} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm text-gray-500">👤</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">
                      {c.writer?.nickname || "익명"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                    {c.writer?.id && (
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">{c.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 무한스크롤 로더 */}
          <div ref={loaderRef} className="h-4" />
        </div>

        {/* 삭제 확인 모달 */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
              <h3 className="text-lg font-semibold mb-4">에피그램 삭제</h3>
              <p className="text-gray-600 mb-6">
                정말로 이 에피그램을 삭제하시겠습니까?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
