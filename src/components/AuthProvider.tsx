"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/lib/services/authService";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, logout, setLoading } = useAuthStore();
  const [initialized, setInitialized] = useState(false);
  const pathname = usePathname();

  // 인증이 필요하지 않은 페이지에서는 AuthProvider 실행하지 않음
  const isAuthPage =
    pathname?.includes("/login") || pathname?.includes("/signup");

  useEffect(() => {
    // 이미 초기화되었거나 인증 페이지라면 실행하지 않음
    if (initialized || isAuthPage) return;

    const initializeAuth = async () => {
      setLoading(true);
      try {
        console.log("인증 상태 초기화 시작...");
        const user = await authService.getCurrentUser();
        if (user) {
          setUser(user);
          console.log("인증 상태 초기화 완료:", user);
        } else {
          logout();
          console.log("인증되지 않은 사용자");
        }
      } catch (error) {
        console.error("인증 상태 초기화 실패:", error);
        logout();
      } finally {
        setLoading(false);
        setInitialized(true); // 초기화 완료 플래그 설정
      }
    };

    initializeAuth();
  }, [isAuthPage, initialized]); // isAuthPage를 의존성에 추가

  return <>{children}</>;
}
