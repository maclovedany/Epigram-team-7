import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const PageHeader = () => {
  return (
    <div className="flex items-center mb-8">
      <Link
        href="/epigramlist"
        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span>목록으로 돌아가기</span>
      </Link>
    </div>
  );
};
