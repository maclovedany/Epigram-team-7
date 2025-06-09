"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/authService";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.warn("Logout request failed:", error);
    } finally {
      logout();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <span className="text-2xl">📝</span>
            <span className="text-xl font-bold text-text-primary">Epigram</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/epigrams"
            className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            피드
          </Link>
          {isAuthenticated && (
            <Link
              href="/addepigram"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              에피그램 작성
            </Link>
          )}
        </nav>

        {/* Auth Section */}
        <div className="flex items-center space-x-3">
          {isAuthenticated && user ? (
            // 로그인된 상태
            <>
              <div className="hidden sm:flex items-center space-x-2">
                <span className="text-sm text-text-secondary">안녕하세요,</span>
                <span className="text-sm font-medium text-text-primary">
                  {user.nickname}님
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                로그아웃
              </Button>
            </>
          ) : (
            // 로그아웃된 상태
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  로그인
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">
                  회원가입
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
