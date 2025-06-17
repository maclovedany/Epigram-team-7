import { Heart, ExternalLink } from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";
import { Epigram } from "@/types";
import { cn } from "@/lib/utils";

interface EpigramDetailContentProps {
  epigram: Epigram;
  isAuthenticated: boolean;
  isLiking: boolean;
  onLike: () => void;
}

export default function EpigramDetailContent({
  epigram,
  isAuthenticated,
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
        <blockquote className="text-2xl font-medium leading-relaxed text-text-primary mb-6 text-center italic">
          "{epigram.content}"
        </blockquote>

        {/* 작가 정보 */}
        <div className="text-right mb-6">
          <p className="text-lg text-text-secondary font-medium">
            - {epigram.author} -
          </p>
          {epigram.createdAt && (
            <p className="text-sm text-text-tertiary mt-1">
              {formatDate(epigram.createdAt)}
            </p>
          )}
        </div>

        {/* 출처 정보 */}
        {(epigram.referenceTitle || epigram.referenceUrl) && (
          <div className="bg-bg-secondary p-4 rounded-lg mb-6">
            <h3 className="text-sm font-semibold text-text-secondary mb-2">
              출처
            </h3>
            {epigram.referenceTitle && (
              <p className="text-text-primary mb-1">{epigram.referenceTitle}</p>
            )}
            {epigram.referenceUrl && (
              <a
                href={epigram.referenceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
              >
                <ExternalLink className="w-3 h-3" />
                링크 보기
              </a>
            )}
          </div>
        )}

        {/* 태그 */}
        {epigram.tags && epigram.tags.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {epigram.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 좋아요 및 통계 */}
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onLike}
                disabled={isLiking}
                className={cn(
                  "flex items-center gap-2",
                  epigram.isLiked && "text-red-500"
                )}
              >
                <Heart
                  className={cn("w-5 h-5", epigram.isLiked && "fill-current")}
                />
                <span>{epigram.likeCount || 0}</span>
              </Button>
            )}

            {!isAuthenticated && (
              <div className="flex items-center gap-2 text-text-secondary">
                <Heart className="w-5 h-5" />
                <span>{epigram.likeCount || 0}</span>
              </div>
            )}
          </div>

          {/* 작성자 정보 */}
          <div className="text-sm text-text-secondary">
            작성자: {epigram.writerId}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
