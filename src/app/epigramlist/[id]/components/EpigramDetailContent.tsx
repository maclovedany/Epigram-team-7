import { MoreVertical, Edit3, Trash2 } from "lucide-react";
import { Epigram, Tag } from "@/types";
import { useState } from "react";

interface EpigramDetailContentProps {
  epigram: Epigram;
  isAuthenticated: boolean;
  isAuthor: boolean;
  isLiking: boolean;
  onLike: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function EpigramDetailContent({
  epigram,
  isAuthenticated,
  isAuthor,
  isLiking,
  onLike,
  onEdit,
  onDelete,
}: EpigramDetailContentProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div
      className="w-full py-8"
      style={{
        backgroundImage: `repeating-linear-gradient(
          transparent,
          transparent 31px,
          #F2F2F2 31px,
          #F2F2F2 32px
        )`,
      }}
    >
      {/* 메인 에피그램 카드 */}
      <div className="max-w-[640px] mx-auto px-4">
        <div className="bg-transparent p-8">
          {/* 상단 헤더 - 태그와 드롭다운 */}
          <div className="flex justify-between items-start mb-6">
            {/* 태그 */}
            <div className="flex flex-wrap gap-2">
              {epigram.tags &&
                epigram.tags.map((tag: Tag) => (
                  <span key={tag.id} className="text-sm text-gray-500">
                    #{tag.name}
                  </span>
                ))}
            </div>

            {/* 세로 케밥 메뉴 (작성자만) */}
            {isAuthor && (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <MoreVertical className="w-5 h-5 text-gray-500" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                    <button
                      onClick={() => {
                        onEdit?.();
                        setShowDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      수정하기
                    </button>
                    <button
                      onClick={() => {
                        onDelete?.();
                        setShowDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                      삭제하기
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 에피그램 내용 - 좌측 정렬 */}
          <div className="mb-8">
            <p className="text-2xl leading-relaxed text-gray-900 mb-4 text-left">
              {epigram.content}
            </p>
            {/* 저자 - 우측 정렬 */}
            <p className="text-lg text-gray-500 text-right">
              - {epigram.author} -
            </p>
          </div>

          {/* 좋아요 버튼과 출처 - 가운데 정렬 */}
          <div className="flex items-center justify-center gap-4">
            {/* 좋아요 버튼 */}
            {isAuthenticated ? (
              <button
                onClick={onLike}
                disabled={isLiking}
                className="flex items-center gap-2 px-4 py-2 h-10 bg-black text-white rounded-full transition-colors hover:bg-gray-800"
              >
                <img src="/like.png" alt="좋아요" className="w-5 h-5" />
                <span>{epigram.likeCount || 0}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 h-10 bg-black text-white rounded-full">
                <img src="/like.png" alt="좋아요" className="w-5 h-5" />
                <span>{epigram.likeCount || 0}</span>
              </div>
            )}

            {/* 출처 버튼 */}
            {(epigram.referenceTitle || epigram.referenceUrl) && (
              <button
                onClick={() => {
                  if (epigram.referenceUrl) {
                    // URL이 http:// 또는 https://로 시작하지 않으면 추가
                    const url = epigram.referenceUrl.startsWith("http")
                      ? epigram.referenceUrl
                      : `https://${epigram.referenceUrl}`;
                    window.open(url, "_blank", "noopener,noreferrer");
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 h-10 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                disabled={!epigram.referenceUrl}
              >
                <span className="text-sm">
                  {epigram.referenceTitle || "출처"}
                </span>
                <img src="/md.png" alt="출처" className="w-4 h-4 filter-none" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
