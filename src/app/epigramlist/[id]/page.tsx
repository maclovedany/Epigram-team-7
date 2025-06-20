"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { CommentSection } from "@/components/ui";
import {
  EpigramDetailContent,
  LoadingSkeleton,
  ErrorState,
} from "./components";
import { useEpigramDetail } from "./hooks";

export default function EpigramDetailPage() {
  const router = useRouter();
  const {
    epigram,
    isLoading,
    isLiking,
    error,
    isAuthenticated,
    isAuthor,
    handleLike,
    handleDelete,
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
            router.push(`/epigramlist/${epigram.id}/edit`);
          }}
          onDelete={handleDelete}
        />

        <CommentSection epigramId={epigram.id.toString()} />
      </div>
    </div>
  );
}
