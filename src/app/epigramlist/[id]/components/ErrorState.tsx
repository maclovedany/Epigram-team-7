import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui";

interface ErrorStateProps {
  error?: string;
}

export default function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-bg-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            에피그램을 찾을 수 없습니다
          </h2>
          <p className="text-text-secondary mb-6">
            {error || "요청하신 에피그램이 존재하지 않습니다."}
          </p>
          <Link href="/epigramlist">
            <Button variant="primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              목록으로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
