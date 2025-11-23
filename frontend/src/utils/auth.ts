import { storage } from "./storage";

export const Auth = {
  login(token: string) {
    return storage.setToken(token);
  },

  logout() {
    storage.clearToken();
  },

  getToken() {
    return storage.getToken();
  },

  isLoggedIn() {
    const token = storage.getToken();
    if (!token) return false;
    return !storage.isTokenExpired();
  }
};
