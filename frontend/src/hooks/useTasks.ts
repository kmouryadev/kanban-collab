import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "../api/taskApi";
import type { CreateTaskDTO, UpdateTaskDTO, Task } from "../types/tasks";
import type { TasksResponse } from "../types/api";
import { AppToast } from "../lib/appToast";

export const TASKS_QUERY_KEY = (boardId: string, listId: string) => [
  "tasks",
  boardId,
  listId,
];

export const useTasks = (boardId: string, listId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery<TasksResponse, Error>({
    queryKey: TASKS_QUERY_KEY(boardId, listId),
    queryFn: () => taskApi.getTasks(boardId, listId),
    enabled: !!listId,
  });

  const create = useMutation({
    mutationFn: (data: CreateTaskDTO) =>
      taskApi.createTask(boardId, listId, data),
    onSuccess: (res) => {
      queryClient.setQueryData<TasksResponse | undefined>(
        TASKS_QUERY_KEY(boardId, listId),
        (old) => {
          if (!old) return { tasks: [res] };
          return { tasks: [...old.tasks, res] };
        }
      );
      AppToast.success("Task Created");
    },
    onError: (err: Error) =>
      AppToast.error("Could not create task", err.message),
  });

  const update = useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: UpdateTaskDTO }) =>
      taskApi.updateTask(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TASKS_QUERY_KEY(boardId, listId),
      });
      AppToast.success("Task Updated");
    },
    onError: (err: Error) =>
      AppToast.error("Could not update task", err.message),
  });

  const remove = useMutation({
    mutationFn: (taskId: string) => taskApi.deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TASKS_QUERY_KEY(boardId, listId),
      });
      AppToast.success("Task Deleted");
    },
    onError: (err: Error) =>
      AppToast.error("Could not delete task", err.message),
  });

  const reorder = useMutation({
    mutationFn: (payload: string[]) => taskApi.reorderTasks(listId, payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({
        queryKey: TASKS_QUERY_KEY(boardId, listId),
      });
      const prev = queryClient.getQueryData<TasksResponse>(
        TASKS_QUERY_KEY(boardId, listId)
      );
      if (prev) {
        const map = new Map(
          prev.tasks.map((prevTask) => [prevTask._id, { ...prevTask }])
        );
        const updated = payload
          .map((id, idx) => {
            const item = map.get(id);
            if (!item) return null;
            return { ...item, position: idx };
          })
          .filter(Boolean) as Task[];
        queryClient.setQueryData<TasksResponse>(
          TASKS_QUERY_KEY(boardId, listId),
          { tasks: updated }
        );
      }
      return { prev };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev)
        queryClient.setQueryData(TASKS_QUERY_KEY(boardId, listId), ctx.prev);
      AppToast.error("Task reorder failed", err.message);
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: TASKS_QUERY_KEY(boardId, listId),
      }),
  });

  return {
    tasksQuery: query,
    create,
    update,
    remove,
    reorder,
  };
};
