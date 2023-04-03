import { Interface } from "readline";
import { create } from "zustand";
import { fetchData } from "../utils/fetchFunction";

interface ITestingState {
  email: string;
  userId: string;
  permission: string;
  name: string;
  avatar: string;
  setEmail: (text: string) => void;
  setUserId: (text: string) => void;
  setPermission: (text: string) => void;
  setName: (text: string) => void;
  setAvatar: (text: string) => void;
}

const useUserState = create<ITestingState>((set, get) => ({
  email: "",
  permission: "",
  userId: "",
  name: "",
  avatar: "",
  setEmail: (email) => set(() => ({ email })),
  setUserId: (userId) => set(() => ({ userId })),
  setPermission: (permission) => set(() => ({ permission })),
  setName: (name) => set(() => ({ name })),
  setAvatar: (avatar) => set(() => ({ avatar })),
  //   setSubjectId :(subjectId)=>set((state)=>({subjectId})),

  //   increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  //   removeAllBears: () => set({ bears: 0 }),
}));
export default useUserState;
