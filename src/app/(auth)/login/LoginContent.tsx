"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthForm } from "../hooks/useAuthForm";
import { AuthForm } from "../components";
import { loginSchema } from "@/lib/validations";

export function LoginContent() {
  const searchParams = useSearchParams();
  const errorFromUrl = searchParams.get("error");

  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    apiError,
    onSubmit,
    setApiError,
  } = useAuthForm({
    schema: loginSchema,
    defaultValues: { email: "", password: "" },
    mode: "login",
  });

  // URL에서 에러 파라미터 처리
  useEffect(() => {
    if (errorFromUrl && setApiError) {
      setApiError(decodeURIComponent(errorFromUrl));
    }
  }, [errorFromUrl, setApiError]);

  return (
    <AuthForm
      mode="login"
      register={register}
      handleSubmit={handleSubmit}
      errors={errors}
      isSubmitting={isSubmitting}
      apiError={apiError}
      onSubmit={onSubmit}
    />
  );
}
