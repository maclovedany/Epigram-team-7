import { useRouter } from "next/navigation";
import { epigramService } from "@/lib/services/epigramService";
import { Epigram } from "@/types";

export function useEpigramActions() {
  const router = useRouter();

  const deleteEpigram = async (epigram: Epigram) => {
    if (!epigram || !window.confirm("이 에피그램을 삭제하시겠습니까?")) return;

    try {
      await epigramService.deleteEpigram(epigram.id.toString());
      router.push("/epigramlist");
      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "삭제에 실패했습니다.";
      alert("삭제에 실패했습니다: " + errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const shareEpigram = async (epigram: Epigram) => {
    if (!epigram) return;

    const shareUrl = window.location.href;
    const shareText = `"${epigram.content}" - ${epigram.author}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Epigram",
          text: shareText,
          url: shareUrl,
        });
        return { success: true };
      } catch {
        // 공유 취소시 에러 무시
        return { success: false, cancelled: true };
      }
    } else {
      // fallback: 클립보드에 복사
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        alert("링크가 클립보드에 복사되었습니다!");
        return { success: true };
      } catch {
        alert("공유 링크: " + shareUrl);
        return { success: false, error: "클립보드 복사에 실패했습니다." };
      }
    }
  };

  return {
    deleteEpigram,
    shareEpigram,
  };
}
