import { useState, useEffect, useCallback } from "react";
import { useFormValidation } from "@/app/addepigram/hooks/useFormValidation";
import { useTagManager } from "@/app/addepigram/hooks/useTagManager";
import { useEpigramLoader } from "./useEpigramLoader";
import { useUpdateEpigram } from "./useUpdateEpigram";

export interface EditFormData {
  content: string;
  author: string;
  referenceTitle: string;
  referenceUrl: string;
  tags: string[];
}

export function useEditEpigram() {
  // 에피그램 로딩
  const { epigram, isLoading, error: loadError } = useEpigramLoader();

  // 폼 상태
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [referenceTitle, setReferenceTitle] = useState("");
  const [referenceUrl, setReferenceUrl] = useState("");

  // 분리된 훅들 사용
  const tagManager = useTagManager();
  const validation = useFormValidation({
    content,
    authorType: "직접입력", // 편집 시에는 항상 직접입력
    author,
    tags: tagManager.tags,
  });
  const {
    isSubmitting,
    error: submitError,
    updateEpigram,
  } = useUpdateEpigram(epigram?.id);

  // 에피그램 데이터 초기화 함수
  const initializeFormData = useCallback(() => {
    if (epigram) {
      setContent(epigram.content);
      setAuthor(epigram.author);
      setReferenceTitle(epigram.referenceTitle || "");
      setReferenceUrl(epigram.referenceUrl || "");

      // 태그 객체 배열을 문자열 배열로 변환
      const tagStrings = epigram.tags
        ? epigram.tags.map((tag) => tag.name)
        : [];
      tagManager.setTags(tagStrings);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [epigram, tagManager.setTags]);

  // 에피그램 데이터가 로드되면 폼에 설정
  useEffect(() => {
    initializeFormData();
  }, [initializeFormData]);

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!epigram || validation.isFormInvalid) return;

    const submitData = {
      content,
      author,
      referenceTitle,
      referenceUrl,
      tags: tagManager.tags,
    };

    await updateEpigram(submitData);
  };

  const error = loadError || submitError;

  return {
    // 상태
    isLoading,
    isSubmitting,
    error,
    epigram,

    // 폼 데이터
    formData: {
      content,
      author,
      referenceTitle,
      referenceUrl,
      tags: tagManager.tags,
      tagInput: tagManager.tagInput,
    },

    // 폼 세터
    setContent,
    setAuthor,
    setReferenceTitle,
    setReferenceUrl,
    setTags: tagManager.setTags,
    setTagInput: tagManager.setTagInput,

    // 유효성 검증
    validation,

    // 핸들러
    handleTagKeyDown: tagManager.handleTagKeyDown,
    handleTagInputChange: tagManager.handleTagInputChange,
    handleTagRemove: tagManager.removeTag,
    handleSubmit,
  };
}
