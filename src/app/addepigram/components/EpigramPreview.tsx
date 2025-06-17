import { Eye } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

interface EpigramPreviewProps {
  content: string;
  author: string;
  referenceTitle?: string;
  referenceUrl?: string;
  tags: string[];
}

export function EpigramPreview({
  content,
  author,
  referenceTitle,
  referenceUrl,
  tags,
}: EpigramPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          미리보기
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* 에피그램 내용 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-lg text-gray-900 leading-relaxed mb-4">
              {content || "에피그램 내용을 입력해주세요..."}
            </p>
            <p className="text-right text-sm" style={{ color: "#ABB8CE" }}>
              - {author || "작가명"} -
            </p>
          </div>

          {/* 태그들 */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
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
          {(referenceTitle || referenceUrl) && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">출처</h3>
              {referenceTitle && (
                <p className="text-gray-900 mb-1">{referenceTitle}</p>
              )}
              {referenceUrl && (
                <a
                  href={referenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm break-all"
                >
                  {referenceUrl}
                </a>
              )}
            </div>
          )}

          {/* 안내 메시지 */}
          {!content && !author && (
            <div className="text-center py-8 text-gray-500">
              <p>왼쪽에서 에피그램을 작성하면</p>
              <p>여기서 미리보기를 확인할 수 있습니다.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
