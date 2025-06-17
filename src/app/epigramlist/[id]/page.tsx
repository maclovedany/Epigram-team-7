"use client";

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
    <div className="min-h-screen bg-bg-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <EpigramDetailHeader
            isAuthor={!!isAuthor}
            onShare={handleShare}
            onDelete={handleDelete}
            epigramId={epigram.id.toString()}
          />

          <EpigramDetailContent
            epigram={epigram}
            isAuthenticated={isAuthenticated}
            isLiking={isLiking}
            onLike={handleLike}
          />

          <CommentSection epigramId={epigram.id.toString()} />
        </div>
      </div>
    </div>
  );
}
