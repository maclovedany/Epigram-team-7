import { useState, useCallback } from "react";

export function useTagManager(initialTags: string[] = []) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [tagInput, setTagInput] = useState("");

  const addTag = useCallback(
    (input: string) => {
      // 쉼표 제거하고 트림
      const cleanInput = input.replace(/,/g, "").trim();
      // 특수문자 제거 (한글, 영문, 숫자만 허용)
      const sanitizedInput = cleanInput.replace(/[^a-zA-Z0-9가-힣]/g, "");

      if (
        sanitizedInput &&
        tags.length < 3 &&
        sanitizedInput.length <= 10 &&
        !tags.includes(sanitizedInput)
      ) {
        setTags((prevTags) => [...prevTags, sanitizedInput]);
        setTagInput("");
        return true;
      } else {
        setTagInput("");
        return false;
      }
    },
    [tags]
  );

  const removeTag = useCallback((tagToRemove: string) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  }, []);

  const handleTagKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, isComposing: boolean) => {
      if (isComposing) {
        return; // 조합 중에는 모든 키 이벤트 무시
      }

      if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
        e.preventDefault();
        addTag(tagInput);
      } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
        e.preventDefault();
        removeTag(tags[tags.length - 1]);
      }
    },
    [tagInput, tags, addTag, removeTag]
  );

  const handleTagInputChange = useCallback(
    (value: string) => {
      // 쉼표가 포함된 경우, 쉼표 이전 값으로 태그 추가 시도
      if (value.includes(",")) {
        const cleanValue = value.replace(/,/g, "").trim();
        if (cleanValue) {
          addTag(cleanValue);
        } else {
          setTagInput("");
        }
      } else {
        setTagInput(value.slice(0, 10)); // 10자 제한
      }
    },
    [addTag]
  );

  return {
    tags,
    tagInput,
    setTags,
    setTagInput,
    addTag,
    removeTag,
    handleTagKeyDown,
    handleTagInputChange,
  };
}
