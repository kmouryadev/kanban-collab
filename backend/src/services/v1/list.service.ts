import mongoose, { Types } from "mongoose";
import { ListModel, IList } from "../../models/List.model";
import { BoardModel } from "../../models/Board.model";
import { findOwnedBoard } from "../../utils/boardAccess";
import { createError } from "../../utils/error";
import { HTTP } from "../../constants/httpCodes";
import { MESSAGES } from "../../constants/messages";

import {
  emitListCreated,
  emitListUpdated,
  emitListDeleted,
  emitListReordered,
} from "../../socket/emit/list";

export const ListService = {
  async createList(
    boardId: string,
    userId: string,
    title: string
  ): Promise<IList> {
    const board = await findOwnedBoard(boardId, userId);

    if (!board) {
      throw createError(HTTP.NOT_FOUND, MESSAGES.BOARD.NOT_FOUND);
    }

    const count = await ListModel.countDocuments({ boardId });

    const newList = await ListModel.create({
      title,
      boardId: new Types.ObjectId(boardId),
      order: count,
    });
    emitListCreated(boardId, newList);

    return newList;
  },

  async getLists(boardId: string, userId: string): Promise<IList[]> {
    const board = await BoardModel.findOne({
      _id: boardId,
      $or: [{ owner: userId }, { members: userId }],
    })
      .populate("owner", "_id name email")
      .populate("members", "_id name email");

    if (!board) {
      throw createError(HTTP.NOT_FOUND, MESSAGES.BOARD.NOT_FOUND);
    }

    return ListModel.find({ boardId }).sort({ order: 1 });
  },

  async updateList(
    listId: string,
    userId: string,
    title: string
  ): Promise<IList> {
    const list = await ListModel.findById(listId);
    if (!list) throw createError(HTTP.NOT_FOUND, MESSAGES.LIST.NOT_FOUND);

    const board = await findOwnedBoard(list.boardId.toString(), userId);
    if (!board) throw createError(HTTP.FORBIDDEN, MESSAGES.SERVER.FORBIDDEN);

    list.title = title;
    await list.save();
    emitListUpdated(list.boardId.toString(), list);

    return list;
  },

  async deleteList(listId: string, userId: string): Promise<void> {
    const list = await ListModel.findById(listId);
    if (!list) throw createError(HTTP.NOT_FOUND, MESSAGES.LIST.NOT_FOUND);

    const board = await findOwnedBoard(list.boardId.toString(), userId);
    if (!board) throw createError(HTTP.FORBIDDEN, MESSAGES.SERVER.FORBIDDEN);
    await list.deleteOne();

    board.allowedTransitions = board.allowedTransitions.filter(
      (t) => t.from.toString() !== listId && t.to.toString() !== listId
    );
    await board.save();

    emitListDeleted(list.boardId.toString(), listId);
  },

  async reorderLists(boardId: string, userId: string, orderedIds: string[]) {
    const board = await findOwnedBoard(boardId, userId);
    if (!board) throw createError(HTTP.NOT_FOUND, MESSAGES.BOARD.NOT_FOUND);

    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        await ListModel.bulkWrite(
          orderedIds.map((id, index) => ({
            updateOne: {
              filter: { _id: id, boardId },
              update: { order: index },
            },
          })),
          { session }
        );
      });
    } finally {
      await session.endSession();
    }

    emitListReordered(boardId, orderedIds);

    return { message: MESSAGES.LIST.RE_ORDERED };
  },
};
