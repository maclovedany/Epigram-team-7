import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useFormValidation } from "./useFormValidation";
import { useTagManager } from "./useTagManager";
import { useEpigramSubmit } from "./useEpigramSubmit";

export interface EpigramFormData {
  content: string;
  authorType: string;
  author: string;
  referenceTitle: string;
  referenceUrl: string;
  tags: string[];
  tagInput: string;
}

export function useAddEpigram() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  // 인증 확인
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Form state
  const [content, setContent] = useState("");
  const [authorType, setAuthorType] = useState("직접입력");
  const [author, setAuthor] = useState("");
  const [referenceTitle, setReferenceTitle] = useState("");
  const [referenceUrl, setReferenceUrl] = useState("");

  // 분리된 훅들 사용
  const tagManager = useTagManager();
  const validation = useFormValidation({
    content,
    authorType,
    author,
    tags: tagManager.tags,
  });
  const epigramSubmit = useEpigramSubmit();

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validation.isFormInvalid) return;

    const submitData = {
      content,
      author: authorType === "직접입력" ? author : authorType,
      referenceTitle,
      referenceUrl,
      tags: tagManager.tags,
    };

    await epigramSubmit.submitEpigram(submitData);
  };

  return {
    // Form data
    formData: {
      content,
      authorType,
      author,
      referenceTitle,
      referenceUrl,
      tags: tagManager.tags,
      tagInput: tagManager.tagInput,
    },

    // Form setters
    setContent,
    setAuthorType,
    setAuthor,
    setReferenceTitle,
    setReferenceUrl,
    setTags: tagManager.setTags,
    setTagInput: tagManager.setTagInput,

    // Validation
    validation,

    // State
    isSubmitting: epigramSubmit.isSubmitting,
    error: epigramSubmit.error,

    // Handlers
    handleTagKeyDown: tagManager.handleTagKeyDown,
    handleTagInputChange: tagManager.handleTagInputChange,
    handleTagRemove: tagManager.removeTag,
    handleSubmit,
  };
}
