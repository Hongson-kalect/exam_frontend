import { type } from "os";
import { create } from "zustand";
import { fetchData } from "../utils/fetchFunction";

export type IAppState = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

export const useAppState = create<IAppState>((set, get) => ({
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set(() => ({ isLoading })),
  //   setSubjectId :(subjectId)=>set((state)=>({subjectId})),

  //   increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  //   removeAllBears: () => set({ bears: 0 }),
}));
