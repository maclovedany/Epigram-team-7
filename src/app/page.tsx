import Header from "@/components/layout/Header";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-24 relative">
          {/* 공책 스타일 배경 - Hero Section에만 적용 */}
          <div
            className="absolute inset-0 opacity-30 -mx-4"
            style={{
              backgroundImage: `repeating-linear-gradient(
                transparent,
                transparent 34px,
                #ddd 34px,
                #ddd 36px
              )`,
              backgroundSize: "100% 36px",
            }}
          />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              나만 갖고 있기엔
              <br />
              아까운 글이 있지 않나요?
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-medium">
              다른 사람들과 감정을 공유해 보세요.
            </p>
          </div>
        </section>

        {/* Feature Sections */}
        <div className="space-y-32">
          {/* 첫번째 섹션 - 카드 왼쪽, 텍스트 오른쪽 */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <Image
                src="/img_Desktop_landing01.png"
                alt="감정 반응 카드"
                width={700}
                height={500}
                className="w-full h-auto rounded-2xl shadow-lg"
              />
            </div>
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                명언이나 글귀,
                <br />
                토막 상식들을 공유해 보세요.
              </h2>
              <p className="text-lg md:text-xl text-blue-600 leading-relaxed">
                나만 알던 소중한 글들을
                <br />
                다른 사람들에게 전파하세요.
              </p>
            </div>
          </section>

          {/* 두번째 섹션 - 텍스트 왼쪽, 카드 오른쪽 */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6 text-right">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                감정 상태에 따라,
                <br />
                알맞은 위로를 받을 수 있어요.
              </h2>
              <p className="text-lg md:text-xl text-blue-600 leading-relaxed">
                태그를 통해 글을 모아 볼 수 있어요.
              </p>
            </div>
            <div className="lg:col-span-7">
              <Image
                src="/img_Desktop_landing02.png"
                alt="에피그램 카드들"
                width={700}
                height={500}
                className="w-full h-auto rounded-2xl shadow-lg"
              />
            </div>
          </section>

          {/* 세번째 섹션 - 카드 왼쪽, 텍스트 오른쪽 */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <Image
                src="/img_Desktop_landing03.png"
                alt="감정 통계 차트"
                width={700}
                height={500}
                className="w-full h-auto rounded-2xl shadow-lg"
              />
            </div>
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                내가 요즘 어떤 감정 상태인지
                <br />
                통계로 한눈에 볼 수 있어요.
              </h2>
              <p className="text-lg md:text-xl text-blue-600 leading-relaxed">
                감정 달력으로
                <br />내 마음에 담긴 감정을 확인해보세요.
              </p>
            </div>
          </section>

          {/* 네번째 섹션 - 카드 중앙 배치 */}
          <section className="text-center">
            <div className="max-w-5xl mx-auto">
              <Image
                src="/img_Desktop_landing04.png"
                alt="에피그램 피드"
                width={900}
                height={700}
                className="w-full h-auto rounded-2xl shadow-lg"
              />
            </div>
          </section>
        </div>

        {/* CTA Section */}
        <section className="text-center mt-32 mb-16 relative py-24">
          {/* 공책 스타일 배경 */}
          <div
            className="absolute inset-0 opacity-30 -mx-4"
            style={{
              backgroundImage: `repeating-linear-gradient(
                transparent,
                transparent 34px,
                #ddd 34px,
                #ddd 36px
              )`,
              backgroundSize: "100% 36px",
            }}
          />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              날마다
              <br />
              에피그램
            </h2>
            <a href="/epigramlist">
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors w-full sm:w-auto">
                에피그램 둘러보기
              </button>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
