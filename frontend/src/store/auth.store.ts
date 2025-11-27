import { create } from "zustand";
import type { AuthUser } from "../types/auth";
import { Auth } from "../utils/auth";
import { storage } from "../utils/storage";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  restore: () => void;
  setAuth: (user: AuthUser, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: storage.getToken(),

  setAuth: (user, token) => {
    Auth.login(token);
    set({ user, token });
  },

  restore: () => {
    const token = storage.getToken();
    if (!token || storage.isTokenExpired()) return;

    const decoded = storage.decodeToken();
    if (!decoded) return;

    set({
      user: {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
      },
      token,
    });
  },

  logout: () => {
    Auth.logout();
    set({ user: null, token: null });
  },
}));
