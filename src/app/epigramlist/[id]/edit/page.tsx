"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Eye, Loader2, Edit } from "lucide-react";
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
import { Epigram } from "@/types";

export default function EditEpigramPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string>("");
  const [epigram, setEpigram] = useState<Epigram | null>(null);

  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  const epigramId = params.id as string;

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateEpigramFormData>({
    resolver: zodResolver(createEpigramSchema),
    defaultValues: {
      tags: [],
    },
  });

  const watchedContent = watch("content", "");
  const watchedAuthor = watch("author", "");

  // 에피그램 데이터 로드 및 폼 초기화
  const loadEpigram = async () => {
    try {
      setIsLoading(true);
      setApiError("");

      const data = await epigramService.getEpigramById(epigramId);
      setEpigram(data);

      // 작성자 권한 체크
      if (!user || user.id !== data.writerId) {
        setApiError("이 에피그램을 수정할 권한이 없습니다.");
        return;
      }

      // 폼에 기존 데이터 설정
      setValue("content", data.content);
      setValue("author", data.author);
      setValue("referenceTitle", data.referenceTitle || "");
      setValue("referenceUrl", data.referenceUrl || "");
      setValue("tags", data.tags || []);
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (epigramId) {
      loadEpigram();
    }
  }, [epigramId, isAuthenticated, user]);

  // 수정 제출
  const onSubmit = async (data: CreateEpigramFormData) => {
    if (!epigram) return;

    try {
      setApiError("");
      setIsSubmitting(true);

      // 빈 URL은 제거
      const submitData = {
        ...data,
        referenceUrl: data.referenceUrl?.trim() || undefined,
        referenceTitle: data.referenceTitle?.trim() || undefined,
      };

      await epigramService.updateEpigram(epigramId, submitData);

      // 성공 시 상세 페이지로 이동
      router.push(`/epigramlist/${epigramId}`);
    } catch (error: any) {
      setApiError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-secondary">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* 헤더 스켈레톤 */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-40 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* 로딩 메시지 */}
            <Card>
              <CardContent className="p-8 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-500" />
                <p className="text-text-secondary">에피그램을 불러오는 중...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // 에러 또는 권한 없음
  if (apiError || !epigram) {
    return (
      <div className="min-h-screen bg-bg-secondary">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              에피그램을 수정할 수 없습니다
            </h2>
            <p className="text-text-secondary mb-6">
              {apiError || "에피그램을 찾을 수 없습니다."}
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/epigramlist">
                <Button variant="outline">목록으로 돌아가기</Button>
              </Link>
              {epigram && (
                <Link href={`/epigramlist/${epigramId}`}>
                  <Button variant="primary">상세 페이지로 이동</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-secondary">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href={`/epigramlist/${epigramId}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1" />
                돌아가기
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-text-primary">
                에피그램 수정
              </h1>
              <p className="text-text-secondary mt-1">
                에피그램을 수정해보세요
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 수정 폼 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                에피그램 정보 수정
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

                {/* 제출 버튼들 */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSubmitting ? "수정 중..." : "수정 완료"}
                  </Button>
                  <Link href={`/epigramlist/${epigramId}`}>
                    <Button variant="outline" type="button">
                      취소
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* 미리보기 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                수정 미리보기
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

                {/* 변경 사항 안내 */}
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="text-sm font-medium text-yellow-800 mb-2">
                    ℹ️ 수정 안내
                  </h4>
                  <ul className="text-xs text-yellow-700 space-y-1">
                    <li>• 수정된 내용은 즉시 반영됩니다</li>
                    <li>• 다른 사용자들이 남긴 댓글과 좋아요는 유지됩니다</li>
                    <li>
                      • 수정 후에는 되돌릴 수 없으니 신중하게 작성해주세요
                    </li>
                  </ul>
                </div>

                {/* 원본 정보 */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-800 mb-2">
                    📅 원본 정보
                  </h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>
                      작성일:{" "}
                      {new Date(epigram.createdAt).toLocaleDateString("ko-KR")}
                    </p>
                    <p>좋아요: {epigram.likeCount}개</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
