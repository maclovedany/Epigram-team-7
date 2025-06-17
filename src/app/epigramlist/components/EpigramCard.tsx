import { Epigram } from "@/types";

interface EpigramCardProps {
  epigram: Epigram;
  onClick?: () => void;
}

export function EpigramCard({ epigram, onClick }: EpigramCardProps) {
  return (
    <div className="space-y-3 cursor-pointer" onClick={onClick}>
      {/* 에피그램 카드 */}
      <div
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        style={{
          backgroundImage: `linear-gradient(to right, #f8f9fa 0%, #ffffff 100%)`,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
        }}
      >
        {/* 에피그램 내용 */}
        <div className="mb-6">
          <p className="text-lg text-gray-900 leading-relaxed mb-4">
            {epigram.content}
          </p>
          <p className="text-right text-sm" style={{ color: "#ABB8CE" }}>
            - {epigram.author} -
          </p>
        </div>
      </div>

      {/* 태그들 - 카드 다음줄 우측 하단 */}
      <div className="flex flex-wrap gap-2 justify-end">
        {epigram.tags.map((tag, index) => (
          <span
            key={index}
            className="inline-block px-3 py-1 text-sm"
            style={{ color: "#ABB8CE" }}
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}
