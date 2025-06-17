import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui";

export function PageHeader() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Link href="/epigramlist">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" />
            목록으로
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            에피그램 작성
          </h1>
          <p className="text-text-secondary mt-1">
            새로운 에피그램을 작성해보세요
          </p>
        </div>
      </div>
    </div>
  );
}
