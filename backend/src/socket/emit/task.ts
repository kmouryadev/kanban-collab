import { io } from "../index";
import { Task } from "../types/task";

export const emitTaskCreated = (
  boardId: string,
  listId: string,
  task: Task
) => {
  io.to(boardId).emit("task:created", { boardId, listId, task });
};

export const emitTaskUpdated = (boardId: string, task: Task) => {
  io.to(boardId).emit("task:updated", { boardId, task });
};

export const emitTaskDeleted = (
  boardId: string,
  taskId: string,
  listId: string
) => {
  io.to(boardId).emit("task:deleted", { boardId, listId, taskId });
};

export const emitTaskMoved = (
  boardId: string,
  task: Task,
  srcListId: string,
  destListId: string
) => {
  io.to(boardId).emit("task:moved", {
    boardId,
    task,
    srcListId,
    destListId,
  });
};

export const emitTaskReordered = (
  boardId: string,
  listId: string,
  orderedIds: string[]
) => {
  io.to(boardId).emit("task:reordered", { boardId, listId, orderedIds });
};
