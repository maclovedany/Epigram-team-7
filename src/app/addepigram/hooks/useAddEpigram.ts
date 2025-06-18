import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { epigramService } from "@/lib/services/epigramService";
import { useAuthStore } from "@/store/authStore";
import { useEpigramStore } from "@/store/epigramStore";

export interface EpigramFormData {
  content: string;
  authorType: string;
  author: string;
  referenceTitle: string;
  referenceUrl: string;
  tags: string[];
  tagInput: string;
}

export interface ValidationErrors {
  contentError: string;
  authorError: string;
  tagError: string;
}

export function useAddEpigram() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { addEpigram } = useEpigramStore();

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

  // 디버깅: tags 상태 변화 추적
  useEffect(() => {
    console.log("tags updated:", tags);
  }, [tags]);

  // Tag management
  const addTag = (cleanInput: string) => {
    // 쉼표 제거하고 트림
    cleanInput = cleanInput.replace(/,/g, "").trim();
    // 특수문자 제거 (한글, 영문, 숫자만 허용)
    cleanInput = cleanInput.replace(/[^a-zA-Z0-9가-힣]/g, "");

    if (
      cleanInput &&
      tags.length < 3 &&
      cleanInput.length <= 10 &&
      !tags.includes(cleanInput)
    ) {
      console.log("Adding tag:", cleanInput, { currentTags: tags, tagInput });
      setTags((prevTags) => [...prevTags, cleanInput]); // 함수형 업데이트
      setTagInput("");
    } else {
      console.log("Tag not added:", {
        cleanInput,
        currentTags: tags,
        tagInput,
      });
      setTagInput("");
    }
  };

  const handleTagKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    isComposing: boolean
  ) => {
    if (isComposing) {
      console.log("Ignoring keydown due to composition:", {
        key: e.key,
        input: tagInput,
      });
      return; // 조합 중에는 모든 키 이벤트 무시
    }

    console.log("handleTagKeyDown:", { key: e.key, input: tagInput });
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      e.preventDefault();
      handleTagRemove(tags[tags.length - 1]);
    }
  };

  const handleTagInputChange = (value: string) => {
    console.log("handleTagInputChange:", { value, currentTagInput: tagInput });
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
  };

  const handleTagRemove = (tag: string) => {
    console.log("Removing tag:", tag, { currentTags: tags });
    setTags((prevTags) => prevTags.filter((t) => t !== tag));
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormInvalid) return;

    setIsSubmitting(true);
    try {
      const newEpigram = await epigramService.createEpigram({
        content,
        author: authorType === "직접입력" ? author : authorType,
        referenceTitle,
        referenceUrl,
        tags,
      });

      // 새로 생성된 에피그램을 스토어에 추가
      addEpigram(newEpigram);

      // 피드목록 페이지로 이동
      router.push("/epigramlist");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "에피그램 저장에 실패했습니다.";

      // 로그인 관련 에러인 경우 로그인 페이지로 리디렉션
      if (errorMessage.includes("로그인") || errorMessage.includes("인증")) {
        router.push("/login");
        return;
      }

      setError(errorMessage);
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
    handleTagInputChange,
    handleTagRemove,
    handleSubmit,
  };
}
