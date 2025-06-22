export const API_CONFIG = {
  BASE_URL: "https://fe-project-epigram-api.vercel.app",
  TEAM_ID: "14-98",
} as const;

// 편의를 위한 헬퍼 함수
export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}/${API_CONFIG.TEAM_ID}${endpoint}`;
};

// 공통 헤더 생성 함수
export const createHeaders = (accessToken?: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return headers;
};

// 쿠키 설정 옵션
export const COOKIE_OPTIONS = {
  ACCESS_TOKEN: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 60 * 60, // 1시간
    path: "/",
  },
  REFRESH_TOKEN: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 60 * 60 * 24 * 7, // 7일
    path: "/",
  },
} as const;
