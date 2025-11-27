import { Types } from "mongoose";
import { TaskModel, ITask, TaskPriority } from "../../models/Task.model";
import { ListModel } from "../../models/List.model";
import { BoardModel } from "../../models/Board.model";
import { createError } from "../../utils/error";
import { HTTP } from "../../constants/httpCodes";
import { MESSAGES } from "../../constants/messages";

export const TaskService = {
  async createTask(
    boardId: string,
    listId: string,
    userId: string,
    title: string,
    description?: string,
    priority?: TaskPriority
  ): Promise<ITask> {
    const board = await BoardModel.findOne({ _id: boardId, owner: userId });
    if (!board) throw createError(HTTP.NOT_FOUND, MESSAGES.BOARD.NOT_FOUND);

    const list = await ListModel.findOne({ _id: listId, boardId });
    if (!list) throw createError(HTTP.NOT_FOUND, MESSAGES.LIST.NOT_FOUND);

    const count = await TaskModel.countDocuments({ listId });

    const task = await TaskModel.create({
      title,
      description,
      priority,
      boardId: new Types.ObjectId(boardId),
      listId: new Types.ObjectId(listId),
      order: count,
    });

    return task;
  },

  async getTasks(
    boardId: string,
    listId: string,
    userId: string
  ): Promise<ITask[]> {
    const board = await BoardModel.findOne({ _id: boardId, owner: userId });
    if (!board) throw createError(HTTP.NOT_FOUND, MESSAGES.BOARD.NOT_FOUND);

    const list = await ListModel.findOne({ _id: listId, boardId });
    if (!list) throw createError(HTTP.NOT_FOUND, MESSAGES.LIST.NOT_FOUND);

    return TaskModel.find({ boardId, listId }).sort({ order: 1 });
  },

  async updateTask(
    taskId: string,
    userId: string,
    data: Partial<Pick<ITask, "title" | "description" | "priority">>
  ): Promise<ITask> {
    const task = await TaskModel.findById(taskId);
    if (!task) throw createError(HTTP.NOT_FOUND, MESSAGES.TASK.NOT_FOUND);

    const board = await BoardModel.findOne({
      _id: task.boardId,
      owner: userId,
    });
    if (!board) throw createError(HTTP.FORBIDDEN, MESSAGES.SERVER.FORBIDDEN);

    if (data.title !== undefined) task.title = data.title.trim();
    if (data.description !== undefined)
      task.description = data.description.trim();
    if (data.priority !== undefined) task.priority = data.priority;

    await task.save();
    return task;
  },

  async deleteTask(taskId: string, userId: string): Promise<void> {
    const task = await TaskModel.findById(taskId);
    if (!task) throw createError(HTTP.NOT_FOUND, MESSAGES.TASK.NOT_FOUND);

    const board = await BoardModel.findOne({
      _id: task.boardId,
      owner: userId,
    });
    if (!board) throw createError(HTTP.FORBIDDEN, MESSAGES.SERVER.FORBIDDEN);

    await task.deleteOne();
  },

  async moveTask(
    taskId: string,
    userId: string,
    newListId: string,
    newOrder: number
  ): Promise<ITask> {
    const task = await TaskModel.findById(taskId);
    if (!task) throw createError(HTTP.NOT_FOUND, MESSAGES.TASK.NOT_FOUND);

    const board = await BoardModel.findOne({
      _id: task.boardId,
      owner: userId,
    });
    if (!board) throw createError(HTTP.FORBIDDEN, MESSAGES.SERVER.FORBIDDEN);

    const oldListId = task.listId.toString();

    await TaskModel.updateMany(
      { listId: oldListId, order: { $gt: task.order } },
      { $inc: { order: -1 } }
    );

    await TaskModel.updateMany(
      { listId: newListId, order: { $gte: newOrder } },
      { $inc: { order: 1 } }
    );

    task.listId = new Types.ObjectId(newListId);
    task.order = newOrder;

    await task.save();

    return task;
  },

  async reorderTasks(listId: string, orderedIds: string[], userId: string) {
    const list = await ListModel.findById(listId);
    if (!list) throw createError(HTTP.NOT_FOUND, MESSAGES.LIST.NOT_FOUND);

    const board = await BoardModel.findOne({
      _id: list.boardId,
      owner: userId,
    });
    if (!board) throw createError(HTTP.FORBIDDEN, MESSAGES.SERVER.FORBIDDEN);

    const ops = orderedIds.map((id, index) =>
      TaskModel.updateOne({ _id: id }, { order: index })
    );

    await Promise.all(ops);

    return { message: MESSAGES.TASK.RE_ORDERED };
  },
};
