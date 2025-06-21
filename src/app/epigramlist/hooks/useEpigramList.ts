import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useEpigrams } from "@/hooks";
import { useAuthStore } from "@/store/authStore";
import { useEpigramStore } from "@/store/epigramStore";
import { searchInText } from "../utils/highlightText";

export const useEpigramList = () => {
  const { epigrams, isLoading, hasMore, error, loadMore, refresh } =
    useEpigrams();
  const { isAuthenticated } = useAuthStore();
  const { setEpigrams } = useEpigramStore();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

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

  // 검색 필터링된 에피그램 목록
  const filteredEpigrams = useMemo(() => {
    if (!searchQuery.trim()) {
      return epigrams.filter((epigram) => epigram && epigram.id);
    }

    return epigrams.filter((epigram) => {
      if (!epigram || !epigram.id) return false;

      // 본문 내용에서 검색
      const contentMatch = searchInText(epigram.content, searchQuery);

      // 저자에서 검색
      const authorMatch = searchInText(epigram.author, searchQuery);

      // 태그에서 검색
      const tagMatch = epigram.tags.some((tag) =>
        searchInText(tag.name, searchQuery)
      );

      return contentMatch || authorMatch || tagMatch;
    });
  }, [epigrams, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return {
    // Data - 검색 필터링된 에피그램 사용
    epigrams: filteredEpigrams,
    originalEpigrams: epigrams,
    isLoading,
    hasMore,
    error,
    isAuthenticated,
    searchQuery,

    // Actions
    loadMore,
    refresh,
    handleEpigramClick,
    handleCreateEpigram,
    handleSearch,
  };
};
