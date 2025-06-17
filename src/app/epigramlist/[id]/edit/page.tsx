"use client";

import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";
import { EditForm } from "./components";
import { useEditEpigram } from "./hooks";

export default function EditEpigramPage() {
  const { isLoading, error, epigram } = useEditEpigram();

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-secondary">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* 헤더 스켈레톤 */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-40 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* 로딩 메시지 */}
            <Card>
              <CardContent className="p-8 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-500" />
                <p className="text-text-secondary">에피그램을 불러오는 중...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // 에러 또는 권한 없음
  if (error || !epigram) {
    return (
      <div className="min-h-screen bg-bg-secondary">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              에피그램을 수정할 수 없습니다
            </h2>
            <p className="text-text-secondary mb-6">
              {error || "에피그램을 찾을 수 없습니다."}
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/epigramlist">
                <Button variant="outline">목록으로 돌아가기</Button>
              </Link>
              {epigram && (
                <Link href={`/epigramlist/${epigram.id}`}>
                  <Button variant="primary">상세 페이지로 이동</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/epigramlist/${epigram.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" />
              돌아가기
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">에피그램 수정</h1>
          </div>
        </div>

        <div className="max-w-xl mx-auto">
          <EditForm />
        </div>
      </div>
    </div>
  );
}
