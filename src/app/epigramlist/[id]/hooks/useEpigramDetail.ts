import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { epigramService } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Epigram } from "@/types";

export function useEpigramDetail() {
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
    const shareText = `"${epigram.content}" - ${epigram.author}`;

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

  // 작성자 여부 확인
  const isAuthor = user && epigram && user.id === epigram.writerId;

  return {
    // State
    epigram,
    isLoading,
    isLiking,
    error,
    isAuthenticated,
    isAuthor,

    // Handlers
    handleLike,
    handleDelete,
    handleShare,
  };
}
