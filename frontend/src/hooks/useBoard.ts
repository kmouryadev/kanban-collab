import { useQuery } from "@tanstack/react-query";
import { boardsApi } from "../api/boardApi";
import type { BoardResponse } from "../types/api";

export const useBoard = (boardId: string) => {
  const board = useQuery<BoardResponse, Error>({
    queryKey: ["board", boardId],
    queryFn: () => boardsApi.get(boardId),
    enabled: !!boardId,
  });

  return { board };
};