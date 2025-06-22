import { NextRequest, NextResponse } from "next/server";
import { getApiUrl, createHeaders } from "../../config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("프록시 회원가입 요청:", body);

    // 외부 API 서버로 프록시 요청
    const response = await fetch(getApiUrl("/auth/signUp"), {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("외부 API 응답:", data);

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // 회원가입은 성공 메시지만 반환 (자동 로그인 없음)
    return NextResponse.json({
      message: "회원가입이 완료되었습니다.",
      data: data.data || data,
    });
  } catch (error) {
    console.error("회원가입 프록시 오류:", error);
    return NextResponse.json(
      { message: "회원가입 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
