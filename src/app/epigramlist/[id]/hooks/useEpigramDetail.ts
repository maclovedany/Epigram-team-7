import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { epigramService } from "@/lib/services/epigramService";
import { useAuthStore } from "@/store/authStore";
import { Epigram } from "@/types";
import { useLikeToggle } from "./useLikeToggle";
import { useEpigramActions } from "./useEpigramActions";

export function useEpigramDetail() {
  const [epigram, setEpigram] = useState<Epigram | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const params = useParams();
  const { isAuthenticated, user } = useAuthStore();

  const epigramId = params.id as string;

  // 분리된 훅들 사용
  const { isLiking, toggleLike } = useLikeToggle();
  const { deleteEpigram, shareEpigram } = useEpigramActions();

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

  // 좋아요 핸들러
  const handleLike = async () => {
    if (!epigram) return;
    await toggleLike(epigram, setEpigram);
  };

  // 삭제 핸들러
  const handleDelete = async () => {
    if (!epigram) return;
    await deleteEpigram(epigram);
  };

  // 공유 핸들러
  const handleShare = async () => {
    if (!epigram) return;
    await shareEpigram(epigram);
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
