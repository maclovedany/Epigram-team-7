"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import { useAuthStore } from "@/store/authStore";
import { epigramService } from "@/lib/api";
import { Epigram } from "@/types";
import { FloatingActionButton } from "./components";

const ITEMS_PER_LOAD = 6;

export default function EpigramListPage() {
  const [epigrams, setEpigrams] = useState<Epigram[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string>("");
  const { isAuthenticated } = useAuthStore();

  // 로딩 상태를 ref로 관리하여 의존성 배열에서 제외
  const isLoadingRef = useRef(false);

  // 에피그램 목록 로드
  const loadEpigrams = useCallback(
    async (isLoadMore = false) => {
      // ref를 사용하여 로딩 상태 체크
      if (isLoadingRef.current) return;

      isLoadingRef.current = true;
      setIsLoading(true);
      setError("");

      try {
        const params: { limit: number; cursor?: number } = {
          limit: ITEMS_PER_LOAD,
        };

        // 더보기인 경우 cursor 추가
        if (isLoadMore && nextCursor) {
          params.cursor = nextCursor;
        }

        const response = await epigramService.getEpigrams(params);

        // 응답 데이터 안전성 검사
        if (!response) {
          throw new Error("서버에서 응답을 받지 못했습니다.");
        }

        // list가 배열인지 확인
        const epigramList = Array.isArray(response.list) ? response.list : [];

        if (isLoadMore) {
          // 더보기인 경우 기존 목록에 추가
          setEpigrams((prev) => [...prev, ...epigramList]);
        } else {
          // 초기 로드인 경우 새로 설정
          setEpigrams(epigramList);
        }

        setNextCursor(response.nextCursor || null);
        setHasMore(!!response.nextCursor);
      } catch (error) {
        let errorMessage = "에피그램을 불러오는데 실패했습니다.";

        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === "object" && error !== null) {
          // axios 에러 객체 처리
          const axiosError = error as any;
          if (axiosError.response?.data?.message) {
            errorMessage = axiosError.response.data.message;
          } else if (axiosError.response?.status) {
            errorMessage = `서버 오류 (${axiosError.response.status}): ${
              axiosError.response.statusText || "알 수 없는 오류"
            }`;
          } else if (axiosError.message) {
            errorMessage = axiosError.message;
          }
        }

        setError(errorMessage);
        console.error("에피그램 로딩 실패:", error);

        // 네트워크 오류나 서버 오류 시 빈 배열로 설정
        if (!isLoadMore) {
          setEpigrams([]);
        }
      } finally {
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    },
    [nextCursor] // isLoading 제거, nextCursor만 유지
  );

  // 더보기 버튼 클릭
  const handleLoadMore = () => {
    loadEpigrams(true);
  };

  // 초기 로드 - 한 번만 실행되도록 빈 의존성 배열 사용
  useEffect(() => {
    loadEpigrams(false);
  }, []); // loadEpigrams 의존성 제거

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* 페이지 제목 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">피드</h1>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => loadEpigrams(false)}
              className="mt-2 text-sm text-red-700 underline hover:no-underline"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* 에피그램 목록 - 2열 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {epigrams.map((epigram) => (
            <div key={epigram.id} className="space-y-3">
              {/* 에피그램 카드 */}
              <div
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                style={{
                  backgroundImage: `linear-gradient(to right, #f8f9fa 0%, #ffffff 100%)`,
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                }}
              >
                {/* 에피그램 내용 */}
                <div className="mb-6">
                  <p className="text-lg text-gray-900 leading-relaxed mb-4">
                    {epigram.content}
                  </p>
                  <p
                    className="text-right text-sm"
                    style={{ color: "#ABB8CE" }}
                  >
                    - {epigram.author} -
                  </p>
                </div>
              </div>

              {/* 태그들 - 카드 다음줄 우측 하단 */}
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

        {/* 로딩 중 메시지 */}
        {isLoading && epigrams.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mr-3"></div>
              <p className="text-gray-500">에피그램을 불러오는 중...</p>
            </div>
          </div>
        )}

        {/* 에피그램이 없는 경우 */}
        {!isLoading && epigrams.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500">아직 등록된 에피그램이 없습니다.</p>
            {isAuthenticated && (
              <Link href="/addepigram">
                <button className="mt-4 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  첫 번째 에피그램 만들기
                </button>
              </Link>
            )}
          </div>
        )}

        {/* 더보기 버튼 */}
        {hasMore && epigrams.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 mr-2"></div>
                  로딩 중...
                </>
              ) : (
                <>
                  <span className="mr-2">+</span>
                  에피그램 더보기
                </>
              )}
            </button>
          </div>
        )}
      </main>

      {/* 플로팅 작성 버튼 */}
      {isAuthenticated && (
        <Link href="/addepigram">
          <button className="fixed bottom-6 right-6 bg-gray-800 text-white p-4 rounded-full shadow-lg hover:bg-gray-700 transition-colors z-50">
            <span className="text-xl">+</span>
            <span className="ml-2 text-sm">에피그램 만들기</span>
          </button>
        </Link>
      )}
    </div>
  );
}
