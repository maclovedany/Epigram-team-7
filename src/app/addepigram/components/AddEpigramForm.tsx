"use client";

import { useAddEpigram } from "../hooks/useAddEpigram";

export default function AddEpigramForm() {
  const {
    formData,
    setContent,
    setAuthorType,
    setAuthor,
    setReferenceTitle,
    setReferenceUrl,
    setTagInput,
    validation,
    isSubmitting,
    error,
    handleTagKeyDown,
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
      <div>
        <label className="block font-semibold mb-2">태그</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags.map((tag) => (
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
          value={formData.tagInput}
          onChange={(e) =>
            setTagInput(e.target.value.replace(/[^\w가-힣]/g, "").slice(0, 10))
          }
          onKeyDown={handleTagKeyDown}
          placeholder="입력하여 태그 작성 (최대 10자, 최대 3개)"
          disabled={formData.tags.length >= 3}
        />
        {validation.tagError && (
          <div className="text-red-500 text-xs mt-1">{validation.tagError}</div>
        )}
      </div>

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
