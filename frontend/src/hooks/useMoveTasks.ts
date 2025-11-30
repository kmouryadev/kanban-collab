import { useMutation } from "@tanstack/react-query";
import { taskApi } from "../api/taskApi";
import { AppToast } from "../lib/appToast";

export const useMoveTask = () => {
  return useMutation({
    mutationFn: ({
      taskId,
      destListId,
      newOrder,
    }: {
      taskId: string;
      srcListId: string;
      destListId: string;
      newOrder: number;
      newSrc: string[];
      newDest: string[];
    }) => taskApi.moveTasks(taskId, destListId, newOrder.toString()),

    onError: (err: Error) => {
      AppToast.error(err.message || "Failed to move task");
    },
  });
};
