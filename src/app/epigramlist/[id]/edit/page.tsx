"use client";

import Header from "@/components/layout/Header";
import { Loader2 } from "lucide-react";
import { EditForm } from "./components";
import { useEditEpigram } from "./hooks";

export default function EditEpigramPage() {
  const { isLoading, error, epigram } = useEditEpigram();

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-xl mx-auto py-12">
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-left">에피그램 수정하기</h1>
          </div>
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-500" />
            <p className="text-gray-500">에피그램을 불러오는 중...</p>
          </div>
        </main>
      </div>
    );
  }

  // 에러 또는 권한 없음
  if (error || !epigram) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-xl mx-auto py-12">
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-left">에피그램 수정하기</h1>
          </div>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              에피그램을 수정할 수 없습니다
            </h2>
            <p className="text-gray-500 mb-6">
              {error || "에피그램을 찾을 수 없거나 권한이 없습니다."}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-xl mx-auto py-12">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-left">에피그램 수정하기</h1>
        </div>
        <EditForm />
      </main>
    </div>
  );
}
