// src/store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserInfo {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token: string;
}

interface AuthState {
  userInfo: UserInfo | null;
  setCredentials: (user: UserInfo) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userInfo: null,
      setCredentials: (user) => set({ userInfo: user }),
      logout: () => set({ userInfo: null }),
    }),
    {
      name: "aureoo-auth-storage",
    },
  ),
);
