"use client";

import Link from "next/link";
import { Button, Input } from "@/components/ui";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface AuthFormProps<T extends z.ZodSchema = any> {
  mode: "login" | "signup";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSubmit: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
  isSubmitting: boolean;
  apiError: string;
  onSubmit: (data: z.infer<T>) => void;
}

export function AuthForm<T extends z.ZodSchema>({
  mode,
  register,
  handleSubmit,
  errors,
  isSubmitting,
  apiError,
  onSubmit,
}: AuthFormProps<T>) {
  const isLogin = mode === "login";
  const submitText = isLogin ? "로그인" : "가입하기";
  const linkText = isLogin ? "가입하기" : "로그인";
  const linkHref = isLogin ? "/signup" : "/login";
  const linkDescription = isLogin
    ? "회원이 아니신가요?"
    : "이미 계정이 있으신가요?";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-[#F5F6FA]">
      {/* API 에러 메시지 */}
      {apiError && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {apiError}
        </div>
      )}

      {/* 이메일 */}
      <Input
        label="이메일"
        type="email"
        placeholder="이메일"
        error={errors.email?.message}
        required
        {...register("email")}
      />

      {/* 비밀번호 */}
      <Input
        label="비밀번호"
        type="password"
        placeholder="비밀번호"
        error={errors.password?.message}
        required
        {...register("password")}
      />

      {/* 회원가입 시 추가 필드들 */}
      {!isLogin && (
        <>
          {/* 비밀번호 확인 */}
          <Input
            label="비밀번호 확인"
            type="password"
            placeholder="비밀번호 확인"
            error={errors.passwordConfirmation?.message}
            required
            {...register("passwordConfirmation")}
          />

          {/* 닉네임 */}
          <Input
            label="닉네임"
            type="text"
            placeholder="닉네임"
            error={errors.nickname?.message}
            required
            {...register("nickname")}
          />
        </>
      )}

      {/* 제출 버튼 */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 rounded-xl bg-[#BFC6D1] text-white font-semibold text-base border-0 disabled:bg-[#E9EBF0] disabled:text-white hover:bg-[#A7B2C5] transition-colors"
        style={{ boxShadow: "none" }}
      >
        {isSubmitting ? `${submitText} 중...` : submitText}
      </Button>

      {/* 링크 */}
      <div className="text-right">
        <p className="text-sm text-[#BFC6D1]">
          {linkDescription}{" "}
          <Link
            href={linkHref}
            className="text-black hover:text-[#A7B2C5] font-medium"
          >
            {linkText}
          </Link>
        </p>
      </div>
    </form>
  );
}
