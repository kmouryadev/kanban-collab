import { AUTH } from "../apiRoutes";
import type { AuthResponse, LoginDTO, RegisterDTO } from "../types/auth";
import axiosClient from "./axiosClient";

export const registerApi = async (data: RegisterDTO): Promise<AuthResponse> => {
  const res = await axiosClient.post<AuthResponse>(AUTH.REGISTER, data);
  return res.data;
};

export const loginApi = async (data: LoginDTO): Promise<AuthResponse> => {
  const res = await axiosClient.post<AuthResponse>(AUTH.LOGIN, data);
  return res.data;
};
