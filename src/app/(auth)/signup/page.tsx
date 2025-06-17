"use client";

import { useAuthForm } from "../hooks/useAuthForm";
import { AuthForm } from "../components";
import { signupSchema } from "@/lib/validations";

export default function SignupPage() {
  const { register, handleSubmit, errors, isSubmitting, apiError, onSubmit } =
    useAuthForm({
      schema: signupSchema,
      defaultValues: {
        email: "",
        password: "",
        passwordConfirmation: "",
        nickname: "",
      },
      mode: "signup",
    });

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm flex flex-col items-center">
          <div className="flex items-center justify-center mb-12 mt-8">
            <img src="/logo.png" alt="Epigram" className="h-12 w-auto" />
          </div>
          <div className="w-full">
            {/* 회원가입 폼 */}
            <AuthForm
              mode="signup"
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
