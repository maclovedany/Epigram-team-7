import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services";
import { useAuthStore } from "@/store/authStore";
import { LoginRequest, SignupRequest } from "@/types";

export const useAuth = () => {
  const router = useRouter();
  const { login, logout, setLoading } = useAuthStore();

  const handleLogin = useCallback(
    async (credentials: LoginRequest) => {
      try {
        setLoading(true);
        const response = await authService.login(credentials);

        login(response.user, response.accessToken);
        router.push("/epigramlist");

        return { success: true };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "로그인에 실패했습니다.";
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [login, setLoading, router]
  );

  const handleSignup = useCallback(
    async (data: SignupRequest) => {
      try {
        setLoading(true);
        const response = await authService.signup(data);

        login(response.user, response.accessToken);
        router.push("/epigramlist");

        return { success: true };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "회원가입에 실패했습니다.";
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [login, setLoading, router]
  );

  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.warn("Logout request failed:", error);
    } finally {
      logout();
      router.push("/");
    }
  }, [logout, router]);

  return {
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
  };
};
