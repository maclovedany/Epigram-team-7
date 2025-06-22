import { NextRequest, NextResponse } from "next/server";
import { getApiUrl, createHeaders } from "../../config";
import {
  extractTokensFromResponse,
  createLoginResponse,
  createErrorResponseWithCookieCleanup,
} from "../utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("프록시 로그인 요청:", body);

    // 외부 API 서버로 프록시 요청
    const response = await fetch(getApiUrl("/auth/signIn"), {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("외부 API 응답:", data);

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // 토큰 추출
    const tokens = extractTokensFromResponse(data);
    if (!tokens) {
      return createErrorResponseWithCookieCleanup(
        "서버 응답 형식이 올바르지 않습니다."
      );
    }

    console.log("쿠키 설정 완료, 사용자 정보:", tokens.user);

    // 성공 응답 생성 (쿠키 포함)
    return createLoginResponse(tokens);
  } catch (error) {
    console.error("로그인 프록시 오류:", error);
    return createErrorResponseWithCookieCleanup(
      "로그인 처리 중 오류가 발생했습니다."
    );
  }
}
