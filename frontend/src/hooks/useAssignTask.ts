import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "../api/taskApi";
import { TASKS_QUERY_KEY } from "./useTasks";
import type { TasksResponse } from "../types/api";
import { AppToast } from "../lib/appToast";

export const useAssignTask = (boardId: string) => {
  const queryClient = useQueryClient();

  const assign = useMutation({
    mutationFn: ({
      taskId,
      assigneeId,
    }: {
      taskId: string;
      assigneeId: string | null;
    }) => taskApi.assignTask(taskId, assigneeId),
    onSuccess: (task) => {
      const key = TASKS_QUERY_KEY(boardId, task.listId);
      queryClient.setQueryData<TasksResponse>(key, (prev) => {
        if (!prev) return prev;
        return {
          tasks: prev.tasks.map((prevTask) =>
            prevTask._id === task._id ? task : prevTask
          ),
        };
      });
    },
    onError: (err: Error) => {
      AppToast.error("Could not update assignee", err.message);
    },
  });

  return { assign };
};
