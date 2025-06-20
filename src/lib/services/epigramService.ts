import { epigramCRUD } from "./epigramCRUD";
import { epigramLike } from "./epigramLike";
import { tokenValidator } from "./tokenValidator";

// 통합된 에피그램 서비스 - 기존 인터페이스 유지하면서 분리된 서비스들 사용
export const epigramService = {
  // CRUD 작업들
  getEpigrams: epigramCRUD.getEpigrams,
  getEpigramById: epigramCRUD.getEpigramById,

  // 에피그램 생성 (토큰 검증 포함)
  createEpigram: async (data: {
    content: string;
    author: string;
    referenceTitle?: string;
    referenceUrl?: string;
    tags: string[];
  }) => {
    // 토큰 검증
    const token = tokenValidator.getToken();
    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    if (!tokenValidator.validateToken(token)) {
      tokenValidator.removeTokens();
      throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
    }

    return epigramCRUD.createEpigram(data);
  },

  // 에피그램 수정 (토큰 검증 포함)
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
    // 토큰 검증
    const token = tokenValidator.getToken();
    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    if (!tokenValidator.validateToken(token)) {
      tokenValidator.removeTokens();
      throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
    }

    return epigramCRUD.updateEpigram(id, data);
  },

  // 에피그램 삭제 (토큰 검증 포함)
  deleteEpigram: async (id: string) => {
    // 토큰 검증
    const token = tokenValidator.getToken();
    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    if (!tokenValidator.validateToken(token)) {
      tokenValidator.removeTokens();
      throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
    }

    return epigramCRUD.deleteEpigram(id);
  },

  // 좋아요 기능
  toggleLike: epigramLike.toggleLike,

  // 토큰 관련 유틸리티
  validateToken: tokenValidator.validateToken,
  clearExpiredTokens: tokenValidator.clearExpiredTokens,
};
