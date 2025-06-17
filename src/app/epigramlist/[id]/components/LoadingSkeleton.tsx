import { Card, CardContent } from "@/components/ui";

export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-bg-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 헤더 스켈레톤 */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-40 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* 에피그램 스켈레톤 */}
          <Card>
            <CardContent className="p-8 animate-pulse">
              <div className="space-y-4">
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
