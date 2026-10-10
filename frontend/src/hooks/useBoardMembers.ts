import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AppToast } from "../lib/appToast";
import type { BoardResponse } from "../types/api";
import { boardsApi } from "../api/boardApi";

export const useRemoveMember = (boardId: string) => {
  const queryClient = useQueryClient();

  const removeMember = useMutation({
    mutationFn: (memberId: string) =>
      boardsApi.removeMember(boardId, memberId),
    onSuccess: (_data, memberId) => {
      queryClient.setQueryData<BoardResponse>(["board", boardId], (prev) => {
        if (!prev) return prev;
        return {
          board: {
            ...prev.board,
            members: prev.board.members.filter(
              (member) => member._id !== memberId
            ),
          },
        };
      });

      AppToast.success("Member removed");
    },
    onError: (err: Error) => {
      AppToast.error("Could not remove member", err.message);
    },
  });

  return { removeMember };
};
