import axios from "axios";
import { Auth } from "../utils/auth";
import { useAuthStore } from "../store/auth.store";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  }
});

axiosClient.interceptors.request.use((config) => {
  const token = Auth.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const logout = useAuthStore.getState().logout;
      logout();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default axiosClient;
