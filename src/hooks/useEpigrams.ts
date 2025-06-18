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
      if (isLoadingRef.current) {
        console.log("이미 로딩 중이므로 중단");
        return;
      }

      console.log("loadEpigrams 호출:", {
        isLoadMore,
        nextCursor,
        currentEpigramsCount: epigrams.length,
      });

      isLoadingRef.current = true;
      setIsLoading(true);
      setError("");

      try {
        const params: { limit: number; cursor?: number } = {
          limit: ITEMS_PER_LOAD,
        };

        if (isLoadMore && nextCursor) {
          params.cursor = nextCursor;
          console.log("더보기 요청 - cursor 추가:", params.cursor);
        } else if (isLoadMore && !nextCursor) {
          console.log("더보기 요청이지만 nextCursor가 없음 - 요청 중단");
          isLoadingRef.current = false;
          setIsLoading(false);
          return;
        }

        console.log("API 호출 파라미터:", params);

        const response = await epigramService.getEpigrams(params);

        if (!response) {
          throw new Error("서버에서 응답을 받지 못했습니다.");
        }

        console.log("API 응답 받음:", {
          listLength: response.list?.length,
          nextCursor: response.nextCursor,
          totalCount: response.totalCount,
        });

        const epigramList = Array.isArray(response.list) ? response.list : [];

        if (isLoadMore) {
          console.log("더보기 모드 - 기존 목록에 추가");
          setEpigrams((prev) => {
            const newList = [...prev, ...epigramList];
            console.log("새로운 목록 길이:", newList.length);
            return newList;
          });
        } else {
          console.log("초기 로드 - 목록 교체");
          setEpigrams(epigramList);
        }

        setNextCursor(response.nextCursor || null);
        setHasMore(!!response.nextCursor);

        console.log("상태 업데이트 완료:", {
          newNextCursor: response.nextCursor,
          newHasMore: !!response.nextCursor,
        });
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
        console.log("로딩 완료");
      }
    },
    [nextCursor, epigrams.length]
  );

  const handleLoadMore = () => {
    console.log(
      "handleLoadMore 호출됨 - nextCursor:",
      nextCursor,
      "hasMore:",
      hasMore
    );
    if (hasMore && nextCursor) {
      loadEpigrams(true);
    } else {
      console.log(
        "더보기 불가능 - hasMore:",
        hasMore,
        "nextCursor:",
        nextCursor
      );
    }
  };

  const refresh = () => {
    console.log("refresh 호출됨");
    setEpigrams([]);
    setNextCursor(null);
    setHasMore(true);
    setError("");
    loadEpigrams(false);
  };

  // 새 에피그램을 목록 맨 앞에 추가
  const addEpigram = useCallback((newEpigram: Epigram) => {
    setEpigrams((prev) => [newEpigram, ...prev]);
  }, []);

  useEffect(() => {
    console.log("useEffect 실행 - 초기 로드");
    loadEpigrams(false);
  }, []); // loadEpigrams 의존성 제거

  return {
    epigrams,
    isLoading,
    hasMore,
    error,
    loadMore: handleLoadMore,
    refresh,
    addEpigram,
  };
};
