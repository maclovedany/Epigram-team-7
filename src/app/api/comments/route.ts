import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getApiUrl, createHeaders } from "../config";

// 댓글 목록 조회
export async function GET(request: NextRequest) {
  try {
    // URL 파라미터 추출
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    // 쿠키에서 토큰 가져오기 (선택사항)
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    console.log("댓글 목록 조회 요청:", queryString);

    const response = await fetch(
      getApiUrl(`/comments${queryString ? `?${queryString}` : ""}`),
      {
        method: "GET",
        headers: createHeaders(accessToken),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 && accessToken) {
        const nextResponse = NextResponse.json(data, {
          status: response.status,
        });
        nextResponse.cookies.delete("accessToken");
        nextResponse.cookies.delete("refreshToken");
        return nextResponse;
      }
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("댓글 목록 조회 프록시 오류:", error);
    return NextResponse.json(
      { message: "댓글 목록 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 댓글 생성
export async function POST(request: NextRequest) {
  try {
    // 쿠키에서 토큰 가져오기 (인증 필수)
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { message: "댓글을 작성하려면 로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("댓글 생성 요청:", body);

    const response = await fetch(getApiUrl("/comments"), {
      method: "POST",
      headers: createHeaders(accessToken),
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        const nextResponse = NextResponse.json(data, {
          status: response.status,
        });
        nextResponse.cookies.delete("accessToken");
        nextResponse.cookies.delete("refreshToken");
        return nextResponse;
      }
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("댓글 생성 프록시 오류:", error);
    return NextResponse.json(
      { message: "댓글 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
