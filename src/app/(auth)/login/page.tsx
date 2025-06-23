"use client";

import { Suspense } from "react";
import { LoginContent } from "./LoginContent";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm flex flex-col items-center">
          <div className="flex items-center justify-center mb-12 mt-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Epigram"
              className="h-16 w-auto"
              style={{ imageRendering: "crisp-edges" }}
            />
          </div>
          <div className="w-full">
            <Suspense fallback={<div>로딩 중...</div>}>
              <LoginContent />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
