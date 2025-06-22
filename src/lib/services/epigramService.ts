import { epigramCRUD } from "./epigramCRUD";
import { epigramLike } from "./epigramLike";

// 통합된 에피그램 서비스 - 기존 인터페이스 유지하면서 분리된 서비스들 사용
export const epigramService = {
  // CRUD 작업들
  getEpigrams: epigramCRUD.getEpigrams,
  getEpigramById: epigramCRUD.getEpigramById,

  // 에피그램 생성 (프록시에서 토큰 검증 처리)
  createEpigram: async (data: {
    content: string;
    author: string;
    referenceTitle?: string;
    referenceUrl?: string;
    tags: string[];
  }) => {
    return epigramCRUD.createEpigram(data);
  },

  // 에피그램 수정 (프록시에서 토큰 검증 처리)
  updateEpigram: async (
    id: string,
    data: {
      content?: string;
      author?: string;
      referenceTitle?: string;
      referenceUrl?: string;
      tags?: string[];
    }
  ) => {
    return epigramCRUD.updateEpigram(id, data);
  },

  // 에피그램 삭제 (프록시에서 토큰 검증 처리)
  deleteEpigram: async (id: string) => {
    return epigramCRUD.deleteEpigram(id);
  },

  // 좋아요 기능
  toggleLike: epigramLike.toggleLike,
};
