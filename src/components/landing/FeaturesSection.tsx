import { Card, CardContent } from "@/components/ui";

const features = [
  {
    icon: "✍️",
    title: "에피그램 작성",
    description:
      "당신만의 특별한 에피그램을 작성하고 공유하세요. 감정과 생각을 담아 짧고 강렬한 문구로 표현해보세요.",
  },
  {
    icon: "📚",
    title: "다양한 에피그램 탐색",
    description:
      "다른 사용자들이 작성한 다양한 에피그램을 둘러보고, 마음에 드는 글에 좋아요와 댓글을 남겨보세요.",
  },
  {
    icon: "💭",
    title: "태그 기반 분류",
    description:
      "태그를 활용해 에피그램을 체계적으로 분류하고, 관심있는 주제의 글들을 쉽게 찾아보세요.",
  },
  {
    icon: "❤️",
    title: "소셜 인터랙션",
    description:
      "좋아요, 댓글, 공유 기능을 통해 다른 사용자들과 소통하고 영감을 나누어보세요.",
  },
  {
    icon: "🔗",
    title: "출처 링크 관리",
    description:
      "에피그램의 출처나 관련 링크를 함께 저장하여 더 풍부한 정보를 제공할 수 있습니다.",
  },
  {
    icon: "📊",
    title: "개인 통계",
    description:
      "내가 작성한 에피그램의 통계와 반응을 확인하고, 작성 활동을 추적해보세요.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold text-text-primary lg:text-4xl mb-4">
            에피그램과 함께하는
            <br />
            <span className="text-primary-600">특별한 경험</span>
          </h2>
          <p className="text-lg text-text-secondary">
            짧지만 강렬한 문구로 당신의 생각을 표현하고,
            <br />
            다른 사람들의 지혜로운 말들을 만나보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
