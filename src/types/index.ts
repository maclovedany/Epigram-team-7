// User Types
export interface User {
  id: number;
  email: string;
  nickname: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  passwordConfirmation: string;
  nickname: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Epigram Types
export interface Epigram {
  id: number;
  content: string;
  author: string;
  referenceTitle?: string;
  referenceUrl?: string;
  tags: string[];
  writerId: number;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEpigramRequest {
  content: string;
  author: string;
  referenceTitle?: string;
  referenceUrl?: string;
  tags: string[];
}

// Comment Types
export interface Comment {
  id: number;
  content: string;
  writer: {
    id: number;
    nickname: string;
    image?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentRequest {
  content: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  list: T[];
  totalCount: number;
  nextCursor?: number;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  passwordConfirmation: string;
  nickname: string;
}
