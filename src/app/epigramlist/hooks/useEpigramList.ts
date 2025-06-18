import React from "react";
import { useRouter } from "next/navigation";
import { useEpigrams } from "@/hooks";
import { useAuthStore } from "@/store/authStore";
import { useEpigramStore } from "@/store/epigramStore";

export const useEpigramList = () => {
  const { epigrams, isLoading, hasMore, error, loadMore, refresh } =
    useEpigrams();
  const { isAuthenticated } = useAuthStore();
  const { epigrams: storeEpigrams, setEpigrams } = useEpigramStore();
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
    // Data - 스토어의 에피그램을 우선 사용, 없으면 훅의 에피그램 사용
    epigrams: storeEpigrams.length > 0 ? storeEpigrams : epigrams,
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
