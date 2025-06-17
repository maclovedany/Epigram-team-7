interface LoadMoreButtonProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}

export function LoadMoreButton({
  hasMore,
  isLoading,
  onLoadMore,
}: LoadMoreButtonProps) {
  if (!hasMore) return null;

  return (
    <div className="text-center mt-12">
      <button
        onClick={onLoadMore}
        disabled={isLoading}
        className="inline-flex items-center justify-center h-16 px-8 bg-[#f5f6fa] text-gray-700 rounded-full border border-[#CFDBEA] hover:bg-gray-200 transition-colors disabled:opacity-50 text-base font-semibold"
      >
        <span className="text-xl mr-2">+</span>
        {isLoading ? (
          <span className="text-[12px]">로딩 중...</span>
        ) : (
          <span className="text-[15px]">에피그램 더보기</span>
        )}
      </button>
    </div>
  );
}
