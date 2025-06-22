import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getApiUrl, createHeaders } from "../../../config";

// 좋아요 토글
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 쿠키에서 토큰 가져오기 (인증 필수)
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { message: "좋아요를 하려면 로그인이 필요합니다." },
        { status: 401 }
      );
    }

    console.log("좋아요 토글 요청:", { id });

    const response = await fetch(getApiUrl(`/epigrams/${id}/like`), {
      method: "POST",
      headers: createHeaders(accessToken),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        const nextResponse = NextResponse.json(
          { message: "인증이 만료되었습니다. 다시 로그인해주세요." },
          { status: 401 }
        );
        nextResponse.cookies.delete("accessToken");
        nextResponse.cookies.delete("refreshToken");
        return nextResponse;
      }
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("좋아요 토글 프록시 오류:", error);
    return NextResponse.json(
      { message: "좋아요 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
