import { Types } from "mongoose";
import { BoardModel } from "../../models/Board.model";
import { HTTP } from "../../constants/httpCodes";
import { MESSAGES } from "../../constants/messages";

export const createBoard = async (
  title: string,
  description: string | undefined,
  backgroundColor: string | undefined,
  owner: string
) => {
  if (!title || typeof title !== "string") {
    return {
      status: HTTP.BAD_REQUEST,
      error: MESSAGES.BOARD.TITLE_REQUIRED,
    };
  }

  const board = await BoardModel.create({
    title: title.trim(),
    description: description?.trim() ?? "",
    backgroundColor: backgroundColor?.trim() ?? "",
    owner,
  });

  return {
    status: HTTP.CREATED,
    data: board,
  };
};

export const listBoards = async (owner: string) => {
  const boards = await BoardModel.find({ owner }).sort({ updatedAt: -1 });

  return {
    status: HTTP.OK,
    data: boards,
  };
};

export const getBoard = async (boardId: string) => {
  if (!Types.ObjectId.isValid(boardId)) {
    return {
      status: HTTP.BAD_REQUEST,
      error: MESSAGES.BOARD.INVALID_ID,
    };
  }

  const board = await BoardModel.findById(boardId);

  if (!board) {
    return {
      status: HTTP.NOT_FOUND,
      error: MESSAGES.BOARD.NOT_FOUND,
    };
  }

  return {
    status: HTTP.OK,
    data: board,
  };
};

export const updateBoard = async (
  boardId: string,
  userId: string,
  updates: {
    title?: string;
    description?: string;
    backgroundColor?: string;
  }
) => {
  if (!Types.ObjectId.isValid(boardId)) {
    return {
      status: HTTP.BAD_REQUEST,
      error: MESSAGES.BOARD.INVALID_ID,
    };
  }

  const board = await BoardModel.findById(boardId);
  if (!board) {
    return {
      status: HTTP.NOT_FOUND,
      error: MESSAGES.BOARD.NOT_FOUND,
    };
  }

  if (board.owner.toString() !== userId.toString()) {
    return {
      status: HTTP.FORBIDDEN,
      error: MESSAGES.BOARD.UPDATE_FORBIDDEN,
    };
  }

  if (updates.title !== undefined) board.title = updates.title;
  if (updates.description !== undefined) board.description = updates.description;
  if (updates.backgroundColor !== undefined) {
    board.backgroundColor = updates.backgroundColor;
  }

  await board.save();

  return {
    status: HTTP.OK,
    data: board,
  };
};

export const deleteBoard = async (boardId: string, userId: string) => {
  if (!Types.ObjectId.isValid(boardId)) {
    return {
      status: HTTP.BAD_REQUEST,
      error: MESSAGES.BOARD.INVALID_ID,
    };
  }

  const board = await BoardModel.findById(boardId);
  if (!board) {
    return {
      status: HTTP.NOT_FOUND,
      error: MESSAGES.BOARD.NOT_FOUND,
    };
  }

  if (board.owner.toString() !== userId.toString()) {
    return {
      status: HTTP.FORBIDDEN,
      error: MESSAGES.BOARD.DELETE_FORBIDDEN,
    };
  }

  await BoardModel.deleteOne({ _id: boardId });

  return {
    status: HTTP.OK,
    message: MESSAGES.BOARD.DELETE_SUCCESS,
  };
};
