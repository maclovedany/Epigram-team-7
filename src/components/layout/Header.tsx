"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/lib/services/authService";

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
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* Logo와 Navigation을 함께 묶기 */}
        <div className="flex items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Epigram"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </Link>

          {/* Navigation - 로고 바로 옆에 배치 */}
          <nav className="flex items-center ml-5">
            <Link
              href="/epigramlist"
              className="text-lg font-medium transition-colors hover:opacity-80"
              style={{ color: "#373737" }}
            >
              피드
            </Link>
            {isAuthenticated && (
              <Link
                href="/addepigram"
                className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors ml-8"
              >
                에피그램 작성
              </Link>
            )}
          </nav>
        </div>

        {/* Auth Section - 오른쪽 끝에 배치 */}
        <div className="flex items-center space-x-3 ml-auto">
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
