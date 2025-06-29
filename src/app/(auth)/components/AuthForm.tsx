"use client";

import Link from "next/link";
import { Button, Input } from "@/components/ui";
import { z } from "zod";

interface AuthFormProps<T extends z.ZodSchema = any> {
  mode: "login" | "signup";
  register: any;
  handleSubmit: any;
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

  const handleNaverLogin = () => {
    // 환경변수에서 기본 URL 가져오기, 없으면 현재 origin 사용
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;

    const naverAuthURL =
      `https://nid.naver.com/oauth2.0/authorize?` +
      `response_type=code&` +
      `client_id=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(
        baseUrl + "/api/auth/naver/callback"
      )}&` +
      `state=${Math.random().toString(36).substring(2, 15)}`;

    console.log("Naver OAuth URL:", naverAuthURL);
    window.location.href = naverAuthURL;
  };

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

      {/* SNS 로그인 - 로그인 모드에서만 표시 */}
      {isLogin && (
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">SNS 로그인</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* 네이버 로그인 버튼 */}
          <Button
            type="button"
            onClick={handleNaverLogin}
            className="w-full py-3 rounded-xl bg-[#03C75A] text-white font-semibold text-base border-0 hover:bg-[#02B351] transition-colors"
            style={{ boxShadow: "none" }}
          >
            네이버
          </Button>
        </div>
      )}

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
