"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import { useAuthStore } from "@/store/authStore";
import { epigramService } from "@/lib/api";
import { Epigram } from "@/types";
import { LoadMoreButton, FloatingActionButton } from "./components";
import { useRouter } from "next/navigation";

const ITEMS_PER_LOAD = 6;

const MOCK_EPIGRAMS = Array.from({ length: 20 }).map((_, i) => ({
  id: i + 1,
  content: `오랫동안 꿈을 그리는 사람은 마침내 그 꿈을 닮아 간다. (${i + 1})`,
  author: "앙드레 말로",
  tags: ["나아가야할때", "꿈을이루고싶을때"],
}));

export default function EpigramListPage() {
  const [visibleCount, setVisibleCount] = useState(10);
  const epigrams = MOCK_EPIGRAMS.slice(0, visibleCount);
  const isAuthenticated = true;
  const isLoading = false; // 목업이므로 항상 false
  const hasMore = visibleCount < MOCK_EPIGRAMS.length;
  const router = useRouter();

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 10, MOCK_EPIGRAMS.length));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">피드</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {epigrams.map((epigram) => (
            <div
              key={epigram.id}
              className="space-y-3 cursor-pointer"
              onClick={() => router.push(`/epigrams/${epigram.id}`)}
            >
              <div
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative"
                style={{
                  backgroundImage: "url('/notebook-bg.png')",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="mb-6">
                  <p className="text-lg text-gray-900 leading-relaxed mb-4">
                    {epigram.content}
                  </p>
                </div>
                <div className="w-full flex justify-end">
                  <p
                    className="text-right text-sm mt-2"
                    style={{ color: "#ABB8CE" }}
                  >
                    - {epigram.author} -
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                {epigram.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block px-3 py-1 text-sm"
                    style={{ color: "#ABB8CE" }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <LoadMoreButton
          hasMore={hasMore}
          isLoading={isLoading}
          onLoadMore={handleLoadMore}
        />
      </main>
      <FloatingActionButton isAuthenticated={isAuthenticated} />
    </div>
  );
}
