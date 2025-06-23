import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { accessToken, userInfo } = await request.json();

    if (!accessToken || !userInfo) {
      return NextResponse.json(
        { message: "액세스 토큰과 사용자 정보가 필요합니다." },
        { status: 400 }
      );
    }

    // 네이버 사용자 정보에서 필요한 데이터 추출
    const { id, email, nickname, name } = userInfo;

    if (!email) {
      return NextResponse.json(
        { message: "이메일 정보가 필요합니다." },
        { status: 400 }
      );
    }

    // 여기서 실제로는 다음과 같은 로직을 구현해야 합니다:
    // 1. 네이버 ID로 기존 사용자 확인
    // 2. 기존 사용자가 없으면 새로 생성
    // 3. JWT 토큰 생성
    // 4. 사용자 정보 반환

    // 임시로 더미 응답 반환 (실제 구현 시 데이터베이스 연동 필요)
    const user = {
      id: `naver_${id}`,
      email,
      nickname: nickname || name || email.split("@")[0],
      provider: "naver",
      providerId: id,
    };

    // JWT 토큰 생성 (실제 구현 시 JWT 라이브러리 사용)
    const jwtToken = `dummy_jwt_token_for_${user.id}`;

    const response = NextResponse.json({
      user,
      accessToken: jwtToken,
      refreshToken: `refresh_${jwtToken}`,
    });

    // 쿠키에 토큰 설정
    response.cookies.set("accessToken", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7일
    });

    response.cookies.set("refreshToken", `refresh_${jwtToken}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30일
    });

    return response;
  } catch (error) {
    console.error("네이버 로그인 처리 오류:", error);

    return NextResponse.json(
      { message: "네이버 로그인 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
