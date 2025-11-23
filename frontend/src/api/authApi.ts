import type { AuthResponse, LoginDTO, RegisterDTO } from "../types/auth.dto";
import axiosClient from "./axiosClient";

export const registerApi = async (data: RegisterDTO): Promise<AuthResponse> => {
  const res = await axiosClient.post<AuthResponse>("/auth/v1/register", data);
  return res.data;
};

export const loginApi = async (data: LoginDTO): Promise<AuthResponse> => {
  const res = await axiosClient.post<AuthResponse>("/auth/v1/login", data);
  return res.data;
};
