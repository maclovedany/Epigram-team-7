"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Eye } from "lucide-react";
import Link from "next/link";
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui";
import Textarea from "@/components/ui/Textarea";
import TagInput from "@/components/ui/TagInput";
import {
  createEpigramSchema,
  type CreateEpigramFormData,
} from "@/lib/validations";
import { epigramService } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function AddEpigramPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string>("");
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  // 로그인하지 않은 사용자는 리다이렉트
  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

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
    } catch (error: any) {
      setApiError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/epigramlist">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1" />
                목록으로
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-text-primary">
                에피그램 작성
              </h1>
              <p className="text-text-secondary mt-1">
                새로운 에피그램을 작성해보세요
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 작성 폼 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                에피그램 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* API 에러 메시지 */}
                {apiError && (
                  <div className="p-3 text-sm text-error bg-red-50 border border-red-200 rounded-lg">
                    {apiError}
                  </div>
                )}

                {/* 에피그램 내용 */}
                <Textarea
                  label="에피그램 내용"
                  placeholder="인상 깊었던 명언이나 글귀를 입력해주세요..."
                  rows={4}
                  error={errors.content?.message}
                  helperText={`${watchedContent.length}/500자`}
                  required
                  {...register("content")}
                />

                {/* 작가 */}
                <Input
                  label="작가"
                  placeholder="작가명을 입력해주세요"
                  error={errors.author?.message}
                  required
                  {...register("author")}
                />

                {/* 출처 정보 */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-text-primary">
                    출처 정보 (선택사항)
                  </h3>

                  <Input
                    label="출처 제목"
                    placeholder="책 제목, 영화 제목 등"
                    error={errors.referenceTitle?.message}
                    {...register("referenceTitle")}
                  />

                  <Input
                    label="출처 URL"
                    type="url"
                    placeholder="https://example.com"
                    error={errors.referenceUrl?.message}
                    helperText="참고할 수 있는 링크가 있다면 입력해주세요"
                    {...register("referenceUrl")}
                  />
                </div>

                {/* 태그 */}
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <TagInput
                      label="태그"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.tags?.message}
                      helperText="관련된 키워드를 태그로 추가해보세요 (최대 5개)"
                      maxTags={5}
                    />
                  )}
                />

                {/* 제출 버튼 */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSubmitting ? "작성 중..." : "에피그램 작성"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* 미리보기 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                미리보기
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 에피그램 내용 미리보기 */}
                <div className="p-4 bg-bg-secondary rounded-lg">
                  <blockquote className="text-lg font-serif text-text-primary leading-relaxed">
                    {watchedContent
                      ? `"${watchedContent}"`
                      : "에피그램 내용이 여기에 표시됩니다..."}
                  </blockquote>
                  {watchedAuthor && (
                    <p className="text-sm font-medium text-text-secondary mt-3">
                      - {watchedAuthor}
                    </p>
                  )}
                </div>

                {/* 작성 팁 */}
                <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
                  <h4 className="text-sm font-medium text-primary-800 mb-2">
                    💡 작성 팁
                  </h4>
                  <ul className="text-xs text-primary-700 space-y-1">
                    <li>• 인상 깊었던 명언이나 글귀를 정확히 입력해주세요</li>
                    <li>• 작가명은 정확한 이름으로 입력해주세요</li>
                    <li>• 출처가 있다면 함께 기록해주세요</li>
                    <li>
                      • 관련 태그를 추가하면 다른 사용자가 쉽게 찾을 수 있어요
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
