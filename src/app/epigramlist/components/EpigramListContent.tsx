import { useEpigramList } from "../hooks/useEpigramList";
import { EpigramCard } from "./EpigramCard";
import { LoadMoreButton, FloatingActionButton } from "./";
import { LoadingSpinner, ErrorMessage, EmptyState } from "@/components/ui";

export const EpigramListContent = () => {
  const {
    epigrams,
    isLoading,
    hasMore,
    error,
    isAuthenticated,
    handleEpigramClick,
    loadMore,
    refresh,
  } = useEpigramList();

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">피드</h1>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <ErrorMessage message={error} onRetry={refresh} className="mb-6" />
      )}

      {/* 에피그램 목록 - 2열 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {epigrams
          .filter((epigram) => epigram && epigram.id) // undefined 값과 id가 없는 항목 필터링
          .map((epigram) => (
            <EpigramCard
              key={epigram.id}
              epigram={epigram}
              onClick={() => handleEpigramClick(epigram.id)}
            />
          ))}
      </div>

      {/* 로딩 중 메시지 */}
      {isLoading && epigrams.length === 0 && (
        <div className="text-center py-12">
          <LoadingSpinner text="에피그램을 불러오는 중..." />
        </div>
      )}

      {/* 에피그램이 없는 경우 */}
      {!isLoading && epigrams.length === 0 && !error && (
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
