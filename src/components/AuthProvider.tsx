"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/lib/services/authService";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, logout, setLoading } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
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
      }
    };

    initializeAuth();
  }, [setUser, logout, setLoading]);

  return <>{children}</>;
}
