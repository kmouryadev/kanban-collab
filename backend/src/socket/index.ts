import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";

import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "./event";

import { BoardModel } from "../models/Board.model";

interface JwtPayload {
  id: string;
  email?: string;
  name?: string;
}

export let io: Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST", "PATCH", "DELETE"],
    },
  });
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token"));

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;

      socket.data.user = {
        _id: decoded.id,
        email: decoded.email ?? "",
        name: decoded.name ?? "",
      };

      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });
  io.on("connection", (socket) => {
    socket.on("board:join", async (boardId) => {
      const user = socket.data.user;
      if (!user) return;

      const board = await BoardModel.findById(boardId);
      if (!board) return;

      const userId = user._id.toString();
      const isMember =
        board.owner.toString() === userId ||
        board.members.map((m) => m.toString()).includes(userId);

      if (!isMember) {
        return;
      }
      console.log(`[SOCKET] join request by ${socket.id} for ${boardId}`);
      socket.join(boardId);
    });
    socket.on("board:leave", (boardId) => {
      socket.leave(boardId);
    });
  });

  return io;
};
