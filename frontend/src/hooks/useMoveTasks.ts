import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TasksResponse } from "../types/api";
import { TASKS_QUERY_KEY } from "./useTasks";
import { taskApi } from "../api/taskApi";
import { AppToast } from "../lib/appToast";

export const useMoveTask = (boardId: string) => {
  const queryClient = useQueryClient();

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

    onMutate: async (vars) => {
      const { srcListId, destListId, newSrc, newDest } = vars;

      const srcKey = TASKS_QUERY_KEY(boardId, srcListId);
      const destKey = TASKS_QUERY_KEY(boardId, destListId);

      await Promise.all([
        queryClient.cancelQueries({ queryKey: srcKey }),
        queryClient.cancelQueries({ queryKey: destKey }),
      ]);

      const prevSrc = queryClient.getQueryData<TasksResponse>(srcKey);
      const prevDest = queryClient.getQueryData<TasksResponse>(destKey);

      if (prevSrc) {
        queryClient.setQueryData<TasksResponse>(srcKey, {
          ...prevSrc,
          tasks: prevSrc.tasks.filter((prevTask) => newSrc.includes(prevTask._id)),
        });
      }

      if (prevDest) {
        const updatedDest = prevDest.tasks.map((prevTask) =>
          newDest.includes(prevTask._id) ? { ...prevTask, listId: destListId } : prevTask
        );

        queryClient.setQueryData<TasksResponse>(destKey, {
          ...prevDest,
          tasks: updatedDest,
        });
      }

      return { prevSrc, prevDest };
    },

    onError: (_err, vars, ctx) => {
      if (ctx?.prevSrc) {
        queryClient.setQueryData(
          TASKS_QUERY_KEY(boardId, vars.srcListId),
          ctx.prevSrc
        );
      }
      if (ctx?.prevDest) {
        queryClient.setQueryData(
          TASKS_QUERY_KEY(boardId, vars.destListId),
          ctx.prevDest
        );
      }
      AppToast.error("Failed to move task");
    },

    onSettled: (_data, _err, vars) => {
      queryClient.invalidateQueries({
        queryKey: TASKS_QUERY_KEY(boardId, vars.srcListId),
      });
      queryClient.invalidateQueries({
        queryKey: TASKS_QUERY_KEY(boardId, vars.destListId),
      });
    },
  });
};
