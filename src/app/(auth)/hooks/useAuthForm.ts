import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "@/lib/services/authService";
import { useAuthStore } from "@/store/authStore";
import { z } from "zod";

interface UseAuthFormProps<T extends z.ZodSchema> {
  schema: T;
  defaultValues: z.infer<T>;
  mode: "login" | "signup";
}

export function useAuthForm<T extends z.ZodSchema>({
  schema,
  defaultValues,
  mode,
}: UseAuthFormProps<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string>("");
  const router = useRouter();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (data: z.infer<T>) => {
    try {
      setApiError("");
      setIsSubmitting(true);

      let response;
      if (mode === "login") {
        response = await authService.login(data);
      } else {
        response = await authService.signup(data);
      }

      // 로그인 성공 시 토큰 저장 및 리다이렉트
      login(response.user, response.accessToken);
      router.push("/epigramlist");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : `${mode === "login" ? "로그인" : "회원가입"}에 실패했습니다.`;
      setApiError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    apiError,
    onSubmit,
  };
}
