import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { epigramService } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import {
  createEpigramSchema,
  type CreateEpigramFormData,
} from "@/lib/validations";

export function useAddEpigram() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string>("");
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateEpigramFormData>({
    resolver: zodResolver(createEpigramSchema),
    defaultValues: {
      tags: [],
    },
  });

  const watchedContent = watch("content", "");
  const watchedAuthor = watch("author", "");

  // 로그인하지 않은 사용자는 리다이렉트
  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  const onSubmit = async (data: CreateEpigramFormData) => {
    try {
      setApiError("");
      setIsSubmitting(true);

      // 빈 URL은 제거
      const submitData = {
        ...data,
        referenceUrl: data.referenceUrl?.trim() || undefined,
        referenceTitle: data.referenceTitle?.trim() || undefined,
      };

      await epigramService.createEpigram(submitData);

      // 성공 시 목록 페이지로 이동
      router.push("/epigramlist");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.";
      setApiError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    register,
    control,
    handleSubmit,
    errors,
    isSubmitting,
    apiError,
    onSubmit,
    watchedContent,
    watchedAuthor,
  };
}
