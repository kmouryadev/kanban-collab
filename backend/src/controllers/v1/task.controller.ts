import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { TaskService } from "../../services/v1/task.service";
import { HTTP } from "../../constants/httpCodes";
import { MESSAGES } from "../../constants/messages";

const getUserId = (request: Request) => request.user.id;

export const TaskController = {
  createTask: asyncHandler(async (request: Request, response: Response) => {
    const { title, description, priority, backgroundColor } = request.body;
    const { boardId, listId } = request.params;

    const task = await TaskService.createTask(
      boardId,
      listId,
      getUserId(request),
      title,
      description,
      priority
    );

    response.status(HTTP.CREATED).json(task);
  }),

  getTasks: asyncHandler(async (request: Request, response: Response) => {
    const { boardId, listId } = request.params;

    const tasks = await TaskService.getTasks(
      boardId,
      listId,
      getUserId(request)
    );
    response.status(HTTP.OK).json({ tasks });
  }),

  updateTask: asyncHandler(async (request: Request, response: Response) => {
    const { taskId } = request.params;
    const task = await TaskService.updateTask(
      taskId,
      getUserId(request),
      request.body
    );
    response.status(HTTP.OK).json(task);
  }),

  deleteTask: asyncHandler(async (request: Request, response: Response) => {
    const { taskId } = request.params;

    await TaskService.deleteTask(taskId, getUserId(request));

    response.status(HTTP.OK).json({ message: MESSAGES.TASK.DELETED });
  }),

  moveTask: asyncHandler(async (request: Request, response: Response) => {
    const { taskId } = request.params;
    const { newListId, newOrder } = request.body;

    const result = await TaskService.moveTask(
      taskId,
      getUserId(request),
      newListId,
      newOrder
    );

    response.status(HTTP.OK).json(result);
  }),

  reorderTasks: asyncHandler(async (request: Request, response: Response) => {
    const { listId } = request.params;
    const { orderedIds } = request.body;

    const result = await TaskService.reorderTasks(
      listId,
      orderedIds,
      getUserId(request)
    );

    response.status(HTTP.OK).json(result);
  }),
};
