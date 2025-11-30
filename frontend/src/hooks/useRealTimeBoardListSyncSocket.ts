import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "../lib/socket";

import type { BoardsResponse } from "../types/api";

export const useRealtimeBoardsList = (boards: BoardsResponse["boards"]) => {
  const socket = getSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!boards || boards.length === 0) return;

    boards.forEach((b) => {
      socket.emit("board:join", b._id);
    });

    socket.on("board:updated", ({ board }) => {
      queryClient.setQueryData<BoardsResponse>(["boards"], (prev) => {
        if (!prev) return prev;
        return {
          boards: prev.boards.map((preBoard) =>
            preBoard._id === board._id ? board : preBoard
          ),
        };
      });
    });

    socket.on("board:deleted", ({ boardId }) => {
      queryClient.setQueryData<BoardsResponse>(["boards"], (prev) => {
        if (!prev) return prev;
        return {
          boards: prev.boards.filter((preBoard) => preBoard._id !== boardId),
        };
      });
    });

    return () => {
      boards.forEach((board) => {
        socket.emit("board:leave", board._id);
      });

      socket.off("board:updated");
      socket.off("board:deleted");
    };
  }, [boards?.length]);
};
