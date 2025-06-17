"use client";

import { useAuthForm } from "../hooks/useAuthForm";
import { AuthForm } from "../components";
import { loginSchema } from "@/lib/validations";

export default function LoginPage() {
  const { register, handleSubmit, errors, isSubmitting, apiError, onSubmit } =
    useAuthForm({
      schema: loginSchema,
      defaultValues: { email: "", password: "" },
      mode: "login",
    });

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm flex flex-col items-center">
          <div className="flex items-center justify-center mb-12 mt-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Epigram"
              className="h-16 w-auto"
              style={{ imageRendering: "crisp-edges" }}
            />
          </div>
          <div className="w-full">
            {/* 로그인 폼 */}
            <AuthForm
              mode="login"
              register={register}
              handleSubmit={handleSubmit}
              errors={errors}
              isSubmitting={isSubmitting}
              apiError={apiError}
              onSubmit={onSubmit}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
