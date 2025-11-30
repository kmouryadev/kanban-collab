import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AppToast } from "../lib/appToast";
import type { BoardResponse } from "../types/api";
import { boardsApi } from "../api/boardApi";

export const useShareBoard = (boardId: string) => {
  const queryClient = useQueryClient();

  const share = useMutation({
    mutationFn: (email: string) => boardsApi.share(boardId, email),
    onSuccess: (response) => {
      queryClient.setQueryData<BoardResponse>(
        ["board", boardId],
        (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            board: {
              ...prev.board,
              members: response.data?.members || prev.board.members,
            },
          };
        }
      );

      queryClient.invalidateQueries({ queryKey: ["board", boardId] });

      AppToast.success("Board shared successfully");
    },
    onError: (err: Error) => {
      AppToast.error("Could not share board", err.message);
    },
  });

  return { share };
};