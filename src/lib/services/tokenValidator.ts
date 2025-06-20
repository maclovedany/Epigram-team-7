export const tokenValidator = {
  // 토큰 가져오기
  getToken: (): string | null => {
    // localStorage와 sessionStorage 모두 확인
    let token = localStorage.getItem("authToken");
    if (!token) {
      token = sessionStorage.getItem("authToken");
    }
    return token;
  },

  // 토큰 유효성 검증
  validateToken: (token: string): boolean => {
    if (!token) return false;

    try {
      // JWT 토큰 기본 검증 (정교한 검증은 서버에서)
      const parts = token.split(".");
      if (parts.length !== 3) return false;

      // 페이로드 디코딩하여 만료 시간 확인
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      // 만료 시간 확인
      if (payload.exp && payload.exp < currentTime) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  },

  // 만료된 토큰 정리
  clearExpiredTokens: (): void => {
    const token = tokenValidator.getToken();
    if (token && !tokenValidator.validateToken(token)) {
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
    }
  },

  // 토큰 제거
  removeTokens: (): void => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
  },
};
