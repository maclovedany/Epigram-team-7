import { Button } from "@/components/ui";

interface HeroSectionProps {
  isAuthenticated: boolean;
  onGetStarted: () => void;
  onCreateEpigram: () => void;
}

export const HeroSection = ({
  isAuthenticated,
  onGetStarted,
  onCreateEpigram,
}: HeroSectionProps) => {
  return (
    <section className="text-center py-20 px-4">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
        Epigram
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        기억에 남는 명언과 문장을 수집하고 공유하세요.
        <br />
        당신만의 에피그램 컬렉션을 만들어보세요.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={onGetStarted} className="px-8 py-3 text-lg">
          {isAuthenticated ? "에피그램 보기" : "시작하기"}
        </Button>

        {isAuthenticated && (
          <Button
            onClick={onCreateEpigram}
            variant="outline"
            className="px-8 py-3 text-lg"
          >
            에피그램 만들기
          </Button>
        )}
      </div>
    </section>
  );
};
