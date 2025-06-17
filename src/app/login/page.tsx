"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { authService } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const [apiError, setApiError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login, setLoading, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setApiError("");
      setLoading(true);

      const response = await authService.login(data);
      login(response.user, response.accessToken);

      router.push("/");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "로그인에 실패했습니다.";
      setApiError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#F5F7FA" }}
    >
      {/* 상단 네비게이션 */}
      <header className="w-full py-6 flex justify-center border-b border-gray-200 bg-white">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image
            src="/logo.png"
            alt="Epigram"
            width={120}
            height={40}
            className="h-8 w-auto"
          />
        </Link>
      </header>

      {/* 메인 로그인 영역 */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          {/* 중앙 로고 */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-8">
              <Image
                src="/logo.png"
                alt="Epigram"
                width={160}
                height={50}
                className="h-12 w-auto"
              />
            </div>
          </div>

          {/* 로그인 폼 */}
          <div className="space-y-4">
            {/* API 에러 메시지 */}
            {apiError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg text-center">
                {apiError}
              </div>
            )}

            {/* 이메일 입력 */}
            <div>
              <input
                type="email"
                placeholder="이메일"
                className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                style={{
                  border: "1px solid #CBD3E1",
                  backgroundColor: "#F5F7FA",
                }}
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* 비밀번호 입력 */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호"
                className="w-full px-4 py-3 pr-12 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                style={{
                  border: "1px solid #CBD3E1",
                  backgroundColor: "#F5F7FA",
                }}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:opacity-80"
              >
                <Image
                  src="/visibility.png"
                  alt={showPassword ? "Hide password" : "Show password"}
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </button>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              onClick={handleSubmit(onSubmit)}
              className="w-full py-3 text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ backgroundColor: "#CBD3E1" }}
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </button>

            {/* 회원가입 링크 */}
            <div className="text-right">
              <p className="text-sm" style={{ color: "#CBD3E1" }}>
                회원이 아니신가요?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-gray-900 hover:opacity-80"
                >
                  가입하기
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
