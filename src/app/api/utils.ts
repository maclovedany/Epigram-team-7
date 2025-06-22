import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// 쿠키에서 토큰 가져오기 (공통 함수)
export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
}

// 인증 필수 체크
export async function requireAuth(): Promise<{ token: string } | NextResponse> {
  const token = await getAccessToken();

  if (!token) {
    return NextResponse.json(
      { message: "인증이 필요합니다." },
      { status: 401 }
    );
  }

  return { token };
}

// 401 에러 처리 (쿠키 삭제 포함)
export function handleAuthError(data: any): NextResponse {
  const response = NextResponse.json(data, { status: 401 });
  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");
  return response;
}

// 일반적인 에러 응답 생성
export function createErrorResponse(
  message: string,
  status: number = 500
): NextResponse {
  return NextResponse.json({ message }, { status });
}

// 성공 응답 생성
export function createSuccessResponse(
  data: any,
  status: number = 200
): NextResponse {
  return NextResponse.json(data, { status });
}
