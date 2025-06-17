"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/layout/Header";
import { epigramService } from "@/lib/services/epigramService";

// 목업 데이터
const MOCK_EPIGRAM = {
  id: 1,
  content: "오랫동안 꿈을 그리는 사람은 마침내 그 꿈을 닮아 간다.",
  author: "앙드레 말로",
  tags: ["꿈을이루고싶을때", "나아가야할때"],
  referenceTitle: "앙드레 가는길",
  referenceUrl: "https://naver.com",
  likeCount: 123,
  isMine: true,
};
const MOCK_COMMENTS = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  user: {
    id: i % 2 === 0 ? 1 : 2,
    nickname: i % 2 === 0 ? "김코드" : "핑크냥이",
    image: i % 2 === 0 ? "/profile1.png" : "/profile2.png",
  },
  createdAt: `${i + 1}시간 전`,
  content:
    "오늘 하루 우울했었는데 덕분에 많은 힘 얻고 갑니다. 연금술사 책 다시 사서 오랜만에 읽어봐야겠어요!",
  isMine: i % 2 === 0,
}));

export default function EpigramDetailPage() {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(MOCK_COMMENTS.slice(0, 3));
  const [page, setPage] = useState(1);
  const [showProfile, setShowProfile] = useState<null | number>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [likeCount, setLikeCount] = useState(MOCK_EPIGRAM.likeCount);
  const [isLiked, setIsLiked] = useState(false);

  // 무한스크롤(IntersectionObserver)
  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new window.IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && comments.length < MOCK_COMMENTS.length) {
        const next = MOCK_COMMENTS.slice(0, (page + 1) * 3);
        setComments(next);
        setPage((p) => p + 1);
      }
    });
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [comments, page]);

  // 댓글 등록
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setComments([
      {
        id: Date.now(),
        user: { id: 1, nickname: "김코드", image: "/profile1.png" },
        createdAt: "방금 전",
        content: comment,
        isMine: true,
      },
      ...comments,
    ]);
    setComment("");
  };

  // 댓글 삭제
  const handleDeleteComment = (id: number) => {
    setComments(comments.filter((c) => c.id !== id));
  };

  // 좋아요 토글
  const handleLike = async () => {
    try {
      const result = await epigramService.toggleLike(MOCK_EPIGRAM.id, isLiked);
      setLikeCount(result.likeCount);
      setIsLiked(result.isLiked);
    } catch {
      // 에러 처리 필요시 추가
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <Header />
      <main className="max-w-3xl mx-auto py-10 px-4">
        {/* 태그 */}
        <div className="flex gap-2 mb-2">
          {MOCK_EPIGRAM.tags.map((tag) => (
            <span key={tag} className="text-[#ABB8CE] text-sm">
              #{tag}
            </span>
          ))}
        </div>
        {/* 카드 배경 */}
        <div
          className="relative bg-white rounded-xl border p-10 mb-6"
          style={{
            backgroundImage: "url('/notebook-bg.png')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* 본문 */}
          <div className="text-2xl font-serif mb-6 whitespace-pre-line">
            {MOCK_EPIGRAM.content}
          </div>
          <div className="flex justify-end text-[#ABB8CE] text-base mb-2">
            - {MOCK_EPIGRAM.author} -
          </div>
          {/* 좋아요/왕도로 가는 길 중앙 정렬 */}
          <div className="flex justify-center items-center gap-2 mt-4 mb-2">
            <button
              className="inline-flex items-center px-4 py-2 rounded-full bg-black"
              style={{ color: "#fff" }}
              onClick={handleLike}
            >
              <Image
                src="/like.png"
                alt="like"
                width={20}
                height={20}
                className="w-5 h-5 mr-2"
              />
              <span className="font-semibold text-white">{likeCount}</span>
            </button>
            {MOCK_EPIGRAM.referenceUrl && (
              <a
                href={MOCK_EPIGRAM.referenceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 rounded-full border border-[#CFDBEA] bg-[#f5f6fa] text-gray-700 ml-2"
              >
                <span>왕도로 가는 길</span>
                <Image
                  src="/md.png"
                  alt="arrow"
                  width={20}
                  height={20}
                  className="w-5 h-5 ml-2"
                />
              </a>
            )}
          </div>
        </div>
        {/* 댓글 */}
        <div className="bg-white rounded-xl border p-8">
          <div className="font-semibold mb-4">댓글 ({comments.length})</div>
          <form
            onSubmit={handleCommentSubmit}
            className="mb-6 flex items-center gap-3"
          >
            {/* 프로필 이미지 */}
            <Image
              src="/profile1.png"
              alt="내 프로필"
              width={36}
              height={36}
              className="w-9 h-9 rounded-full object-cover"
            />
            <input
              className="flex-1 border rounded-lg px-4 py-3 text-base bg-[#f5f6fa] focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={100}
              placeholder="100자 이내로 입력해주세요."
            />
          </form>
          <div className="space-y-6">
            {comments.map((c) => (
              <div key={c.id} className="flex items-start gap-3">
                <button
                  onClick={() => setShowProfile(c.user.id)}
                  className="flex-shrink-0"
                >
                  <Image
                    src={c.user.image}
                    alt={c.user.nickname}
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <button
                      onClick={() => setShowProfile(c.user.id)}
                      className="font-semibold text-sm hover:underline"
                    >
                      {c.user.nickname}
                    </button>
                    <span className="text-xs text-gray-400">{c.createdAt}</span>
                    {c.isMine && (
                      <>
                        <button className="ml-2 text-xs text-blue-500">
                          수정
                        </button>
                        <button
                          className="ml-1 text-xs text-red-400"
                          onClick={() => handleDeleteComment(c.id)}
                        >
                          삭제
                        </button>
                      </>
                    )}
                  </div>
                  <div className="text-sm text-gray-700 whitespace-pre-line">
                    {c.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {comments.length < MOCK_COMMENTS.length && (
            <div ref={loaderRef} className="h-8" />
          )}
        </div>
        {/* 삭제 모달 */}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white rounded-lg p-8 shadow-xl w-80">
              <div className="mb-4 text-lg font-semibold">
                정말 삭제하시겠습니까?
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  className="px-4 py-2 rounded bg-gray-200"
                  onClick={() => setShowDeleteModal(false)}
                >
                  취소
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-500 text-white"
                  onClick={() => {
                    setShowDeleteModal(false);
                    router.push("/epigramlist");
                  }}
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}
        {/* 프로필 모달 */}
        {showProfile && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white rounded-lg p-8 shadow-xl w-80 text-center">
              <Image
                src={
                  MOCK_COMMENTS.find((c) => c.user.id === showProfile)?.user
                    .image || "/profile1.png"
                }
                alt="프로필"
                width={64}
                height={64}
                className="w-16 h-16 rounded-full mx-auto mb-3"
              />
              <div className="font-bold text-lg mb-1">
                {
                  MOCK_COMMENTS.find((c) => c.user.id === showProfile)?.user
                    .nickname
                }
              </div>
              <div className="text-gray-500 text-sm mb-4">
                프로필 정보 (목업)
              </div>
              <button
                className="px-4 py-2 rounded bg-blue-500 text-white"
                onClick={() => setShowProfile(null)}
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
