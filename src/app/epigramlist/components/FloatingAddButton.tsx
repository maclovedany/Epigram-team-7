import Link from "next/link";

interface FloatingAddButtonProps {
  isAuthenticated: boolean;
}

export function FloatingAddButton({ isAuthenticated }: FloatingAddButtonProps) {
  if (!isAuthenticated) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link
        href="/addepigram"
        className="bg-gray-800 text-white p-4 rounded-full shadow-lg hover:bg-gray-700 transition-colors flex items-center"
        style={{ display: "inline-flex" }}
      >
        <span className="text-xl">+</span>
        <span className="ml-2 text-sm">에피그램 만들기</span>
      </Link>
    </div>
  );
}
