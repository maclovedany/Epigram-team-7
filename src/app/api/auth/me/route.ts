import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("accessToken")?.value;
    const userInfo = request.cookies.get("userInfo")?.value;

    if (!accessToken || !userInfo) {
      return NextResponse.json(
        { message: "인증 정보가 없습니다." },
        { status: 401 }
      );
    }

    // 쿠키에서 사용자 정보 파싱
    const user = JSON.parse(userInfo);
    console.log("쿠키에서 사용자 정보 조회:", user);

    return NextResponse.json({ user });
  } catch (error) {
    console.error("사용자 정보 확인 오류:", error);
    return NextResponse.json(
      { message: "사용자 정보 확인 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
