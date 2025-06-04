import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border-default bg-bg-secondary">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-1 mb-4">
              <span className="text-2xl">📝</span>
              <span className="text-xl font-bold text-text-primary">
                Epigram
              </span>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              오늘을 잡을 그리는 사람은 어제를 붙든다.
              <br />
              당신만의 특별한 에피그램을 공유하세요.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">서비스</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/epigrams"
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  에피그램 둘러보기
                </Link>
              </li>
              <li>
                <Link
                  href="/addepigram"
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  에피그램 작성
                </Link>
              </li>
              <li>
                <Link
                  href="/epigramlist"
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  내 에피그램
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-text-primary mb-4">계정</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/login"
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  로그인
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  회원가입
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-text-primary mb-4">지원</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  도움말
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  문의하기
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border-default">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-text-tertiary">
              © 2024 Epigram. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href="#"
                className="text-sm text-text-tertiary hover:text-text-secondary transition-colors"
              >
                개인정보처리방침
              </Link>
              <Link
                href="#"
                className="text-sm text-text-tertiary hover:text-text-secondary transition-colors"
              >
                이용약관
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
