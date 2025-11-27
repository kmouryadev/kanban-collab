import { Types } from "mongoose";
import { ListModel, IList } from "../../models/List.model";
import { BoardModel } from "../../models/Board.model";
import { createError } from "../../utils/error";
import { HTTP } from "../../constants/httpCodes";
import { MESSAGES } from "../../constants/messages";

export const ListService = {
  async createList(
    boardId: string,
    userId: string,
    title: string
  ): Promise<IList> {
    const board = await BoardModel.findOne({ _id: boardId, owner: userId });

    if (!board) {
      throw createError(HTTP.NOT_FOUND, MESSAGES.BOARD.NOT_FOUND);
    }

    const count = await ListModel.countDocuments({ boardId });

    const newList = await ListModel.create({
      title,
      boardId: new Types.ObjectId(boardId),
      order: count,
    });

    return newList;
  },

  async getLists(boardId: string, userId: string): Promise<IList[]> {
    const board = await BoardModel.findOne({ _id: boardId, owner: userId });

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

    const board = await BoardModel.findOne({
      _id: list.boardId,
      owner: userId,
    });
    if (!board) throw createError(HTTP.FORBIDDEN, MESSAGES.SERVER.FORBIDDEN);

    list.title = title;
    await list.save();

    return list;
  },

  async deleteList(listId: string, userId: string): Promise<void> {
    const list = await ListModel.findById(listId);
    if (!list) throw createError(HTTP.NOT_FOUND, MESSAGES.LIST.NOT_FOUND);

    const board = await BoardModel.findOne({
      _id: list.boardId,
      owner: userId,
    });
    if (!board) throw createError(HTTP.FORBIDDEN, MESSAGES.SERVER.FORBIDDEN);

    await list.deleteOne();
  },

  async reorderLists(boardId: string, userId: string, orderedIds: string[]) {
    const board = await BoardModel.findOne({ _id: boardId, owner: userId });
    if (!board) throw createError(HTTP.NOT_FOUND, MESSAGES.BOARD.NOT_FOUND);

    const operations = orderedIds.map((id, index) =>
      ListModel.updateOne({ _id: id }, { order: index })
    );

    await Promise.all(operations);

    return { message: MESSAGES.LIST.RE_ORDERED };
  },
};
