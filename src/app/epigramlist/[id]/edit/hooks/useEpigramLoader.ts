import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { epigramService } from "@/lib/services/epigramService";
import { useAuthStore } from "@/store/authStore";
import { Epigram } from "@/types";

export function useEpigramLoader() {
  const [epigram, setEpigram] = useState<Epigram | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();

  const epigramId = params.id as string;

  useEffect(() => {
    const loadEpigramData = async () => {
      if (!epigramId) return;

      try {
        setIsLoading(true);
        const data = await epigramService.getEpigramById(epigramId);

        // 권한 검증 (필요시 활성화)
        // if (!user || user.id !== data.writerId) {
        //   router.push("/epigramlist");
        //   return;
        // }

        setEpigram(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "에피그램을 불러올 수 없습니다.";
        setError(errorMessage);
        router.push("/epigramlist");
      } finally {
        setIsLoading(false);
      }
    };

    loadEpigramData();
  }, [epigramId, user, router]);

  return {
    epigram,
    isLoading,
    error,
  };
}
