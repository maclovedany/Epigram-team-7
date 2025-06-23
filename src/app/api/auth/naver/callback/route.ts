import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/services/authService";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // 에러가 있는 경우
    if (error) {
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(
            "네이버 로그인이 취소되었습니다."
          )}`,
          request.url
        )
      );
    }

    // code가 없는 경우
    if (!code) {
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent("인증 코드가 없습니다.")}`,
          request.url
        )
      );
    }

    // 네이버 OAuth 로그인 처리 (null을 undefined로 변환)
    const authResponse = await authService.naverLogin(code, state || undefined);

    // 성공 시 쿠키 설정 및 리다이렉트
    const response = NextResponse.redirect(
      new URL("/epigramlist", request.url)
    );

    // 액세스 토큰을 httpOnly 쿠키로 설정
    response.cookies.set("accessToken", authResponse.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7일
    });

    // 리프레시 토큰도 설정 (있다면)
    if (authResponse.refreshToken) {
      response.cookies.set("refreshToken", authResponse.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30일
      });
    }

    return response;
  } catch (error) {
    console.error("네이버 OAuth 콜백 처리 오류:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "네이버 로그인 중 오류가 발생했습니다.";

    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorMessage)}`, request.url)
    );
  }
}
