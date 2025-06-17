import { useState, useEffect, useCallback } from "react";
import { epigramService } from "@/lib/api";
import { Epigram } from "@/types";

const ITEMS_PER_LOAD = 6;

export function useEpigrams() {
  const [epigrams, setEpigrams] = useState<Epigram[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string>("");

  const loadEpigrams = useCallback(
    async (isLoadMore = false) => {
      if (isLoading) return;

      setIsLoading(true);
      setError("");

      try {
        const params: { limit: number; cursor?: number } = {
          limit: ITEMS_PER_LOAD,
        };

        if (isLoadMore && nextCursor) {
          params.cursor = nextCursor;
        }

        const response = await epigramService.getEpigrams(params);

        if (isLoadMore) {
          setEpigrams((prev) => [...prev, ...response.list]);
        } else {
          setEpigrams(response.list);
        }

        setNextCursor(response.nextCursor || null);
        setHasMore(!!response.nextCursor);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "에피그램을 불러오는데 실패했습니다.";
        setError(errorMessage);
        console.error("에피그램 로딩 실패:", errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, nextCursor]
  );

  const handleLoadMore = useCallback(() => {
    loadEpigrams(true);
  }, [loadEpigrams]);

  useEffect(() => {
    loadEpigrams(false);
  }, [loadEpigrams]);

  return {
    epigrams,
    isLoading,
    hasMore,
    error,
    handleLoadMore,
  };
}
