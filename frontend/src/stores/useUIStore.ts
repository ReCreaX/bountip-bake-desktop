import { create } from "zustand";

interface UIState {
  showsignUpSuccessModal: boolean;
  setShowSignUpSuccessModal: (value: boolean) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;

  showFullDashboardSidebar: boolean;
  setShowFullDashboardSidebar: (value: boolean) => void;
}

export const useModalStore = create<UIState>((set) => ({
  showsignUpSuccessModal: false,
  setShowSignUpSuccessModal: (value) => set({ showsignUpSuccessModal: value }),
  isLoading: false,
  setIsLoading: (value) => set({ isLoading: value }),

  showFullDashboardSidebar: false,
  setShowFullDashboardSidebar: (value) =>
    set({ showFullDashboardSidebar: value }),
}));
