import { useState } from "react";
import { useRouter } from "next/navigation";
import { epigramService } from "@/lib/services/epigramService";

export interface UpdateEpigramData {
  content: string;
  author: string;
  referenceTitle?: string;
  referenceUrl?: string;
  tags: string[];
}

export function useUpdateEpigram(epigramId?: number) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const updateEpigram = async (data: UpdateEpigramData) => {
    if (!epigramId) return { success: false, error: "에피그램 ID가 없습니다." };

    try {
      setError("");
      setIsSubmitting(true);

      const submitData = {
        content: data.content,
        author: data.author,
        referenceTitle: data.referenceTitle?.trim() || undefined,
        referenceUrl: data.referenceUrl?.trim() || undefined,
        tags: data.tags,
      };

      await epigramService.updateEpigram(epigramId.toString(), submitData);
      router.push(`/epigramlist/${epigramId}`);

      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "수정에 실패했습니다.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    error,
    updateEpigram,
    clearError: () => setError(""),
  };
}
