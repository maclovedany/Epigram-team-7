import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { epigramService } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Epigram } from "@/types";

export interface EditFormData {
  content: string;
  author: string;
  referenceTitle: string;
  referenceUrl: string;
  tags: string[];
}

export function useEditEpigram() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [epigram, setEpigram] = useState<Epigram | null>(null);

  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();

  const epigramId = params.id as string;

  // Form state
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [referenceTitle, setReferenceTitle] = useState("");
  const [referenceUrl, setReferenceUrl] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Validation
  const contentError = content.length > 500 ? "500자 이내로 입력해주세요." : "";
  const authorError = author.trim() === "" ? "저자 이름을 입력해주세요." : "";
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
    author.trim() === "";

  // 에피그램 로드
  useEffect(() => {
    const loadEpigramData = async () => {
      if (!epigramId) return;

      try {
        setIsLoading(true);
        const data = await epigramService.getEpigramById(epigramId);

        // 현재 사용자가 작성자인지 확인
        console.log("현재 사용자:", user);
        console.log("에피그램 작성자 ID:", data.writerId);
        console.log("사용자 ID 타입:", typeof user?.id);
        console.log("작성자 ID 타입:", typeof data.writerId);
        console.log("ID 비교 결과:", user?.id === data.writerId);

        // 임시로 권한 검증 비활성화 - 디버깅용
        /*
        if (!user || user.id !== data.writerId) {
          console.log("권한 없음: 목록으로 리다이렉트");
          router.push("/epigramlist");
          return;
        }
        */

        setEpigram(data);
        // 폼에 기존 데이터 설정
        setContent(data.content);
        setAuthor(data.author);
        setReferenceTitle(data.referenceTitle || "");
        setReferenceUrl(data.referenceUrl || "");
        // 태그 객체 배열을 문자열 배열로 변환
        setTags(data.tags ? data.tags.map((tag) => tag.name) : []);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "에피그램을 불러올 수 없습니다.";
        setError(errorMessage);
        router.push("/epigramlist");
      } finally {
        setIsLoading(false);
      }
    };

    loadEpigramData();
  }, [epigramId, user, router]);

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

  const handleTagRemove = (tag: string) => {
    console.log("Removing tag:", tag, { currentTags: tags });
    setTags((prevTags) => prevTags.filter((t) => t !== tag));
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

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!epigram || isFormInvalid) return;

    try {
      setError("");
      setIsSubmitting(true);

      const submitData = {
        content,
        author,
        referenceTitle: referenceTitle.trim() || undefined,
        referenceUrl: referenceUrl.trim() || undefined,
        tags,
      };

      await epigramService.updateEpigram(epigram.id.toString(), submitData);
      router.push(`/epigramlist/${epigram.id}`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "수정에 실패했습니다.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // State
    isLoading,
    isSubmitting,
    error,
    epigram,

    // Form data
    formData: {
      content,
      author,
      referenceTitle,
      referenceUrl,
      tags,
      tagInput,
    },

    // Form setters
    setContent,
    setAuthor,
    setReferenceTitle,
    setReferenceUrl,
    setTagInput,

    // Validation
    validation: {
      contentError,
      authorError,
      tagError,
      isFormInvalid,
    },

    // Handlers
    handleTagKeyDown,
    handleTagRemove,
    handleTagInputChange,
    handleSubmit,
  };
}
