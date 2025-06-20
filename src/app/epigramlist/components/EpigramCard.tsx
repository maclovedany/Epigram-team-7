import { Epigram, Tag } from "@/types";
import { highlightText } from "../utils/highlightText";

interface EpigramCardProps {
  epigram: Epigram;
  onClick?: () => void;
  searchQuery?: string;
}

export function EpigramCard({
  epigram,
  onClick,
  searchQuery = "",
}: EpigramCardProps) {
  return (
    <div className="space-y-3 cursor-pointer" onClick={onClick}>
      {/* 에피그램 카드 */}
      <div
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col h-40"
        style={{
          backgroundImage: `url('/notebook-bg.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* 에피그램 내용 */}
        <div className="flex-grow overflow-hidden">
          <p className="text-lg text-gray-900 leading-relaxed">
            {highlightText(epigram.content, searchQuery)}
          </p>
        </div>

        {/* 저자 */}
        <div>
          <p className="text-right text-sm" style={{ color: "#ABB8CE" }}>
            - {highlightText(epigram.author, searchQuery)} -
          </p>
        </div>
      </div>

      {/* 태그들 - 카드 다음줄 우측 하단 */}
      <div className="flex flex-wrap gap-2 justify-end">
        {epigram.tags.map((tag: Tag) => (
          <span
            key={tag.id}
            className="inline-block px-3 py-1 text-sm"
            style={{ color: "#ABB8CE" }}
          >
            #{highlightText(tag.name, searchQuery)}
          </span>
        ))}
      </div>
    </div>
  );
}
