import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../store/auth.store";

let socket: Socket | null = null;

export const getSocket = () => {
  const token = useAuthStore.getState().token;

  if (!socket) {
    socket = io(import.meta.env.VITE_BACKEND_URL, {
      transports: ["websocket"],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 800,
      withCredentials: true,
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
