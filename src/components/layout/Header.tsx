"use client";

import Link from "next/link";
import { Button } from "@/components/ui";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-default bg-white/80 backdrop-blur-sm">
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
            에피그램 둘러보기
          </Link>
          <Link
            href="/addepigram"
            className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            에피그램 작성
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-3">
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
        </div>
      </div>
    </header>
  );
}
