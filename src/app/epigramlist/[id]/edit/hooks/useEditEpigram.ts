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
        if (!user || user.id !== data.writerId) {
          router.push("/epigramlist");
          return;
        }

        setEpigram(data);
        // 폼에 기존 데이터 설정
        setContent(data.content);
        setAuthor(data.author);
        setReferenceTitle(data.referenceTitle || "");
        setReferenceUrl(data.referenceUrl || "");
        setTags(data.tags || []);
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
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      if (
        tags.length < 3 &&
        tagInput.length <= 10 &&
        !tags.includes(tagInput)
      ) {
        setTags([...tags, tagInput]);
        setTagInput("");
      }
    }
  };

  const handleTagRemove = (tag: string) =>
    setTags(tags.filter((t) => t !== tag));

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
    handleSubmit,
  };
}
