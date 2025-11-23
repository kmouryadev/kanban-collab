import { useMutation } from "@tanstack/react-query";
import { loginApi, registerApi } from "../api/authApi";
import type { LoginDTO, RegisterDTO, AuthResponse } from "../types/auth.dto";
import { useAuthStore } from "../store/auth.store";

export const useAuth = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  const login = useMutation({
    mutationFn: (data: LoginDTO) => loginApi(data),
    onSuccess: (response: AuthResponse) => {
      setAuth(response.user, response.token);
    },
  });

  const register = useMutation({
    mutationFn: (data: RegisterDTO) => registerApi(data),
    onSuccess: (response: AuthResponse) => {
      setAuth(response.user, response.token);
    },
  });

  return { login, register };
};
