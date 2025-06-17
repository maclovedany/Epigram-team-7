"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
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

interface EditFormProps {
  defaultValues: CreateEpigramFormData;
  onSubmit: (data: CreateEpigramFormData) => Promise<void>;
  isSubmitting: boolean;
  apiError?: string;
}

export const EditForm = ({
  defaultValues,
  onSubmit,
  isSubmitting,
  apiError,
}: EditFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateEpigramFormData>({
    resolver: zodResolver(createEpigramSchema),
    defaultValues,
  });

  const watchedContent = watch("content", "");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Save className="w-5 h-5" />
          에피그램 수정
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* API 에러 메시지 */}
          {apiError && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
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
            <h3 className="text-sm font-medium text-gray-900">
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
              {isSubmitting ? "수정 중..." : "에피그램 수정"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
