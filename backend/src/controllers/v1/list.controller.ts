import { Request, Response } from "express";
import { ListService } from "../../services/v1/list.service";
import { HTTP } from "../../constants/httpCodes";
import asyncHandler from "express-async-handler";
import { MESSAGES } from "../../constants/messages";

const getUserId = (request: Request) => request.user.id;

export const ListController = {
  createList: asyncHandler(async (request: Request, response: Response) => {
    const { title } = request.body;
    const { boardId } = request.params;

    const list = await ListService.createList(
      boardId,
      getUserId(request),
      title
    );
    response.status(HTTP.CREATED).json(list);
  }),

  getLists: asyncHandler(async (request: Request, response: Response) => {
    const { boardId } = request.params;
    const lists = await ListService.getLists(boardId, getUserId(request));
    response.status(HTTP.OK).json({ lists });
  }),

  updateList: asyncHandler(async (request: Request, response: Response) => {
    const { listId } = request.params;
    const list = await ListService.updateList(
      listId,
      getUserId(request),
      request.body.title
    );
    response.status(HTTP.OK).json(list);
  }),

  deleteList: asyncHandler(async (request: Request, response: Response) => {
    const { listId } = request.params;
    await ListService.deleteList(listId, getUserId(request));
    response.status(HTTP.OK).json({ message: MESSAGES.LIST.DELETED });
  }),

  reorderLists: asyncHandler(async (request: Request, response: Response) => {
    const { boardId } = request.params;
    const { orderedIds } = request.body;

    const result = await ListService.reorderLists(
      boardId,
      getUserId(request),
      orderedIds
    );
    response.status(HTTP.OK).json(result);
  }),
};
