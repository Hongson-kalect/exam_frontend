import { create } from "zustand";
import { fetchData } from "../utils/fetchFunction";

type ITestingState = {
  timeAttempt: string | number;
  userAnsers: string[];
  questions: any[];
  ansers: string[];
  setTimeAttempt: (text: string) => void;
  setUserAnsers: (userAnser: string[]) => void;
  setQuestions: (question: any) => void;
  setAnser: (anser: string[]) => void;
};

const useTestingState = create<ITestingState>((set, get) => ({
  timeAttempt: "",
  userAnsers: [],
  questions: [],
  ansers: [],
  setTimeAttempt: (timeAttempt) => set(() => ({ timeAttempt })),
  setUserAnsers: (userAnsers) => set(() => ({ userAnsers: [...userAnsers] })),
  setQuestions: (questions) => set(() => ({ questions: [...questions] })),
  setAnser: (ansers) => set(() => ({ ansers: [...ansers] })),
  //   setSubjectId :(subjectId)=>set((state)=>({subjectId})),

  //   increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  //   removeAllBears: () => set({ bears: 0 }),
}));
export default useTestingState;
