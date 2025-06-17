import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export const useHome = () => {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push("/epigramlist");
    } else {
      router.push("/login");
    }
  };

  const handleCreateEpigram = () => {
    if (isAuthenticated) {
      router.push("/addepigram");
    } else {
      router.push("/login");
    }
  };

  return {
    isAuthenticated,
    handleGetStarted,
    handleCreateEpigram,
  };
};
