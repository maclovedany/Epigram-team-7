"use client";

import { useState, useRef } from "react";

interface EpigramTagInputProps {
  tags: string[];
  tagInput: string;
  onTagInputChange: (value: string) => void;
  onTagKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    isComposing: boolean
  ) => void;
  onTagRemove: (tag: string) => void;
  maxTags?: number;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
}

export default function EpigramTagInput({
  tags,
  tagInput,
  onTagInputChange,
  onTagKeyDown,
  onTagRemove,
  maxTags = 3,
  placeholder = "입력하여 태그 작성 (Enter 또는 쉼표로 추가, 최대 10자, 최대 3개)",
  disabled = false,
  error,
  label = "태그",
}: EpigramTagInputProps) {
  const [isComposing, setIsComposing] = useState(false); // 한글 입력 조합 상태
  const inputRef = useRef<HTMLInputElement>(null);

  // 조합 이벤트 처리
  const handleCompositionStart = () => {
    setIsComposing(true);
    console.log("handleCompositionStart");
  };

  const handleCompositionEnd = (
    e: React.CompositionEvent<HTMLInputElement>
  ) => {
    setIsComposing(false);
    const finalValue = (e.target as HTMLInputElement).value; // input 요소의 최종 값
    console.log("handleCompositionEnd:", { data: finalValue });
    onTagInputChange(finalValue); // 조합 완료된 값으로 입력 업데이트
  };

  return (
    <div>
      <label className="block font-semibold mb-2">{label}</label>
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
              onClick={() => onTagRemove(tag)}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        ref={inputRef}
        className="w-full border rounded-lg px-4 py-2 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
        value={tagInput}
        onChange={(e) => onTagInputChange(e.target.value)}
        onKeyDown={(e) => onTagKeyDown(e, isComposing)}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        placeholder={placeholder}
        disabled={disabled || tags.length >= maxTags}
      />
      <div className="text-xs text-gray-400 mt-1">
        Enter 키 또는 쉼표(,)를 눌러 태그를 추가하세요. ({tags.length}/{maxTags}
        개)
      </div>
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  );
}
