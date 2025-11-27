import { useQueries, useQueryClient } from "@tanstack/react-query";

import { useLists } from "./useLists";
import { taskApi } from "../api/taskApi";
import type { Task } from "../types/tasks";
import { TASKS_QUERY_KEY } from "./useTasks";
import type { TasksResponse } from "../types/api";

export const useBoardData = (boardId: string) => {
  const { listsQuery } = useLists(boardId);
  const lists = listsQuery.data?.lists ?? [];

  const queryClient = useQueryClient();

  useQueries({
    queries: lists.map((list) => ({
      queryKey: TASKS_QUERY_KEY(boardId, list._id),
      queryFn: () => taskApi.getTasks(boardId, list._id),
      enabled: !!list._id,
    })),
  });

  const tasksByList = () => {
    const result: Record<string, Task[]> = {};

    lists.forEach((list) => {
      const cached = queryClient.getQueryData<TasksResponse>(
        TASKS_QUERY_KEY(boardId, list._id)
      );

      result[list._id] = cached?.tasks ?? [];
    });

    return result;
  };

  return {
    listsQuery,
    lists,
    tasksByList: tasksByList(),
  };
};
