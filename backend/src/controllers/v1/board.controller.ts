import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  createBoard,
  updateBoard,
  listBoards,
  getBoard,
  deleteBoard,
  shareBoard,
} from "../../services/v1/board.service";
import { MESSAGES } from "../../constants/messages";

const getUserId = (request: Request) => request.user.id;

export const BoardController = {
  createBoard: asyncHandler(async (request: Request, response: Response) => {
    const { title, description, backgroundColor } = request.body;

    const result = await createBoard(
      title,
      description,
      backgroundColor,
      getUserId(request)
    );

    if (result.error) {
      response.status(result.status).json({ message: result.error });
      return;
    }

    response.status(result.status).json({
      board: result.data,
      message: MESSAGES.BOARD.CREATE_SUCCESS,
    });
  }),

  listBoards: asyncHandler(async (request: Request, response: Response) => {
    const result = await listBoards(getUserId(request));

    response.status(result.status).json({ boards: result.data });
  }),

  getBoard: asyncHandler(async (request: Request, response: Response) => {
    const result = await getBoard(request.params.id);

    if (result.error) {
      response.status(result.status).json({ message: result.error });
      return;
    }

    response.status(result.status).json({ board: result.data });
  }),

  updateBoard: asyncHandler(async (request: Request, response: Response) => {
    const result = await updateBoard(
      request.params.id,
      getUserId(request),
      request.body
    );

    if (result.error) {
      response.status(result.status).json({ message: result.error });
      return;
    }

    response.status(result.status).json({
      board: result.data,
      message: MESSAGES.BOARD.UPDATE_SUCCESS,
    });
  }),

  deleteBoard: asyncHandler(async (request: Request, response: Response) => {
    const result = await deleteBoard(request.params.id, getUserId(request));

    if (result.error) {
      response.status(result.status).json({ message: result.error });
      return;
    }

    response.status(result.status).json({ message: result.message });
  }),

  shareBoard: asyncHandler(async (request, response) => {
    const { id } = request.params;
    const { email } = request.body;

    const result = await shareBoard(id, request.user.id, email);

    if (result.error) {
      response.status(result.status).json({ message: result.error });
      return;
    }

    response.status(result.status).json({
      message: "Board shared successfully",
      data: result.data,
    });
    return;
  }),
};
