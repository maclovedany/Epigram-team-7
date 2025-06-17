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
        className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
      >
        <span className="mr-2">+</span>
        {isLoading ? "로딩 중..." : "에피그램 더보기"}
      </button>
    </div>
  );
}
