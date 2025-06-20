import { useState } from "react";
import { useRouter } from "next/navigation";
import { epigramService } from "@/lib/services/epigramService";
import { useAuthStore } from "@/store/authStore";
import { Epigram } from "@/types";

export function useLikeToggle() {
  const [isLiking, setIsLiking] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const toggleLike = async (
    epigram: Epigram,
    onUpdate: (updatedEpigram: Epigram) => void
  ) => {
    if (!isAuthenticated || !epigram || isLiking) return;

    try {
      setIsLiking(true);
      const result = await epigramService.toggleLike(epigram.id);

      // API가 전체 에피그램 객체를 반환하는 경우
      if (result && typeof result === "object" && "id" in result) {
        onUpdate(result as Epigram);
      }
      // API가 좋아요 정보만 반환하는 경우
      else if (
        result &&
        typeof result === "object" &&
        ("isLiked" in result || "likeCount" in result)
      ) {
        onUpdate({
          ...epigram,
          isLiked: result.isLiked ?? !epigram.isLiked,
          likeCount: result.likeCount ?? epigram.likeCount,
        });
      }
      // fallback: 단순히 토글
      else {
        onUpdate({
          ...epigram,
          isLiked: !epigram.isLiked,
          likeCount: epigram.isLiked
            ? epigram.likeCount - 1
            : epigram.likeCount + 1,
        });
      }
    } catch (err) {
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

  return {
    isLiking,
    toggleLike,
  };
}
