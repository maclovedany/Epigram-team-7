"use client";

import { useState, useRef } from "react";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  label?: string;
  error?: string;
  helperText?: string;
  maxTags?: number;
  placeholder?: string;
  className?: string;
}

export default function TagInput({
  value = [],
  onChange,
  label,
  error,
  helperText,
  maxTags = 5,
  placeholder = "태그를 입력하고 Enter를 누르세요",
  className,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isComposing, setIsComposing] = useState(false); // 한글 입력 조합 상태
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !value.includes(trimmedTag) && value.length < maxTags) {
      console.log("Adding tag:", trimmedTag); // 디버깅 로그
      onChange([...value, trimmedTag]);
      setInputValue("");
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  // `onInput` 이벤트 제거, `onChange` 이벤트로 대체
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isComposing) {
      // 조합 중이 아닐 때만 입력 값 업데이트
      setInputValue(e.target.value);
      console.log("handleChange:", { value: e.target.value, isComposing });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log("handleKeyDown:", { key: e.key, inputValue, isComposing });
    if (e.key === "Enter" && !isComposing && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      e.preventDefault();
      removeTag(value.length - 1);
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
    console.log("handleCompositionStart");
  };

  const handleCompositionUpdate = (
    e: React.CompositionEvent<HTMLInputElement>
  ) => {
    // 조합 중에는 inputValue를 업데이트하지 않음
    console.log("handleCompositionUpdate:", { data: e.data, isComposing });
  };

  const handleCompositionEnd = (
    e: React.CompositionEvent<HTMLInputElement>
  ) => {
    setIsComposing(false);
    setInputValue(e.data); // 조합 완료된 최종 값 설정
    console.log("handleCompositionEnd:", { data: e.data, isComposing });
  };

  const handleAddClick = () => {
    if (inputValue.trim() && !isComposing) {
      addTag(inputValue);
    }
  };

  return (
    <div className={cn("w-full space-y-1", className)}>
      {label && (
        <label className="block text-sm font-medium text-text-primary">
          {label}
        </label>
      )}

      <div
        className={cn(
          "flex flex-wrap gap-2 min-h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2",
          error && "border-error focus-within:ring-error",
          className
        )}
      >
        {value.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
          >
            #{tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="hover:text-primary-600 focus:outline-none"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        <div className="flex items-center gap-1 flex-1 min-w-20">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleChange} // onInput 대신 onChange 사용
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionUpdate={handleCompositionUpdate}
            onCompositionEnd={handleCompositionEnd}
            placeholder={value.length === 0 ? placeholder : ""}
            disabled={value.length >= maxTags}
            className="flex-1 outline-none placeholder:text-text-tertiary disabled:cursor-not-allowed disabled:opacity-50"
          />
          {inputValue.trim() && value.length < maxTags && (
            <button
              type="button"
              onClick={handleAddClick}
              className="text-primary-600 hover:text-primary-500 focus:outline-none"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-error">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-text-tertiary">{helperText}</p>
      )}

      <div className="text-xs text-text-tertiary">
        {value.length}/{maxTags} 태그
      </div>
    </div>
  );
}
