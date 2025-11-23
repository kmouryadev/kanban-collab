import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "token";
const TOKEN_EXP_KEY = "token-exp";

export interface JwtPayload {
  exp: number;
  id: string;
  email: string;
  name: string;
}

export const storage = {
  setToken: (token: string): JwtPayload => {
    const decoded = jwtDecode<JwtPayload>(token);

    if (!decoded.exp) {
      throw new Error("Invalid token: no exp field found");
    }

    const expiresAt = decoded.exp * 1000;

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_EXP_KEY, expiresAt.toString());
    return decoded;
  },

  decodeToken: (): JwtPayload | null => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    return jwtDecode<JwtPayload>(token);
  },

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  isTokenExpired: (): boolean => {
    const expireTime = localStorage.getItem(TOKEN_EXP_KEY);
    if (!expireTime) return true;

    return Date.now() > Number(expireTime);
  },

  clearToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXP_KEY);
  },
};
