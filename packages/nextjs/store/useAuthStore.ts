import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  token: string | null;
  setToken: (token: string) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      token: null,
      setToken: token => set({ token }),
      clear: () => set({ token: null }),
    }),
    {
      name: "auth-store", // 存储在 localStorage 中的 key
    },
  ),
);
