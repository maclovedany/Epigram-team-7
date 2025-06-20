# 🌟 Epigram - 감정 공유 플랫폼

> 나만 갖고 있기엔 아까운 명언과 글귀를 다른 사람들과 공유하는 플랫폼

## 📖 프로젝트 소개

Epigram은 사용자들이 감동받은 명언, 글귀, 토막 상식들을 공유하고 소통할 수 있는 웹 플랫폼입니다. 감정 상태에 따라 적절한 위로와 영감을 받을 수 있으며, 태그 시스템을 통해 원하는 내용을 쉽게 찾아볼 수 있습니다.

## 🎯 주요 기능

- **에피그램 작성 및 공유**: 인상 깊은 명언과 글귀를 작성하고 공유
- **에피그램 수정 및 삭제**: 본인이 작성한 에피그램의 편집 및 관리
- **태그 시스템**: 에피그램에 태그를 추가하여 분류 (최대 3개, 10자 제한)
- **사용자 상호작용**: 좋아요, 댓글을 통한 소통
- **댓글 시스템**: 실시간 댓글 작성, 수정, 삭제 기능 (100자 제한)
- **공개 피드**: 모든 사용자의 에피그램을 시간순으로 조회
- **반응형 디자인**: 모바일과 데스크톱 모든 환경에서 최적화된 경험
- **권한 기반 접근 제어**: 작성자만 수정/삭제 가능

## 🚀 기술 스택

### Frontend

- **Framework**: Next.js 15.3.3 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.4.17
- **State Management**: Zustand 5.0.5
- **Form Handling**: React Hook Form 7.57.0 + Zod 3.25.50
- **Icons**: Lucide React 0.512.0
- **HTTP Client**: Axios 1.9.0
- **Utilities**: clsx 2.1.1, tailwind-merge 3.3.0

### Development Tools

- **Linting**: ESLint 9 (Next.js Config)
- **Code Quality**: TypeScript Strict Mode
- **Package Manager**: npm
- **Build Tool**: Next.js Built-in

## 🏗️ 아키텍처 특징

### 📦 모듈화된 서비스 레이어

- **책임 분리**: 각 기능별로 독립적인 서비스 모듈
- **재사용성**: 컴포넌트 간 공통 로직 공유
- **유지보수성**: 기능별 분리로 코드 관리 용이

### 🔧 커스텀 훅 시스템

- **단일 책임 원칙**: 각 훅이 하나의 기능만 담당
- **조합 가능성**: 작은 훅들을 조합하여 복잡한 기능 구현
- **테스트 용이성**: 독립적인 훅으로 단위 테스트 가능

### 🎨 컴포넌트 설계

- **UI/비즈니스 로직 분리**: 재사용 가능한 UI 컴포넌트
- **Props 인터페이스**: TypeScript로 타입 안정성 보장
- **접근성**: 키보드 네비게이션 및 스크린 리더 지원

## 📁 프로젝트 구조

