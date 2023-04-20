import { type } from "os";
import { create } from "zustand";
import { fetchData } from "../utils/fetchFunction";

type IExamState = {
  subjectId: string | number;
  roomId: string;
  testId: string;
  historyId: string;
  state: "exam" | "check" | "continue";

  permission: string;
  setSubjectId: (text: string) => void;
  setroomId: (text: string) => void;
  setTestId: (text: string) => void;
  setHistoryId: (text: string) => void;
  setState: (text: "exam" | "check" | "continue") => void;
};

const useExamState = create<IExamState>((set, get) => ({
  subjectId: "default",
  roomId: "",
  testId: "",
  historyId: "",
  state: "exam",
  permission: "",
  setSubjectId: (subjectId) => set(() => ({ subjectId })),
  setroomId: (roomId) => set(() => ({ roomId })),
  setHistoryId: (historyId) => set(() => ({ historyId })),
  setState: (state) => set(() => ({ state })),
  setTestId: (testId) => set(() => ({ testId })),
  //   setSubjectId :(subjectId)=>set((state)=>({subjectId})),

  //   increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  //   removeAllBears: () => set({ bears: 0 }),
}));
export default useExamState;
