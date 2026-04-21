import type { StateCreator } from "zustand";
import type { UserProfileResponse } from "@/schemas/users.schemas";

export type AuthSliceType = {
  token: string | null;
  user: UserProfileResponse | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: UserProfileResponse) => void;
  setUser: (user: UserProfileResponse) => void;
  logout: () => void;
};

export const createAuthSlice: StateCreator<AuthSliceType> = (set) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  setAuth: (token, user) => {
    set(() => ({ token, user, isAuthenticated: true }));
  },

  setUser: (user) => {
    set(() => ({ user }));
  },

  logout: () => {
    set(() => ({ token: null, user: null, isAuthenticated: false }));
  },
});
