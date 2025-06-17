import Link from "next/link";
import Image from "next/image";

export default function AuthNavbar() {
  return (
    <header className="w-full py-6 flex justify-center border-b border-gray-200 bg-white">
      <Link
        href="/"
        className="hover:opacity-80 transition-opacity flex items-center"
      >
        <Image
          src="/logo.png"
          alt="Epigram"
          width={120}
          height={40}
          className="h-8 w-auto"
        />
      </Link>
    </header>
  );
}
