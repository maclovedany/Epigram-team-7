import Link from "next/link";
import { Button } from "@/components/ui";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-100 py-20 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] -z-10" />

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center rounded-full bg-primary-100 px-4 py-2 text-sm font-medium text-primary-700">
            <span className="mr-2">✨</span>
            새로운 방식의 명언 공유 플랫폼
          </div>

          {/* Main heading */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-text-primary lg:text-6xl">
            내일 갓 잡게 찻견!
            <br />
            <span className="text-primary-600">어떤 글이 당시였나?</span>
          </h1>

          {/* Subtitle */}
          <p className="mb-8 text-lg text-text-secondary lg:text-xl">
            오늘을 잡을 그리는 사람은 어제를 붙든다.
            <br />
            당신만의 특별한 에피그램을 공유하고, 다른 사람들의 지혜를
            만나보세요.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/epigrams">
              <Button size="lg" className="w-full sm:w-auto">
                에피그램 둘러보기
              </Button>
            </Link>
            <Link href="/addepigram">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                에피그램 작성하기
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 lg:gap-16">
            <div>
              <div className="text-3xl font-bold text-primary-600">1,000+</div>
              <div className="text-sm text-text-tertiary">등록된 에피그램</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">500+</div>
              <div className="text-sm text-text-tertiary">활성 사용자</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">10,000+</div>
              <div className="text-sm text-text-tertiary">총 좋아요</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