```
src/
├── app/                          # Next.js App Router 페이지
│   ├── (auth)/                   # 인증 관련 페이지 그룹
│   │   ├── components/           # 인증 전용 컴포넌트
│   │   ├── hooks/                # 인증 관련 커스텀 훅
│   │   ├── login/                # 로그인 페이지
│   │   └── signup/               # 회원가입 페이지
│   ├── addepigram/               # 에피그램 작성 페이지
│   │   ├── components/           # 작성 폼 컴포넌트
│   │   └── hooks/                # 작성 관련 훅 (분리된 구조)
│   │       ├── useAddEpigram.ts  # 메인 훅
│   │       ├── useFormValidation.ts  # 유효성 검증
│   │       ├── useTagManager.ts  # 태그 관리
│   │       └── useEpigramSubmit.ts   # 제출 처리
│   ├── epigramlist/              # 에피그램 목록 및 상세
│   │   ├── [id]/                 # 동적 라우팅
│   │   │   ├── components/       # 상세 페이지 컴포넌트
│   │   │   ├── hooks/            # 상세 페이지 훅 (분리된 구조)
│   │   │   │   ├── useEpigramDetail.ts   # 메인 훅
│   │   │   │   ├── useLikeToggle.ts      # 좋아요 처리
│   │   │   │   └── useEpigramActions.ts  # 삭제/공유 처리
│   │   │   ├── edit/             # 수정 페이지
│   │   │   │   ├── components/   # 수정 폼 컴포넌트
│   │   │   │   └── hooks/        # 수정 관련 훅 (분리된 구조)
│   │   │   │       ├── useEditEpigram.ts     # 메인 훅
│   │   │   │       ├── useEpigramLoader.ts   # 데이터 로딩
│   │   │   │       └── useUpdateEpigram.ts   # 업데이트 처리
│   │   │   └── page.tsx          # 상세 페이지
│   │   ├── components/           # 목록 페이지 컴포넌트
│   │   ├── hooks/                # 목록 관련 훅
│   │   └── page.tsx              # 목록 페이지
│   ├── components/               # 글로벌 컴포넌트
│   ├── page.tsx                  # 랜딩 페이지
│   ├── layout.tsx                # 글로벌 레이아웃
│   └── globals.css               # 글로벌 스타일
├── components/                   # 재사용 가능한 컴포넌트
│   ├── ui/                       # 기본 UI 컴포넌트
│   │   ├── Button.tsx            # 버튼 컴포넌트
│   │   ├── Input.tsx             # 입력 컴포넌트
│   │   ├── Card.tsx              # 카드 컴포넌트
│   │   ├── CommentSection.tsx    # 통합 댓글 컴포넌트
│   │   ├── EpigramTagInput.tsx   # 태그 입력 컴포넌트
│   │   ├── LoadingSpinner.tsx    # 로딩 스피너
│   │   └── EmptyState.tsx        # 빈 상태 컴포넌트
│   └── layout/                   # 레이아웃 컴포넌트
│       └── Header.tsx            # 헤더 컴포넌트
├── lib/                          # 유틸리티 및 설정
│   ├── services/                 # 서비스 레이어 (분리된 구조)
│   │   ├── api.ts                # API 클라이언트 설정
│   │   ├── authService.ts        # 인증 서비스
│   │   ├── epigramService.ts     # 에피그램 통합 서비스
│   │   ├── epigramCRUD.ts        # 에피그램 CRUD 작업
│   │   ├── epigramLike.ts        # 좋아요 처리
│   │   ├── commentService.ts     # 댓글 서비스
│   │   ├── tokenValidator.ts     # 토큰 검증 유틸리티
│   │   └── index.ts              # 서비스 통합 내보내기
│   ├── api.ts                    # 레거시 API 설정
│   ├── utils.ts                  # 공통 유틸리티
│   └── validations.ts            # Zod 스키마 및 유효성 검사
├── hooks/                        # 글로벌 커스텀 훅
│   ├── useAuth.ts                # 인증 상태 관리
│   ├── useEpigrams.ts            # 에피그램 목록 관리
│   └── index.ts                  # 훅 통합 내보내기
├── store/                        # 상태 관리
│   ├── authStore.ts              # 인증 상태 (Zustand)
│   └── epigramStore.ts           # 에피그램 상태 (Zustand)
└── types/                        # TypeScript 타입 정의
    └── index.ts                  # 공통 타입 정의
```

## 🎨 주요 페이지

### 🏠 랜딩 페이지 (`/`)

- 서비스 소개 및 주요 기능 안내
- 반응형 디자인으로 모든 디바이스 지원
- CTA 버튼을 통한 에피그램 둘러보기
- 4단계 서비스 소개 섹션

### 📝 에피그램 피드 (`/epigramlist`)

- 2열 그리드 레이아웃으로 에피그램 표시
- 공책 스타일 배경 디자인
- 무한 스크롤 방식의 페이지네이션 (6개씩 로드)
- 태그 표시 (클릭 기능 없음)
- 플로팅 작성 버튼

### 📖 에피그램 상세 페이지 (`/epigramlist/[id]`)

- 공책 배경의 카드 형태 에피그램 표시
- 좋아요 및 소스 링크 버튼
- 작성자 권한에 따른 케밥 메뉴 (수정/삭제)
- 실시간 댓글 시스템
  - 댓글 작성, 수정, 삭제 (작성자만)
  - 상대적 시간 표시
  - 텍스트 기반 수정/삭제 버튼
  - 댓글 간 구분선

### ✍️ 에피그램 작성 (`/addepigram`)

- 단계별 폼 구성
- 태그 입력 시스템 (최대 3개, 10자 제한)
- 출처 정보 및 URL 링크 추가 가능
- 실시간 폼 유효성 검사
- 미리보기 기능

### 🔧 에피그램 수정 (`/epigramlist/[id]/edit`)

- 기존 데이터 자동 로드
- 작성자 권한 검증
- 작성 페이지와 동일한 인터페이스
- 무한 루프 방지 최적화

### 👤 인증 시스템

- **로그인** (`/login`): 이메일/비밀번호 로그인
- **회원가입** (`/signup`): 이메일, 비밀번호, 닉네임 등록
- JWT 토큰 기반 인증
- 자동 토큰 갱신

## 💬 댓글 기능

### 기본 기능

- 로그인한 사용자만 댓글 작성 가능
- 실시간 댓글 수정 및 삭제 (작성자 본인만)
- 상대적 시간 표시 (방금 전, N분 전 등)
- 100자 제한

### UI/UX 개선사항

- 댓글 목록 배경색 통일 (회색 배경)
- 작성시간을 작성자명 오른쪽에 배치
- 댓글 간 구분선 추가
- 수정/삭제 버튼 텍스트화 및 밑줄 처리
- 삭제 버튼 빨간색 강조
- 댓글 내용 들여쓰기 (작성자명과 정렬)
- 댓글 내용 글자 크기 축소 (가독성 향상)

## 🌐 API 정보

- **팀 ID**: `14-98`
- **API Base URL**: `https://fe-project-epigram-api.vercel.app`
- **인증 방식**: JWT Bearer Token
- **API 문서**: REST API 기반

## 배포 : https://epigram-team-7.vercel.app/
