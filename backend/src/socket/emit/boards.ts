import { io } from "../index";
import { Board, BoardTransition } from "../types/boards";

export const emitBoardUpdated = (board: Board) => {
  io.to(board._id.toString()).emit("board:updated", { board });
};

export const emitBoardDeleted = (boardId: string) => {
  io.to(boardId).emit("board:deleted", { boardId });
};

export const emitBoardMemberAdded = (
  boardId: string,
  member: { userId: string; email: string; name: string }
) => {
  io.to(boardId).emit("board:memberAdded", member);
};

export const emitBoardMemberRemoved = (boardId: string, memberId: string) => {
  io.to(boardId).emit("board:memberRemoved", { boardId, memberId });
};

export const emitBoardWorkflowUpdated = (
  boardId: string,
  allowedTransitions: BoardTransition[]
) => {
  io.to(boardId).emit("board:workflowUpdated", { boardId, allowedTransitions });
};
