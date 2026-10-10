import { BoardModel, BoardDocument } from "../models/Board.model";

export const findAccessibleBoard = (
  boardId: string,
  userId: string
): Promise<BoardDocument | null> =>
  BoardModel.findOne({
    _id: boardId,
    $or: [{ owner: userId }, { members: userId }],
  });

export const findOwnedBoard = (
  boardId: string,
  userId: string
): Promise<BoardDocument | null> =>
  BoardModel.findOne({ _id: boardId, owner: userId });
