import Link from "next/link";
import { Button } from "@/components/ui";

export default function CTASection() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-r from-primary-600 to-primary-700">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white lg:text-4xl mb-6">
            지금 시작해보세요!
          </h2>
          <p className="text-xl text-primary-100 mb-8 lg:text-2xl">
            당신만의 에피그램을 작성하고
            <br />전 세계 사람들과 지혜를 나누어보세요
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/signup">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto bg-white text-primary-600 hover:bg-gray-50"
              >
                무료로 시작하기
              </Button>
            </Link>
            <Link href="/epigrams">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary-600"
              >
                에피그램 둘러보기
              </Button>
            </Link>
          </div>

          {/* Social proof */}
          <div className="text-center">
            <p className="text-primary-200 text-sm mb-4">
              이미 많은 사람들이 함께하고 있어요
            </p>
            <div className="flex justify-center items-center space-x-8 text-primary-100">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">👥</span>
                <span className="text-sm">500+ 사용자</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📝</span>
                <span className="text-sm">1,000+ 에피그램</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">❤️</span>
                <span className="text-sm">10,000+ 좋아요</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
