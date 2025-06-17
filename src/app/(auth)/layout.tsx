import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F5F6FA] flex flex-col">
      {/* 상단 네비게이션바 */}
      <nav className="w-full bg-white border-b border-[#E9EBF0] h-16 flex items-center justify-center">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Epigram"
            width={140}
            height={40}
            className="cursor-pointer"
          />
        </Link>
      </nav>
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
