import { useState } from "react";
import { useRouter } from "next/navigation";
import { epigramService } from "@/lib/services/epigramService";
import { useEpigramStore } from "@/store/epigramStore";

export interface SubmitEpigramData {
  content: string;
  author: string;
  referenceTitle?: string;
  referenceUrl?: string;
  tags: string[];
}

export function useEpigramSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { addEpigram } = useEpigramStore();

  const submitEpigram = async (data: SubmitEpigramData) => {
    setIsSubmitting(true);
    setError("");

    try {
      const newEpigram = await epigramService.createEpigram(data);

      // 새로 생성된 에피그램을 스토어에 추가
      addEpigram(newEpigram);

      // 피드 페이지로 이동
      router.push("/epigramlist");

      return { success: true, data: newEpigram };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "에피그램 저장에 실패했습니다.";

      // 팀 정보 변경 에러인 경우 - 자동 리다이렉트 처리됨
      if (errorMessage.includes("팀 정보가 변경되었습니다")) {
        return { success: false, error: errorMessage, shouldRedirect: false };
      }

      // 로그인 관련 에러인 경우 로그인 페이지로 리디렉션
      if (errorMessage.includes("로그인") || errorMessage.includes("인증")) {
        router.push("/login");
        return { success: false, error: errorMessage, shouldRedirect: true };
      }

      setError(errorMessage);
      return { success: false, error: errorMessage, shouldRedirect: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    error,
    submitEpigram,
    clearError: () => setError(""),
  };
}
