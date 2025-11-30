import { io } from "../index";
import { Board } from "../types/boards";

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
