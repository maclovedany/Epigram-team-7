"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { epigramService } from "@/lib/services/epigramService";

export default function AddEpigramPage() {
  const router = useRouter();
  // 입력값 상태
  const [content, setContent] = useState("");
  const [authorType, setAuthorType] = useState("직접입력");
  const [author, setAuthor] = useState("");
  const [referenceTitle, setReferenceTitle] = useState("");
  const [referenceUrl, setReferenceUrl] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // 유효성 검사
  const contentError = content.length > 500 ? "500자 이내로 입력해주세요." : "";
  const authorError =
    authorType === "직접입력" && author.trim() === ""
      ? "저자 이름을 입력해주세요."
      : "";
  const tagError =
    tags.length > 3
      ? "태그는 최대 3개까지 추가할 수 있습니다."
      : tags.some((t) => t.length > 10)
      ? "태그는 10자 이내여야 합니다."
      : "";
  const isFormInvalid =
    !!contentError ||
    !!authorError ||
    !!tagError ||
    content.trim() === "" ||
    (authorType === "직접입력" && author.trim() === "");

  // 태그 추가
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      if (
        tags.length < 3 &&
        tagInput.length <= 10 &&
        !tags.includes(tagInput)
      ) {
        setTags([...tags, tagInput]);
        setTagInput("");
      }
    }
  };
  const handleTagRemove = (tag: string) =>
    setTags(tags.filter((t) => t !== tag));

  // 저장
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormInvalid) return;
    setIsSubmitting(true);
    try {
      const result = await epigramService.createEpigram({
        content,
        author: authorType === "직접입력" ? author : authorType,
        referenceTitle,
        referenceUrl,
        tags,
      });
      router.push("/epigramlist");
    } catch (err) {
      setError("에피그램 저장에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-xl mx-auto py-12">
        <h1 className="text-2xl font-bold mb-10 text-left">에피그램 만들기</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 내용 */}
          <div>
            <label className="block font-semibold mb-2">
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full h-28 border rounded-lg px-4 py-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
              maxLength={500}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="500자 이내로 입력해주세요."
              required
            />
            <div className="flex justify-between mt-1 text-xs">
              <span className="text-gray-400">{content.length}/500자</span>
              {contentError && (
                <span className="text-red-500">{contentError}</span>
              )}
            </div>
          </div>

          {/* 저자 */}
          <div>
            <label className="block font-semibold mb-2">
              저자 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6 mb-2">
              {["직접입력", "알 수 없음", "본인"].map((type) => (
                <label key={type} className="flex items-center gap-1 text-sm">
                  <input
                    type="radio"
                    name="authorType"
                    value={type}
                    checked={authorType === type}
                    onChange={() => setAuthorType(type)}
                  />
                  {type}
                </label>
              ))}
            </div>
            {authorType === "직접입력" && (
              <input
                className="w-full border rounded-lg px-4 py-2 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="저자 이름 입력"
                required
              />
            )}
            {authorError && (
              <div className="text-red-500 text-xs mt-1">{authorError}</div>
            )}
          </div>

          {/* 출처 */}
          <div>
            <label className="block font-semibold mb-2">출처</label>
            <input
              className="w-full border rounded-lg px-4 py-2 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 mb-2"
              value={referenceTitle}
              onChange={(e) => setReferenceTitle(e.target.value)}
              placeholder="출처 제목 입력"
            />
            <input
              className="w-full border rounded-lg px-4 py-2 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={referenceUrl}
              onChange={(e) => setReferenceUrl(e.target.value)}
              placeholder="URL (ex. https://www.website.com)"
              type="url"
            />
          </div>

          {/* 태그 */}
          <div>
            <label className="block font-semibold mb-2">태그</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-[#edf0f4] px-3 py-1 rounded-full text-sm flex items-center"
                >
                  #{tag}
                  <button
                    type="button"
                    className="ml-1 text-gray-400 hover:text-red-500"
                    onClick={() => handleTagRemove(tag)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              className="w-full border rounded-lg px-4 py-2 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={tagInput}
              onChange={(e) =>
                setTagInput(
                  e.target.value.replace(/[^\w가-힣]/g, "").slice(0, 10)
                )
              }
              onKeyDown={handleTagKeyDown}
              placeholder="입력하여 태그 작성 (최대 10자, 최대 3개)"
              disabled={tags.length >= 3}
            />
            {tagError && (
              <div className="text-red-500 text-xs mt-1">{tagError}</div>
            )}
          </div>

          {/* 저장 버튼 */}
          <button
            type="submit"
            className="w-full h-12 rounded-lg bg-[#CBD3E1] text-white font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isFormInvalid || isSubmitting}
          >
            작성 완료
          </button>
        </form>
      </main>
    </div>
  );
}
