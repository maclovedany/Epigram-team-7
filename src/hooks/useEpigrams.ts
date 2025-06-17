import { useState, useEffect, useCallback, useRef } from "react";
import { epigramService } from "@/lib/services";
import { Epigram } from "@/types";

const ITEMS_PER_LOAD = 6;

export const useEpigrams = () => {
  const [epigrams, setEpigrams] = useState<Epigram[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string>("");

  const isLoadingRef = useRef(false);

  const loadEpigrams = useCallback(
    async (isLoadMore = false) => {
      if (isLoadingRef.current) return;

      isLoadingRef.current = true;
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

        if (!response) {
          throw new Error("서버에서 응답을 받지 못했습니다.");
        }

        const epigramList = Array.isArray(response.list) ? response.list : [];

        if (isLoadMore) {
          setEpigrams((prev) => [...prev, ...epigramList]);
        } else {
          setEpigrams(epigramList);
        }

        setNextCursor(response.nextCursor || null);
        setHasMore(!!response.nextCursor);
      } catch (error) {
        let errorMessage = "에피그램을 불러오는데 실패했습니다.";

        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === "object" && error !== null) {
          const axiosError = error as unknown as {
            response?: {
              data?: { message?: string };
              status?: number;
              statusText?: string;
            };
            message?: string;
          };
          if (axiosError.response?.data?.message) {
            errorMessage = axiosError.response.data.message;
          } else if (axiosError.response?.status) {
            errorMessage = `서버 오류 (${axiosError.response.status}): ${
              axiosError.response.statusText || "알 수 없는 오류"
            }`;
          } else if (axiosError.message) {
            errorMessage = axiosError.message;
          }
        }

        setError(errorMessage);
        console.error("에피그램 로딩 실패:", error);

        if (!isLoadMore) {
          setEpigrams([]);
        }
      } finally {
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    },
    [nextCursor]
  );

  const handleLoadMore = () => {
    loadEpigrams(true);
  };

  const refresh = () => {
    setEpigrams([]);
    setNextCursor(null);
    setHasMore(true);
    setError("");
    loadEpigrams(false);
  };

  useEffect(() => {
    loadEpigrams(false);
  }, []);

  return {
    epigrams,
    isLoading,
    hasMore,
    error,
    loadMore: handleLoadMore,
    refresh,
  };
};
