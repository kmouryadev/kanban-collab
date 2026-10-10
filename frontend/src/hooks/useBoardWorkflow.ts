import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AppToast } from "../lib/appToast";
import type { BoardResponse } from "../types/api";
import type { BoardTransition } from "../types/board";
import { boardsApi } from "../api/boardApi";

export const useBoardWorkflow = (boardId: string) => {
  const queryClient = useQueryClient();

  const updateWorkflow = useMutation({
    mutationFn: (transitions: BoardTransition[]) =>
      boardsApi.updateWorkflow(boardId, transitions),
    onSuccess: (response) => {
      queryClient.setQueryData<BoardResponse>(["board", boardId], (prev) =>
        prev
          ? {
              board: {
                ...prev.board,
                allowedTransitions: response.allowedTransitions,
              },
            }
          : prev
      );

      AppToast.success("Workflow updated");
    },
    onError: (err: Error) => {
      AppToast.error("Could not update workflow", err.message);
    },
  });

  return { updateWorkflow };
};
