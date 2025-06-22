import { getApiUrl, createHeaders } from "../../config";
import { getTokenFromCookies, createLogoutResponse } from "../utils";

export async function POST() {
  try {
    // 쿠키에서 토큰 가져오기
    const accessToken = await getTokenFromCookies();

    console.log("프록시 로그아웃 요청");

    // 외부 API 서버로 프록시 요청 (토큰이 있는 경우에만)
    if (accessToken) {
      try {
        const response = await fetch(getApiUrl("/auth/signOut"), {
          method: "POST",
          headers: createHeaders(accessToken),
        });

        console.log("외부 API 로그아웃 응답:", response.status);
      } catch (error) {
        console.error("외부 API 로그아웃 오류:", error);
        // 외부 API 오류는 무시하고 계속 진행 (로컬 쿠키는 삭제)
      }
    }

    console.log("쿠키 삭제 완료");

    // 성공 응답 생성 (쿠키 삭제 포함)
    return createLogoutResponse();
  } catch (error) {
    console.error("로그아웃 프록시 오류:", error);

    // 오류가 발생해도 쿠키는 삭제
    return createLogoutResponse(
      "로그아웃 처리 중 오류가 발생했지만 로그아웃되었습니다."
    );
  }
}
