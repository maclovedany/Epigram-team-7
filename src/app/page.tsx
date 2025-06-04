import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-secondary p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-text-primary mb-2">
            🌟 Epigram 디자인 시스템
          </h1>
          <p className="text-text-secondary">
            컴포넌트들과 디자인 토큰 확인 페이지
          </p>
        </div>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Primary Colors</h3>
                <div className="flex gap-2">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(
                    (shade) => (
                      <div key={shade} className="text-center">
                        <div
                          className={`w-12 h-12 rounded-lg bg-primary-${shade} border`}
                        />
                        <span className="text-xs mt-1 block">{shade}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Gray Colors</h3>
                <div className="flex gap-2">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(
                    (shade) => (
                      <div key={shade} className="text-center">
                        <div
                          className={`w-12 h-12 rounded-lg bg-gray-${shade} border`}
                        />
                        <span className="text-xs mt-1 block">{shade}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card>
          <CardHeader>
            <CardTitle>Typography</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h1 className="text-4xl font-bold">Heading 1 - 제목입니다</h1>
                <h2 className="text-3xl font-bold">Heading 2 - 부제목입니다</h2>
                <h3 className="text-2xl font-bold">Heading 3 - 소제목입니다</h3>
                <p className="text-base text-text-primary">
                  본문 텍스트입니다. Pretendard 폰트가 적용되어 있습니다.
                </p>
                <p className="text-sm text-text-secondary">
                  보조 텍스트입니다. 조금 더 작은 크기입니다.
                </p>
                <p className="text-xs text-text-tertiary">
                  캡션 텍스트입니다. 가장 작은 크기입니다.
                </p>
              </div>
              <div className="font-serif">
                <p className="text-lg">
                  "오늘을 잡을 그리는 사람은 어제를 붙든다" - 세리프 폰트 예시
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4 items-center">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>

              <div className="flex gap-4 items-center">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>

              <div className="flex gap-4 items-center">
                <Button isLoading>Loading</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Elements */}
        <Card>
          <CardHeader>
            <CardTitle>Form Elements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 max-w-md">
              <Input
                label="이메일"
                type="email"
                placeholder="your@email.com"
                helperText="이메일 주소를 입력해주세요"
              />

              <Input
                label="비밀번호"
                type="password"
                placeholder="••••••••"
                required
              />

              <Input
                label="오류 예시"
                placeholder="잘못된 입력"
                error="올바른 형식이 아닙니다"
              />

              <Button className="w-full">회원가입</Button>
            </div>
          </CardContent>
        </Card>

        {/* Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Card Variants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card variant="default" padding="sm">
                <h3 className="font-medium mb-2">Default Card</h3>
                <p className="text-sm text-text-secondary">
                  기본 카드 스타일입니다.
                </p>
              </Card>

              <Card variant="outlined" padding="sm">
                <h3 className="font-medium mb-2">Outlined Card</h3>
                <p className="text-sm text-text-secondary">
                  테두리가 강조된 카드입니다.
                </p>
              </Card>

              <Card variant="elevated" padding="sm">
                <h3 className="font-medium mb-2">Elevated Card</h3>
                <p className="text-sm text-text-secondary">
                  그림자가 있는 카드입니다.
                </p>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
