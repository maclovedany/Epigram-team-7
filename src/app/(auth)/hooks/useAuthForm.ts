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

      // 응답 데이터 검증
      console.log("Auth response:", response);

      if (!response) {
        throw new Error("서버 응답이 없습니다.");
      }

      if (!response.user) {
        throw new Error("사용자 정보를 받을 수 없습니다.");
      }

      // 토큰은 httpOnly 쿠키로 자동 관리되므로 검증 불필요

      if (mode === "login") {
        // 로그인 성공 시 사용자 정보 저장 (토큰은 쿠키로 자동 관리)
        login(response.user);
        router.push("/epigramlist");
      } else {
        // 회원가입 성공 시 로그인 페이지로 이동
        router.push("/login");
      }
    } catch (error) {
      console.error("Auth error:", error);
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
