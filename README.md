# 🌟 Epigram - 감정 공유 플랫폼

> 나만 갖고 있기엔 아까운 명언과 글귀를 다른 사람들과 공유하는 플랫폼

## 📖 프로젝트 소개

Epigram은 사용자들이 감동받은 명언, 글귀, 토막 상식들을 공유하고 소통할 수 있는 웹 플랫폼입니다. 감정 상태에 따라 적절한 위로와 영감을 받을 수 있으며, 태그 시스템을 통해 원하는 내용을 쉽게 찾아볼 수 있습니다.

## 🎯 주요 기능

- **에피그램 작성 및 공유**: 인상 깊은 명언과 글귀를 작성하고 공유
- **에피그램 수정 및 삭제**: 본인이 작성한 에피그램의 편집 및 관리
- **감정 기반 태그 시스템**: 태그를 통해 감정별로 글을 분류하고 검색
- **사용자 상호작용**: 좋아요, 댓글을 통한 소통
- **댓글 시스템**: 실시간 댓글 작성, 수정, 삭제 기능
- **개인화된 피드**: 관심 있는 내용을 모아볼 수 있는 맞춤 피드
- **반응형 디자인**: 모바일과 데스크톱 모든 환경에서 최적화된 경험

## 🚀 기술 스택

### Frontend

- **Framework**: Next.js 15.3.3 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.4.17
- **State Management**: Zustand 5.0.5
- **Form Handling**: React Hook Form 7.57.0 + Zod 3.25.50
- **Icons**: Lucide React 0.512.0
- **HTTP Client**: Axios 1.9.0

### Development Tools

- **Linting**: ESLint 9 (Next.js Config)
- **Code Quality**: TypeScript Strict Mode
- **Package Manager**: npm

## 📁 프로젝트 구조

```
src/
├── app/                          # Next.js App Router 페이지
│   ├── addepigram/              # 에피그램 작성 페이지
│   ├── epigramlist/             # 에피그램 목록 및 상세 페이지
│   │   └── [id]/                # 동적 라우팅
│   │       ├── page.tsx         # 상세 페이지
│   │       └── edit/            # 수정 페이지
│   ├── login/                   # 로그인 페이지
│   ├── signup/                  # 회원가입 페이지
│   ├── page.tsx                 # 랜딩 페이지
│   ├── layout.tsx               # 글로벌 레이아웃
│   └── globals.css              # 글로벌 스타일
├── components/                   # 재사용 가능한 컴포넌트
│   ├── ui/                      # 기본 UI 컴포넌트
│   ├── layout/                  # 레이아웃 컴포넌트
│   └── epigram/                 # 에피그램 관련 컴포넌트
├── lib/                         # 유틸리티 및 설정
│   ├── api.ts                   # API 서비스 함수
│   ├── utils.ts                 # 공통 유틸리티
│   └── validations.ts           # Zod 스키마 및 유효성 검사
├── store/                       # 상태 관리
│   └── authStore.ts             # 인증 상태 관리
└── types/                       # TypeScript 타입 정의
    └── index.ts                 # 공통 타입 정의
```

## 🎨 주요 페이지

### 🏠 랜딩 페이지 (`/`)

- 서비스 소개 및 주요 기능 안내
- 반응형 디자인으로 모든 디바이스 지원
- CTA 버튼을 통한 에피그램 둘러보기

### 📝 에피그램 피드 (`/epigramlist`)

- 2열 그리드 레이아웃으로 에피그램 표시
- 공책 스타일 배경 디자인
- 무한 스크롤 방식의 페이지네이션 (6개씩 로드)
- 태그 기반 필터링

### 📖 에피그램 상세 페이지 (`/epigramlist/[id]`)

- 공책 배경의 카드 형태 에피그램 표시
- 좋아요 및 소스 링크 버튼
- 작성자 권한에 따른 수정/삭제 기능
- 실시간 댓글 시스템 (작성, 수정, 삭제)

### ✍️ 에피그램 작성 (`/addepigram`)

- 태그 입력 시스템 (최대 3개)
- 출처 정보 및 URL 링크 추가 가능
- 폼 유효성 검사

### 🔧 에피그램 수정 (`/epigramlist/[id]/edit`)

- 기존 데이터 자동 로드
- 작성자 권한 검증
- 작성 페이지와 동일한 인터페이스

### 👤 인증 시스템

- **로그인** (`/login`): 이메일/비밀번호 로그인
- **회원가입** (`/signup`): 이메일, 비밀번호, 닉네임 등록

## 💬 댓글 기능

- 로그인한 사용자만 댓글 작성 가능
- 실시간 댓글 수정 및 삭제 (작성자 본인만)
- 상대적 시간 표시 (방금 전, N분 전 등)
- 100자 제한

## 🌐 팀 정보

- **팀 ID**: `14-98`
- **API Base URL**: `https://fe-project-epigram-api.vercel.app`

## 📦 배포

### Vercel 배포
