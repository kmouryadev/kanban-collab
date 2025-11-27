import { BOARDS } from "../apiRoutes";
import type { BoardResponse, BoardsResponse } from "../types/api";
import type { Board } from "../types/board";
import axiosClient from "./axiosClient";

export interface BoardPayloadDTO {
  title: string;
  description?: string;
  backgroundColor?: string;
}

export const boardsApi = {
  list: async (): Promise<BoardsResponse> => {
    const res = await axiosClient.get<BoardsResponse>(BOARDS.BASE);
    return res.data;
  },

  create: async (payload: BoardPayloadDTO): Promise<Board> => {
    const res = await axiosClient.post<Board>(BOARDS.BASE, payload);
    return res.data;
  },

  get: async (id: string): Promise<BoardResponse> => {
    const res = await axiosClient.get<BoardResponse>(BOARDS.SINGLE(id));
    return res.data;
  },

  update: async (
    id: string,
    payload: Partial<BoardPayloadDTO>
  ): Promise<Board> => {
    const res = await axiosClient.patch<Board>(BOARDS.SINGLE(id), payload);
    return res.data;
  },

  remove: async (id: string): Promise<void> => {
    await axiosClient.delete(BOARDS.SINGLE(id));
  },
};
