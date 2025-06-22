import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getApiUrl, createHeaders } from "../../config";

// 개별 에피그램 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 쿠키에서 토큰 가져오기 (선택사항)
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const response = await fetch(getApiUrl(`/epigrams/${id}`), {
      method: "GET",
      headers: createHeaders(accessToken),
    });

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
    console.error("에피그램 조회 프록시 오류:", error);
    return NextResponse.json(
      { message: "에피그램 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 에피그램 수정
export async function PUT(
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
        { message: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("에피그램 수정 요청:", { id, body });

    const apiUrl = getApiUrl(`/epigrams/${id}`);
    console.log("API URL:", apiUrl);

    // PATCH 메서드로 시도
    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers: createHeaders(accessToken),
      body: JSON.stringify(body),
    });

    console.log("외부 API 응답 상태:", response.status);

    const data = await response.json();
    console.log("외부 API 응답 데이터:", data);

    if (!response.ok) {
      console.log("외부 API 오류 응답:", { status: response.status, data });
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
    console.error("에피그램 수정 프록시 오류:", error);
    return NextResponse.json(
      { message: "에피그램 수정 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 에피그램 삭제
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
        { message: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    console.log("에피그램 삭제 요청:", { id });

    const response = await fetch(getApiUrl(`/epigrams/${id}`), {
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

    return NextResponse.json({ message: "에피그램이 삭제되었습니다." });
  } catch (error) {
    console.error("에피그램 삭제 프록시 오류:", error);
    return NextResponse.json(
      { message: "에피그램 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
