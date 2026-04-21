import type { StateCreator } from "zustand";

export type UiSliceType = {
  disableAnimation: boolean;
  setDisableAnimation: (value: boolean) => void;
};

export const createUiSlice: StateCreator<UiSliceType> = (set) => ({
  disableAnimation: false,
  setDisableAnimation: (value) => {
    set(() => ({ disableAnimation: value }));
  },
});