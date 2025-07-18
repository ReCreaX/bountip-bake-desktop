// stores/useAuthStore.ts
import { create } from "zustand";

interface AuthState {
  pinLogin: boolean;
  pin: string;
  setPinLogin: (value: boolean) => void;
  setPin: (value: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  pinLogin: false,
  pin: "",
  setPinLogin: (value) => set({ pinLogin: value }),
  setPin: (value) => set({ pin: value }),
}));
