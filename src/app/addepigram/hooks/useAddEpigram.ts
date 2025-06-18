import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { epigramService } from "@/lib/services/epigramService";
import { useAuthStore } from "@/store/authStore";

export interface EpigramFormData {
  content: string;
  authorType: string;
  author: string;
  referenceTitle: string;
  referenceUrl: string;
  tags: string[];
}

export interface ValidationErrors {
  contentError: string;
  authorError: string;
  tagError: string;
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
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Validation
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

  // Tag management
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      if (
        tags.length < 3 &&
        tagInput.length <= 10 &&
        !tags.includes(tagInput.trim())
      ) {
        setTags([...tags, tagInput.trim()]);
        setTagInput("");
      }
    }
  };

  const handleTagRemove = (tag: string) =>
    setTags(tags.filter((t) => t !== tag));

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormInvalid) return;

    setIsSubmitting(true);
    try {
      await epigramService.createEpigram({
        content,
        author: authorType === "직접입력" ? author : authorType,
        referenceTitle,
        referenceUrl,
        tags,
      });
      router.push("/epigramlist");
    } catch {
      setError("에피그램 저장에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // Form data
    formData: {
      content,
      authorType,
      author,
      referenceTitle,
      referenceUrl,
      tags,
      tagInput,
    },

    // Form setters
    setContent,
    setAuthorType,
    setAuthor,
    setReferenceTitle,
    setReferenceUrl,
    setTags,
    setTagInput,

    // Validation
    validation: {
      contentError,
      authorError,
      tagError,
      isFormInvalid,
    },

    // State
    isSubmitting,
    error,

    // Handlers
    handleTagKeyDown,
    handleTagRemove,
    handleSubmit,
  };
}
