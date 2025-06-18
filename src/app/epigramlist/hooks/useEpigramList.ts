import React from "react";
import { useRouter } from "next/navigation";
import { useEpigrams } from "@/hooks";
import { useAuthStore } from "@/store/authStore";
import { useEpigramStore } from "@/store/epigramStore";

export const useEpigramList = () => {
  const { epigrams, isLoading, hasMore, error, loadMore, refresh } =
    useEpigrams();
  const { isAuthenticated } = useAuthStore();
  const { setEpigrams } = useEpigramStore();
  const router = useRouter();

  // 에피그램 목록이 로드되면 스토어에도 저장
  React.useEffect(() => {
    if (epigrams.length > 0) {
      // 유효한 에피그램만 스토어에 저장
      const validEpigrams = epigrams.filter((epigram) => epigram && epigram.id);
      if (validEpigrams.length > 0) {
        setEpigrams(validEpigrams);
      }
    }
  }, [epigrams, setEpigrams]);

  const handleEpigramClick = (epigramId: number) => {
    router.push(`/epigramlist/${epigramId}`);
  };

  const handleCreateEpigram = () => {
    router.push("/addepigram");
  };

  return {
    // Data - 훅의 에피그램을 직접 사용 (스토어는 캐싱용으로만 사용)
    epigrams,
    isLoading,
    hasMore,
    error,
    isAuthenticated,

    // Actions
    loadMore,
    refresh,
    handleEpigramClick,
    handleCreateEpigram,
  };
};
