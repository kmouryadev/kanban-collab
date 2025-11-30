import { useEffect, useRef, useSyncExternalStore } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../store/auth.store";

let globalSocket: Socket | null = null;
const listeners = new Set<() => void>();

const subscribe = (callback: () => void) => {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
};

const notify = () => {
  listeners.forEach((listener) => listener());
};

export const useSocket = () => {
  const token = useAuthStore((s) => s.token);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!token) {
      if (globalSocket) {
        globalSocket.disconnect();
        globalSocket = null;
        notify();
      }
      return;
    }

    if (isInitialized.current && globalSocket?.connected) {
      return;
    }

    const newSocket = io(import.meta.env.VITE_API_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    globalSocket = newSocket;
    isInitialized.current = true;

    newSocket.on("connect", () => {
      notify();
    });

    newSocket.on("disconnect", () => {
      notify();
    });

    notify();

    return () => {
      if (newSocket.connected) {
        newSocket.disconnect();
      }
      globalSocket = null;
      isInitialized.current = false;
      notify();
    };
  }, [token]);

  const socket = useSyncExternalStore(
    subscribe,
    () => globalSocket,
    () => null
  );

  return {
    socket,
    isConnected: socket?.connected ?? false,
  };
};
