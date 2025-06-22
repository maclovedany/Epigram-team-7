import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getApiUrl, createHeaders } from "../../config";

// 댓글 수정
export async function PATCH(
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
        { message: "댓글 수정을 하려면 로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("댓글 수정 요청:", { id, body });

    const response = await fetch(getApiUrl(`/comments/${id}`), {
      method: "PATCH",
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
    console.error("댓글 수정 프록시 오류:", error);
    return NextResponse.json(
      { message: "댓글 수정 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 댓글 삭제
export async function DELETE(
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
        { message: "댓글 삭제를 하려면 로그인이 필요합니다." },
        { status: 401 }
      );
    }

    console.log("댓글 삭제 요청:", { id });

    const response = await fetch(getApiUrl(`/comments/${id}`), {
      method: "DELETE",
      headers: createHeaders(accessToken),
    });

    if (!response.ok) {
      const data = await response.json();
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

    return NextResponse.json({ message: "댓글이 삭제되었습니다." });
  } catch (error) {
    console.error("댓글 삭제 프록시 오류:", error);
    return NextResponse.json(
      { message: "댓글 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
