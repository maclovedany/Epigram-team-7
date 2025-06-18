import { create } from "zustand";
import { Epigram } from "@/types";

interface EpigramState {
  epigrams: Epigram[];
  setEpigrams: (epigrams: Epigram[]) => void;
  addEpigram: (epigram: Epigram) => void;
  updateEpigram: (id: number, epigram: Epigram) => void;
  removeEpigram: (id: number) => void;
}

export const useEpigramStore = create<EpigramState>((set) => ({
  epigrams: [],

  setEpigrams: (epigrams: Epigram[]) => {
    // 유효한 에피그램만 필터링
    const validEpigrams = epigrams.filter((epigram) => epigram && epigram.id);
    set({ epigrams: validEpigrams });
  },

  addEpigram: (epigram: Epigram) => {
    // 유효한 에피그램인지 확인
    if (!epigram || !epigram.id) {
      console.error("Invalid epigram data:", epigram);
      return;
    }

    set((state) => {
      // 중복 방지: 같은 ID의 에피그램이 이미 있는지 확인
      const existingIndex = state.epigrams.findIndex(
        (e) => e && e.id === epigram.id
      );
      if (existingIndex !== -1) {
        // 이미 존재하면 업데이트
        const updatedEpigrams = [...state.epigrams];
        updatedEpigrams[existingIndex] = epigram;
        return { epigrams: updatedEpigrams };
      } else {
        // 새로운 에피그램 추가
        return { epigrams: [epigram, ...state.epigrams] };
      }
    });
  },

  updateEpigram: (id: number, updatedEpigram: Epigram) => {
    set((state) => ({
      epigrams: state.epigrams.map((epigram) =>
        epigram.id === id ? updatedEpigram : epigram
      ),
    }));
  },

  removeEpigram: (id: number) => {
    set((state) => ({
      epigrams: state.epigrams.filter((epigram) => epigram.id !== id),
    }));
  },
}));
