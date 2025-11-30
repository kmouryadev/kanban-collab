import { io } from "../index";
import type { List } from "../types/list";

export const emitListCreated = (boardId: string, list: List) => {
  io.to(boardId).emit("list:created", { boardId, list });
};

export const emitListUpdated = (boardId: string, list: List) => {
  io.to(boardId).emit("list:updated", { boardId, list });
};

export const emitListDeleted = (boardId: string, listId: string) => {
  io.to(boardId).emit("list:deleted", { boardId, listId });
};

export const emitListReordered = (boardId: string, orderedIds: string[]) => {
  io.to(boardId).emit("list:reordered", { boardId, orderedIds });
};
