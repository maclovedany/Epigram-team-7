import { NextRequest, NextResponse } from "next/server";
import { getApiUrl, createHeaders } from "../config";
import {
  getAccessToken,
  requireAuth,
  handleAuthError,
  createErrorResponse,
} from "../utils";

export async function GET(request: NextRequest) {
  try {
    // URL 파라미터 추출
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    // 쿠키에서 토큰 가져오기 (선택사항 - 공개 에피그램 조회 시)
    const accessToken = await getAccessToken();

    // 외부 API 서버로 프록시 요청
    const response = await fetch(
      getApiUrl(`/epigrams${queryString ? `?${queryString}` : ""}`),
      {
        method: "GET",
        headers: createHeaders(accessToken),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // 401 에러 시 인증이 필요한 요청이었다면 에러 반환
      if (response.status === 401 && accessToken) {
        return handleAuthError(data);
      }
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("에피그램 목록 조회 프록시 오류:", error);
    return createErrorResponse("에피그램 목록 조회 중 오류가 발생했습니다.");
  }
}

export async function POST(request: NextRequest) {
  try {
    // 인증 필수 체크
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) {
      return authResult; // 인증 실패 응답
    }

    const { token } = authResult;
    const body = await request.json();
    console.log("에피그램 생성 요청:", body);

    // 외부 API 서버로 프록시 요청
    const response = await fetch(getApiUrl("/epigrams"), {
      method: "POST",
      headers: createHeaders(token),
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        return handleAuthError(data);
      }
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("에피그램 생성 프록시 오류:", error);
    return createErrorResponse("에피그램 생성 중 오류가 발생했습니다.");
  }
}
