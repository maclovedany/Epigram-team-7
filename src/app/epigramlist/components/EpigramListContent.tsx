import { useEpigramList } from "../hooks/useEpigramList";
import { EpigramCard } from "./EpigramCard";
import { LoadMoreButton, FloatingActionButton } from "./";
import { SearchInput } from "./SearchInput";
import { LoadingSpinner, ErrorMessage, EmptyState } from "@/components/ui";

export const EpigramListContent = () => {
  const {
    epigrams,
    originalEpigrams,
    isLoading,
    hasMore,
    error,
    isAuthenticated,
    searchQuery,
    handleEpigramClick,
    loadMore,
    refresh,
    handleSearch,
  } = useEpigramList();

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">피드</h1>
      </div>

      {/* 검색 입력 */}
      <SearchInput onSearch={handleSearch} />

      {/* 에러 메시지 */}
      {error && (
        <ErrorMessage message={error} onRetry={refresh} className="mb-6" />
      )}

      {/* 에피그램 목록 - 2열 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {epigrams.map((epigram) => (
          <EpigramCard
            key={epigram.id}
            epigram={epigram}
            searchQuery={searchQuery}
            onClick={() => handleEpigramClick(epigram.id)}
          />
        ))}
      </div>

      {/* 로딩 중 메시지 */}
      {isLoading && originalEpigrams.length === 0 && (
        <div className="text-center py-12">
          <LoadingSpinner text="에피그램을 불러오는 중..." />
        </div>
      )}

      {/* 검색 결과가 없는 경우 */}
      {!isLoading &&
        searchQuery &&
        epigrams.length === 0 &&
        originalEpigrams.length > 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <p className="text-lg font-medium">검색 결과가 없습니다</p>
              <p className="text-sm mt-2">다른 검색어로 시도해보세요</p>
            </div>
          </div>
        )}

      {/* 에피그램이 없는 경우 */}
      {!isLoading && !searchQuery && epigrams.length === 0 && !error && (
        <EmptyState
          title="아직 등록된 에피그램이 없습니다."
          actionText="첫 번째 에피그램 만들기"
          actionHref={isAuthenticated ? "/addepigram" : "/login"}
        />
      )}

      {/* 더보기 버튼 */}
      <LoadMoreButton
        hasMore={hasMore}
        isLoading={isLoading}
        onLoadMore={loadMore}
      />

      {/* 플로팅 액션 버튼 */}
      <FloatingActionButton isAuthenticated={isAuthenticated} />
    </main>
  );
};
