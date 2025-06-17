import { EpigramCard } from "./EpigramCard";
import { LoadingSpinner, ErrorMessage, EmptyState } from "@/components/ui";
import { Epigram } from "@/types";

interface EpigramListContentProps {
  epigrams: Epigram[];
  isLoading: boolean;
  hasMore: boolean;
  error: string;
  isAuthenticated: boolean;
  onEpigramClick: (epigramId: number) => void;
  onLoadMore: () => void;
  onRefresh: () => void;
}

export const EpigramListContent = ({
  epigrams,
  isLoading,
  hasMore,
  error,
  isAuthenticated,
  onEpigramClick,
  onLoadMore,
  onRefresh,
}: EpigramListContentProps) => {
  return (
    <>
      {/* 에러 메시지 */}
      {error && (
        <ErrorMessage message={error} onRetry={onRefresh} className="mb-6" />
      )}

      {/* 에피그램 목록 - 2열 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {epigrams.map((epigram) => (
          <EpigramCard
            key={epigram.id}
            epigram={epigram}
            onClick={() => onEpigramClick(epigram.id)}
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
      {hasMore && epigrams.length > 0 && (
        <div className="text-center mt-12">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" />
                <span className="ml-2">로딩 중...</span>
              </>
            ) : (
              <>
                <span className="mr-2">+</span>
                에피그램 더보기
              </>
            )}
          </button>
        </div>
      )}
    </>
  );
};
