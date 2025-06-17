import { useRouter } from "next/navigation";
import { useEpigrams } from "@/hooks";
import { useAuthStore } from "@/store/authStore";

export const useEpigramList = () => {
  const { epigrams, isLoading, hasMore, error, loadMore, refresh } =
    useEpigrams();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleEpigramClick = (epigramId: number) => {
    router.push(`/epigramlist/${epigramId}`);
  };

  const handleCreateEpigram = () => {
    router.push("/addepigram");
  };

  return {
    // Data
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
