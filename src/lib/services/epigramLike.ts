import api from "../api";

export const epigramLike = {
  // 좋아요 토글
  toggleLike: async (epigramId: number): Promise<any> => {
    try {
      const response = await api.post(`/epigrams/${epigramId}/like`);

      return response.data;
    } catch (error) {
      const axiosError = error as any;

      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message);
      } else if (axiosError.response?.status) {
        throw new Error(
          `서버 오류 (${axiosError.response.status}): ${
            axiosError.response.statusText || "알 수 없는 오류"
          }`
        );
      } else if (axiosError.message) {
        throw new Error(axiosError.message);
      }

      throw new Error("좋아요 처리에 실패했습니다.");
    }
  },
};
