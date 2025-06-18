import { z } from "zod";

// 로그인 폼 스키마
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .email("올바른 이메일 형식이 아닙니다"),
  password: z
    .string()
    .min(1, "비밀번호를 입력해주세요")
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다"),
});

// 회원가입 폼 스키마
export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, "이메일을 입력해주세요")
      .email("올바른 이메일 형식이 아닙니다"),
    password: z
      .string()
      .min(1, "비밀번호를 입력해주세요")
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)/,
        "비밀번호는 영문과 숫자를 포함해야 합니다"
      ),
    passwordConfirmation: z.string().min(1, "비밀번호 확인을 입력해주세요"),
    nickname: z
      .string()
      .min(1, "닉네임을 입력해주세요")
      .min(2, "닉네임은 최소 2자 이상이어야 합니다")
      .max(10, "닉네임은 최대 10자까지 가능합니다"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["passwordConfirmation"],
  });

// 에피그램 작성 폼 스키마
export const createEpigramSchema = z.object({
  content: z
    .string()
    .min(1, "에피그램 내용을 입력해주세요")
    .min(10, "에피그램은 최소 10자 이상이어야 합니다")
    .max(500, "에피그램은 최대 500자까지 가능합니다"),
  author: z
    .string()
    .min(1, "작가명을 입력해주세요")
    .max(50, "작가명은 최대 50자까지 가능합니다"),
  referenceTitle: z
    .string()
    .max(100, "출처 제목은 최대 100자까지 가능합니다")
    .optional(),
  referenceUrl: z
    .string()
    .url("올바른 URL 형식이 아닙니다")
    .optional()
    .or(z.literal("")),
  tags: z.array(z.string()).max(5, "태그는 최대 5개까지 가능합니다"),
});

// 댓글 작성 폼 스키마
export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "댓글 내용을 입력해주세요")
    .min(2, "댓글은 최소 2자 이상이어야 합니다")
    .max(300, "댓글은 최대 300자까지 가능합니다"),
  isPrivate: z.boolean().optional(),
});

// 타입 추출
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type CreateEpigramFormData = z.infer<typeof createEpigramSchema>;
export type CreateCommentFormData = z.infer<typeof createCommentSchema>;
