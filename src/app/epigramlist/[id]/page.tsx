"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  ExternalLink,
  Edit3,
  Trash2,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { Button, Card, CardContent } from "@/components/ui";
import CommentSection from "@/components/epigram/CommentSection";
import { epigramService } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Epigram } from "@/types";
import { cn } from "@/lib/utils";

export default function EpigramDetailPage() {
  const [epigram, setEpigram] = useState<Epigram | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);
  const [error, setError] = useState<string>("");

  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  const epigramId = params.id as string;

  // 에피그램 데이터 로드
  useEffect(() => {
    const loadEpigramData = async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await epigramService.getEpigramById(epigramId);
        setEpigram(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "에피그램을 불러오는데 실패했습니다.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (epigramId) {
      loadEpigramData();
    }
  }, [epigramId]);

  // 좋아요 토글
  const handleLike = async () => {
    if (!isAuthenticated || !epigram || isLiking) return;

    try {
      setIsLiking(true);
      const result = await epigramService.toggleLike(epigram.id.toString());
      setEpigram({
        ...epigram,
        isLiked: result.isLiked,
        likeCount: result.likeCount,
      });
    } catch (err) {
      console.error("좋아요 처리 실패:", err);
    } finally {
      setIsLiking(false);
    }
  };

  // 에피그램 삭제
  const handleDelete = async () => {
    if (!epigram || !window.confirm("이 에피그램을 삭제하시겠습니까?")) return;

    try {
      await epigramService.deleteEpigram(epigram.id.toString());
      router.push("/epigramlist");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "삭제에 실패했습니다.";
      alert("삭제에 실패했습니다: " + errorMessage);
    }
  };

  // 공유하기
  const handleShare = async () => {
    if (!epigram) return;

    const shareUrl = window.location.href;
    const shareText = `&quot;${epigram.content}&quot; - ${epigram.author}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Epigram",
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // 공유 취소시 에러 무시
      }
    } else {
      // fallback: 클립보드에 복사
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        alert("링크가 클립보드에 복사되었습니다!");
      } catch {
        alert("공유 링크: " + shareUrl);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-secondary">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* 헤더 스켈레톤 */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-40 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* 에피그램 스켈레톤 */}
            <Card>
              <CardContent className="p-8 animate-pulse">
                <div className="space-y-4">
                  <div className="h-20 bg-gray-200 rounded"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !epigram) {
    return (
      <div className="min-h-screen bg-bg-secondary">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              에피그램을 찾을 수 없습니다
            </h2>
            <p className="text-text-secondary mb-6">
              {error || "요청하신 에피그램이 존재하지 않습니다."}
            </p>
            <Link href="/epigramlist">
              <Button variant="primary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                목록으로 돌아가기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 작성자 여부 확인
  const isAuthor = user && user.id === epigram.writerId;

  return (
    <div className="min-h-screen bg-bg-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/epigramlist">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1" />
                목록으로
              </Button>
            </Link>

            <div className="flex items-center gap-2">
              {/* 공유 버튼 */}
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-1" />
                공유
              </Button>

              {/* 작성자만 수정/삭제 가능 */}
              {isAuthor && (
                <>
                  <Link href={`/epigramlist/${epigram.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit3 className="w-4 h-4 mr-1" />
                      수정
                    </Button>
                  </Link>
                  <Button variant="danger" size="sm" onClick={handleDelete}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    삭제
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* 에피그램 상세 정보 */}
          <Card>
            <CardContent className="p-8">
              {/* 에피그램 내용 */}
              <blockquote className="text-2xl font-serif text-text-primary leading-relaxed mb-6 text-center">
                &ldquo;{epigram.content}&rdquo;
              </blockquote>

              {/* 작가 정보 */}
              <div className="text-center mb-6">
                <p className="text-lg font-medium text-text-secondary">
                  - {epigram.author}
                </p>
                <p className="text-sm text-text-tertiary mt-1">
                  {formatDate(epigram.createdAt)}
                </p>
              </div>

              {/* 출처 링크 */}
              {epigram.referenceUrl && epigram.referenceTitle && (
                <div className="text-center mb-6">
                  <a
                    href={epigram.referenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary-600 hover:text-primary-800 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    {epigram.referenceTitle}
                  </a>
                </div>
              )}

              {/* 태그들 */}
              {epigram.tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {epigram.tags.map((tag, index) => (
                    <Link
                      key={index}
                      href={`/epigramlist?tag=${encodeURIComponent(tag)}`}
                      className="inline-block px-3 py-1 text-sm bg-primary-100 text-primary-800 rounded-full hover:bg-primary-200 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}

              {/* 액션 버튼들 */}
              <div className="flex items-center justify-center pt-6 border-t border-gray-200">
                {/* 좋아요 버튼 */}
                <button
                  onClick={handleLike}
                  disabled={!isAuthenticated || isLiking}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-lg transition-all",
                    epigram.isLiked
                      ? "bg-red-50 text-red-600 border border-red-200"
                      : "bg-gray-50 text-text-tertiary border border-gray-200 hover:bg-gray-100",
                    !isAuthenticated && "cursor-not-allowed opacity-50"
                  )}
                >
                  <Heart
                    className={cn(
                      "w-5 h-5 transition-all",
                      epigram.isLiked && "fill-current"
                    )}
                  />
                  <span className="font-medium">{epigram.likeCount}</span>
                </button>
              </div>

              {/* 로그인 안내 */}
              {!isAuthenticated && (
                <div className="text-center mt-4 text-text-tertiary text-sm">
                  <Link
                    href="/login"
                    className="text-primary-600 hover:text-primary-500"
                  >
                    로그인
                  </Link>
                  하시면 좋아요를 누르실 수 있습니다.
                </div>
              )}
            </CardContent>
          </Card>

          {/* 댓글 섹션 */}
          <CommentSection epigramId={epigramId} />
        </div>
      </div>
    </div>
  );
}
