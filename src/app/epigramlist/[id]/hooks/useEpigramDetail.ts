import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { epigramService } from "@/lib/services/epigramService";
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
      console.log("좋아요 토글 시작:", {
        epigramId: epigram.id,
        currentIsLiked: epigram.isLiked,
      });

      const result = await epigramService.toggleLike(
        epigram.id,
        epigram.isLiked
      );

      console.log("좋아요 토글 결과:", result);

      // API가 전체 에피그램 객체를 반환하는 경우
      if (result && typeof result === "object" && "id" in result) {
        console.log("전체 에피그램 객체로 업데이트");
        setEpigram(result as Epigram);
      }
      // API가 좋아요 정보만 반환하는 경우
      else if (
        result &&
        typeof result === "object" &&
        ("isLiked" in result || "likeCount" in result)
      ) {
        console.log("좋아요 정보만으로 업데이트");
        setEpigram({
          ...epigram,
          isLiked: result.isLiked ?? !epigram.isLiked,
          likeCount: result.likeCount ?? epigram.likeCount,
        });
      }
      // fallback: 단순히 토글
      else {
        console.log("fallback: 단순 토글");
        setEpigram({
          ...epigram,
          isLiked: !epigram.isLiked,
          likeCount: epigram.isLiked
            ? epigram.likeCount - 1
            : epigram.likeCount + 1,
        });
      }
    } catch (err) {
      console.error("좋아요 처리 실패:", err);
      const errorMessage =
        err instanceof Error ? err.message : "좋아요 처리에 실패했습니다.";

      // 로그인 관련 에러인 경우 리다이렉트 또는 알림
      if (errorMessage.includes("로그인") || errorMessage.includes("인증")) {
        alert("로그인이 필요합니다.");
        router.push("/login");
      } else {
        alert(errorMessage);
      }
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
