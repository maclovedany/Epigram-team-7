import Link from "next/link";
import { ArrowLeft, Share2, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui";

interface EpigramDetailHeaderProps {
  onShare: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  canEdit: boolean;
}

export function EpigramDetailHeader({
  onShare,
  onEdit,
  onDelete,
  canEdit,
}: EpigramDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <Link href="/epigramlist">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-1" />
          목록으로
        </Button>
      </Link>

      <div className="flex items-center gap-2">
        {/* 공유 버튼 */}
        <Button variant="outline" size="sm" onClick={onShare}>
          <Share2 className="w-4 h-4 mr-1" />
          공유
        </Button>

        {/* 작성자만 수정/삭제 가능 */}
        {canEdit && (
          <>
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit3 className="w-4 h-4 mr-1" />
                수정
              </Button>
            )}
            {onDelete && (
              <Button variant="outline" size="sm" onClick={onDelete}>
                <Trash2 className="w-4 h-4 mr-1" />
                삭제
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
