"use client";

import Header from "@/components/layout/Header";
import CommentSection from "@/components/epigram/CommentSection";
import {
  EpigramDetailHeader,
  EpigramDetailContent,
  LoadingSkeleton,
  ErrorState,
} from "./components";
import { useEpigramDetail } from "./hooks";

export default function EpigramDetailPage() {
  const {
    epigram,
    isLoading,
    isLiking,
    error,
    isAuthenticated,
    isAuthor,
    handleLike,
    handleDelete,
    handleShare,
  } = useEpigramDetail();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !epigram) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* 메인 콘텐츠 */}
      <div>
        <EpigramDetailContent
          epigram={epigram}
          isAuthenticated={isAuthenticated}
          isAuthor={!!isAuthor}
          isLiking={isLiking}
          onLike={handleLike}
          onEdit={() => {
            // TODO: 수정 페이지로 이동
            window.location.href = `/epigramlist/${epigram.id}/edit`;
          }}
          onDelete={handleDelete}
        />

        <CommentSection epigramId={epigram.id.toString()} />
      </div>
    </div>
  );
}
