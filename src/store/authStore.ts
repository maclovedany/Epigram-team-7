import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      setToken: (token: string) => {
        set({ token });
        // localStorage에도 저장 (API interceptor에서 사용)
        if (typeof window !== "undefined") {
          localStorage.setItem("authToken", token);
        }
      },

      login: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
        // localStorage에서 기존 토큰 제거 후 새 토큰 저장
        if (typeof window !== "undefined") {
          localStorage.removeItem("authToken");
          localStorage.setItem("authToken", token);
          console.log("새 토큰 저장됨:", token);
          console.log("저장된 토큰 확인:", localStorage.getItem("authToken"));
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        // localStorage에서도 제거
        if (typeof window !== "undefined") {
          localStorage.removeItem("authToken");
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
