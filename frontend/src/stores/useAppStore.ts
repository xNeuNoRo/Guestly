import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { createAuthSlice, type AuthSliceType } from "./authSlice";
import { createUiSlice, type UiSliceType } from "./uiSlice";

export type AppStoreType = AuthSliceType & UiSliceType;

export const useAppStore = create<AppStoreType>()(
  devtools(
    persist(
      (...args) => ({
        ...createAuthSlice(...args),
        ...createUiSlice(...args),
      }),
      {
        name: "guestly-storage",
        // El Partialize filtra qué partes del estado global se persisten en el storage
        partialize: (state) => ({
          token: state.token,
        }),
      },
    ),
  ),
);
