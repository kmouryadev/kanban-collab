import { Request, Response } from "express";
import {
  createBoard,
  updateBoard,
  listBoards,
  getBoard,
  deleteBoard,
} from "../../services/v1/board.service";
import { MESSAGES } from "../../constants/messages";

function getUserId(req: Request) {
  const user = req.user;
  return user.id;
}

export const BoardController = {
  createBoard: async (req: Request, res: Response) => {
    const { title, description, backgroundColor } = req.body;

    const result = await createBoard(
      title,
      description,
      backgroundColor,
      getUserId(req)
    );

    if (result.error) {
      return res.status(result.status).json({ message: result.error });
    }

    return res.status(result.status).json({ board: result.data,  message: MESSAGES.BOARD.CREATE_SUCCESS  });
  },

  listBoards: async (req: Request, res: Response) => {
    const result = await listBoards(getUserId(req));

    return res.status(result.status).json({ boards: result.data });
  },

  getBoard: async (req: Request, res: Response) => {
    const result = await getBoard(req.params.id);

    if (result.error) {
      return res.status(result.status).json({ message: result.error });
    }

    return res.status(result.status).json({ board: result.data });
  },

  updateBoard: async (req: Request, res: Response) => {
    const result = await updateBoard(
      req.params.id,
      getUserId(req),
      req.body
    );

    if (result.error) {
      return res.status(result.status).json({ message: result.error });
    }

    return res.status(result.status).json({ board: result.data, message: MESSAGES.BOARD.UPDATE_SUCCESS });
  },

  deleteBoard: async (req: Request, res: Response) => {
    const result = await deleteBoard(req.params.id, getUserId(req));

    if (result.error) {
      return res.status(result.status).json({ message: result.error });
    }

    return res.status(result.status).json({ message: result.message });
  },
};
