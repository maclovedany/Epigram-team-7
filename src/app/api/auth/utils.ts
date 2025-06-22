import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_OPTIONS } from "../config";

// 토큰 추출 인터페이스
export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  user: any;
}

// 로그인 응답에서 토큰 추출
export function extractTokensFromResponse(data: any): AuthTokens | null {
  let accessToken, refreshToken, user;

  if (data && data.data) {
    // 표준 구조: { data: { accessToken, refreshToken, user } }
    ({ accessToken, refreshToken, user } = data.data);
  } else if (data && data.user && data.accessToken) {
    // 직접 구조: { accessToken, refreshToken, user }
    ({ accessToken, refreshToken, user } = data);
  } else {
    console.error("예상하지 못한 응답 구조:", data);
    return null;
  }

  if (!accessToken || !user) {
    console.error("필수 인증 정보 누락:", {
      accessToken: !!accessToken,
      user: !!user,
    });
    return null;
  }

  return { accessToken, refreshToken, user };
}

// 쿠키에서 토큰 가져오기
export async function getTokenFromCookies(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
}

// 인증 쿠키 설정
export function setAuthCookies(
  response: NextResponse,
  tokens: AuthTokens
): NextResponse {
  response.cookies.set(
    "accessToken",
    tokens.accessToken,
    COOKIE_OPTIONS.ACCESS_TOKEN
  );

  if (tokens.refreshToken) {
    response.cookies.set(
      "refreshToken",
      tokens.refreshToken,
      COOKIE_OPTIONS.REFRESH_TOKEN
    );
  }

  return response;
}

// 인증 쿠키 삭제
export function deleteAuthCookies(response: NextResponse): NextResponse {
  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");
  return response;
}

// 401 에러 시 쿠키 삭제 및 응답 생성
export function handleUnauthorized(data: any, message?: string): NextResponse {
  const response = NextResponse.json(
    data || { message: message || "인증이 만료되었습니다." },
    { status: 401 }
  );

  return deleteAuthCookies(response);
}

// 성공적인 로그인 응답 생성
export function createLoginResponse(tokens: AuthTokens): NextResponse {
  const response = NextResponse.json({
    data: { user: tokens.user },
  });

  return setAuthCookies(response, tokens);
}

// 성공적인 로그아웃 응답 생성
export function createLogoutResponse(
  message: string = "로그아웃되었습니다."
): NextResponse {
  const response = NextResponse.json({ message });
  return deleteAuthCookies(response);
}

// 에러 응답 생성 (쿠키 삭제 포함)
export function createErrorResponseWithCookieCleanup(
  message: string,
  status: number = 500
): NextResponse {
  const response = NextResponse.json({ message }, { status });
  return deleteAuthCookies(response);
}
