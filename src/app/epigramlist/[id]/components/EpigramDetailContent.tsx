import { Heart, ExternalLink } from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";
import { Epigram } from "@/types";

interface EpigramDetailContentProps {
  epigram: Epigram;
  isLiking: boolean;
  onLike: () => void;
}

export function EpigramDetailContent({
  epigram,
  isLiking,
  onLike,
}: EpigramDetailContentProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardContent className="p-8">
        {/* 에피그램 내용 */}
        <div className="mb-8">
          <p className="text-2xl text-gray-900 leading-relaxed mb-6">
            {epigram.content}
          </p>
          <p className="text-right text-lg" style={{ color: "#ABB8CE" }}>
            - {epigram.author} -
          </p>
        </div>

        {/* 태그들 */}
        {epigram.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {epigram.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block px-3 py-1 text-sm bg-gray-100 rounded-full"
                style={{ color: "#ABB8CE" }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 출처 정보 */}
        {(epigram.referenceTitle || epigram.referenceUrl) && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">출처</h3>
            {epigram.referenceTitle && (
              <p className="text-gray-900 mb-1">{epigram.referenceTitle}</p>
            )}
            {epigram.referenceUrl && (
              <a
                href={epigram.referenceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                링크 보기
              </a>
            )}
          </div>
        )}

        {/* 액션 버튼들 */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onLike}
              disabled={isLiking}
              className="flex items-center gap-2"
            >
              <Heart
                className={`w-5 h-5 ${
                  epigram.isLiked
                    ? "fill-red-500 text-red-500"
                    : "text-gray-400"
                }`}
              />
              <span className="text-sm">
                {epigram.likeCount > 0 ? epigram.likeCount : ""}
              </span>
            </Button>
          </div>

          <div className="text-sm text-gray-500">
            {formatDate(epigram.createdAt)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
