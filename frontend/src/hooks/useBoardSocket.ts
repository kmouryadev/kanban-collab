import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "../lib/socket";

import { LISTS_QUERY_KEY } from "./useLists";
import { TASKS_QUERY_KEY } from "./useTasks";

import type {
  BoardResponse,
  BoardsResponse,
  ListResponse,
  TasksResponse,
} from "../types/api";

export const useRealtimeBoard = (boardId: string) => {
  const socket = getSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!boardId) return;

    const joinRoom = () => {
      socket.emit("board:join", boardId);
    };

    if (socket.connected) {
      joinRoom();
    }

    socket.on("connect", joinRoom);

    socket.on("board:updated", ({ board }) => {
      queryClient.setQueryData<BoardResponse>(["board", boardId], (prev) =>
        prev ? { board: { ...prev.board, ...board } } : prev
      );

      queryClient.setQueryData<BoardsResponse>(["boards"], (prev) => {
        if (!prev) return prev;
        return {
          boards: prev.boards.map((prevBoard) =>
            prevBoard._id === board._id ? board : prevBoard
          ),
        };
      });
    });

    socket.on("board:deleted", ({ boardId: deletedId }) => {
      queryClient.setQueryData<BoardsResponse>(["boards"], (prev) => {
        if (!prev) return prev;
        return {
          boards: prev.boards.filter((board) => board._id !== deletedId),
        };
      });
    });

    socket.on("list:created", ({ list }) => {
      queryClient.setQueryData<ListResponse>(LISTS_QUERY_KEY(boardId), (prev) =>
        prev ? { lists: [...prev.lists, list] } : { lists: [list] }
      );
    });

    socket.on("list:updated", ({ list }) => {
      queryClient.setQueryData<ListResponse>(
        LISTS_QUERY_KEY(boardId),
        (prev) => {
          if (!prev) return prev;
          return {
            lists: prev.lists.map((prevList) =>
              prevList._id === list._id ? list : prevList
            ),
          };
        }
      );
    });

    socket.on("list:deleted", ({ listId }) => {
      queryClient.setQueryData<ListResponse>(
        LISTS_QUERY_KEY(boardId),
        (prev) => {
          if (!prev) return prev;
          return {
            lists: prev.lists.filter((list) => list._id !== listId),
          };
        }
      );
    });

    socket.on("list:reordered", ({ orderedIds }: { orderedIds: string[] }) => {
      queryClient.setQueryData<ListResponse>(
        LISTS_QUERY_KEY(boardId),
        (prev) => {
          if (!prev) return prev;

          const map = new Map(prev.lists.map((list) => [list._id, list]));

          return {
            lists: orderedIds.map((id, index) => ({
              ...map.get(id)!,
              order: index,
            })),
          };
        }
      );
    });

    socket.on("task:created", ({ listId, task }) => {
      queryClient.setQueryData<TasksResponse>(
        TASKS_QUERY_KEY(boardId, listId),
        (prev) => (prev ? { tasks: [...prev.tasks, task] } : { tasks: [task] })
      );
    });

    socket.on("task:updated", ({ task }) => {
      queryClient.setQueryData<TasksResponse>(
        TASKS_QUERY_KEY(boardId, task.listId),
        (prev) => {
          if (!prev) return prev;
          return {
            tasks: prev.tasks.map((prevTask) =>
              prevTask._id === task._id ? task : prevTask
            ),
          };
        }
      );
    });

    socket.on("task:deleted", ({ listId, taskId }) => {
      queryClient.setQueryData<TasksResponse>(
        TASKS_QUERY_KEY(boardId, listId),
        (prev) => {
          if (!prev) return prev;
          return {
            tasks: prev.tasks.filter((task) => task._id !== taskId),
          };
        }
      );
    });

    socket.on(      "task:moved",       ({ srcListId, destListId, task }) => {
        queryClient.setQueryData<TasksResponse>(
          TASKS_QUERY_KEY(boardId, srcListId),
          (prev) => {
          if (!prev) return prev;
          return {
            tasks: prev.tasks.filter((prevTask) => prevTask._id !== task._id),
          };
        }
        );

        queryClient.setQueryData<TasksResponse>(
          TASKS_QUERY_KEY(boardId, destListId),
          (prev) => {
          if (!prev) return { tasks: [{ ...task, listId: destListId }] };

          return {
            tasks: [...prev.tasks, { ...task, listId: destListId }],
          };
        }
      );
    });

    socket.on(
      "task:reordered",
      ({ listId, orderedIds }: { listId: string; orderedIds: string[] }) => {
        queryClient.setQueryData<TasksResponse>(
          TASKS_QUERY_KEY(boardId, listId),
          (prev) => {
            if (!prev) return prev;

            const map = new Map(prev.tasks.map((task) => [task._id, task]));

            return {
              tasks: orderedIds.map((id, index) => ({
                ...map.get(id)!,
                order: index,
              })),
            };
          }
        );
      }
    );

    return () => {
      socket.emit("board:leave", boardId);

      socket.off("connect", joinRoom);
      socket.off("board:updated");
      socket.off("board:deleted");
      socket.off("list:created");
      socket.off("list:updated");
      socket.off("list:deleted");
      socket.off("list:reordered");
      socket.off("task:created");
      socket.off("task:reordered");
      socket.off("task:updated");
      socket.off("task:deleted");
      socket.off("task:moved");
    };
  }, [boardId, queryClient, socket]);
};
