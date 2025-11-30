import type { Board } from "./types/boards";
import type { List } from "./types/list";
import type { Task } from "./types/task";

export interface ServerToClientEvents {
  "board:updated": (data: { board: Board }) => void;
  "board:deleted": (data: { boardId: string }) => void;
  "board:memberAdded": (data: {
    userId: string;
    email: string;
    name: string;
  }) => void;

  "list:created": (data: { boardId: string; list: List }) => void;
  "list:updated": (data: { boardId: string; list: List }) => void;
  "list:deleted": (data: { boardId: string; listId: string }) => void;
  "list:reordered": (data: { boardId: string; orderedIds: string[] }) => void;

  "task:created": (data: {
    boardId: string;
    listId: string;
    task: Task;
  }) => void;
  "task:updated": (data: { boardId: string; task: Task }) => void;
  "task:deleted": (data: {
    boardId: string;
    taskId: string;
    listId: string;
  }) => void;

  "task:moved": (data: {
    boardId: string;
    task: Task;
    srcListId: string;
    destListId: string;
  }) => void;

  "task:reordered": (data: {
    boardId: string;
    listId: string;
    orderedIds: string[];
  }) => void;
}

export interface ClientToServerEvents {
  "board:join": (boardId: string) => void;
  "board:leave": (boardId: string) => void;
}

export interface InterServerEvents {}
export interface SocketData {
  userId: string;
}

export const SocketEvents = {
  BOARD_CREATED: "board:created",
  BOARD_UPDATED: "board:updated",
  BOARD_DELETED: "board:deleted",
  BOARD_MEMBER_ADDED: "board:memberAdded",

  LIST_CREATED: "list:created",
  LIST_UPDATED: "list:updated",
  LIST_DELETED: "list:deleted",
  LIST_REORDERED: "list:reordered",

  TASK_CREATED: "task:created",
  TASK_UPDATED: "task:updated",
  TASK_DELETED: "task:deleted",
  TASK_MOVED: "task:moved",
};

export interface SocketData {
  user?: {
    _id: string;
    email: string;
    name: string;
  };
}
