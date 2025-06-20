import { useMemo } from "react";

export interface ValidationErrors {
  contentError: string;
  authorError: string;
  tagError: string;
}

export interface UseFormValidationProps {
  content: string;
  authorType: string;
  author: string;
  tags: string[];
}

export function useFormValidation({
  content,
  authorType,
  author,
  tags,
}: UseFormValidationProps) {
  const validation = useMemo(() => {
    const contentError =
      content.length > 500 ? "500자 이내로 입력해주세요." : "";
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

    return {
      contentError,
      authorError,
      tagError,
      isFormInvalid,
    };
  }, [content, authorType, author, tags]);

  return validation;
}
