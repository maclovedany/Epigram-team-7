"use client";

import { useAddEpigram } from "../hooks/useAddEpigram";
import { EpigramTagInput } from "@/components/ui";

export default function AddEpigramForm() {
  const {
    formData,
    setContent,
    setAuthorType,
    setAuthor,
    setReferenceTitle,
    setReferenceUrl,
    validation,
    isSubmitting,
    error,
    handleTagKeyDown,
    handleTagInputChange,
    handleTagRemove,
    handleSubmit,
  } = useAddEpigram();

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 내용 */}
      <div>
        <label className="block font-semibold mb-2">
          내용 <span className="text-red-500">*</span>
        </label>
        <textarea
          className="w-full h-28 border rounded-lg px-4 py-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
          maxLength={500}
          value={formData.content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="500자 이내로 입력해주세요."
          required
        />
        <div className="flex justify-between mt-1 text-xs">
          <span className="text-gray-400">{formData.content.length}/500자</span>
          {validation.contentError && (
            <span className="text-red-500">{validation.contentError}</span>
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
                checked={formData.authorType === type}
                onChange={() => setAuthorType(type)}
              />
              {type}
            </label>
          ))}
        </div>
        {formData.authorType === "직접입력" && (
          <input
            className="w-full border rounded-lg px-4 py-2 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={formData.author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="저자 이름 입력"
            required
          />
        )}
        {validation.authorError && (
          <div className="text-red-500 text-xs mt-1">
            {validation.authorError}
          </div>
        )}
      </div>

      {/* 출처 */}
      <div>
        <label className="block font-semibold mb-2">출처</label>
        <input
          className="w-full border rounded-lg px-4 py-2 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 mb-2"
          value={formData.referenceTitle}
          onChange={(e) => setReferenceTitle(e.target.value)}
          placeholder="출처 제목 입력"
        />
        <input
          className="w-full border rounded-lg px-4 py-2 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={formData.referenceUrl}
          onChange={(e) => setReferenceUrl(e.target.value)}
          placeholder="URL (ex. https://www.website.com)"
          type="url"
        />
      </div>

      {/* 태그 */}
      <EpigramTagInput
        tags={formData.tags}
        tagInput={formData.tagInput}
        onTagInputChange={handleTagInputChange}
        onTagKeyDown={handleTagKeyDown}
        onTagRemove={handleTagRemove}
        maxTags={3}
        error={validation.tagError}
      />

      {/* 에러 메시지 */}
      {error && (
        <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      {/* 저장 버튼 */}
      <button
        type="submit"
        className="w-full h-12 rounded-lg bg-[#CBD3E1] text-white font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={validation.isFormInvalid || isSubmitting}
      >
        {isSubmitting ? "저장 중..." : "작성 완료"}
      </button>
    </form>
  );
}
