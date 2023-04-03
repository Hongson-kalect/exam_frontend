import { type } from "os";
import { create } from "zustand";
import { fetchData } from "../utils/fetchFunction";

type IExamState = {
  subjectId: string | number;
  roomId: string;
  testId: string;
  permission: string;
  setSubjectId: (text: string) => void;
  setroomId: (text: string) => void;
  setTestId: (text: string) => void;
};

const useExamState = create<IExamState>((set, get) => ({
  subjectId: "default",
  roomId: "",
  testId: "",
  permission: "",
  setSubjectId: (subjectId) => set(() => ({ subjectId })),
  setroomId: (roomId) => set(() => ({ roomId })),
  setTestId: (testId) => set(() => ({ testId })),
  //   setSubjectId :(subjectId)=>set((state)=>({subjectId})),

  //   increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  //   removeAllBears: () => set({ bears: 0 }),
}));
export default useExamState;
