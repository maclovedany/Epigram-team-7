import Link from "next/link";

interface FloatingActionButtonProps {
  isAuthenticated: boolean;
}

export const FloatingActionButton = ({
  isAuthenticated,
}: FloatingActionButtonProps) => {
  if (!isAuthenticated) return null;

  return (
    <Link
      href="/addepigram"
      className="fixed bottom-6 right-6 bg-gray-800 text-white p-4 h-16 w-[194px] rounded-full shadow-lg hover:bg-gray-700 transition-colors z-50 inline-flex items-center justify-center"
    >
      <span className="text-xl">+</span>
      <span className="ml-2 text-[15px]">에피그램 만들기</span>
    </Link>
  );
};
