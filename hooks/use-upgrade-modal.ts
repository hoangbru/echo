import { create } from "zustand";

interface ModalData {
  title?: string;
  description?: string;
}

interface UpgradeModalStore {
  isOpen: boolean;
  data: ModalData;
  onOpen: (data?: ModalData) => void;
  onClose: () => void;
}

export const useUpgradeModal = create<UpgradeModalStore>((set) => ({
  isOpen: false,
  data: {},
  onOpen: (data = {}) => set({ isOpen: true, data }),
  onClose: () => set({ isOpen: false }),
}));
