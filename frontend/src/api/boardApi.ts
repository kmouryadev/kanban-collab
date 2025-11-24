import type { Board, Boards } from "../types/board";
import axiosClient from "./axiosClient";

export interface BoardPayloadDTO {
  title: string;
  description?: string;
  backgroundColor?: string;
}

export const boardsApi = {
  list: async (): Promise<Boards> => {
    const res = await axiosClient.get<Boards>("/v1/boards");
    return res.data;
  },

  create: async (payload: BoardPayloadDTO): Promise<Board> => {
    const res = await axiosClient.post<Board>("/v1/boards", payload);
    return res.data;
  },

  get: async (id: string): Promise<Board> => {
    const res = await axiosClient.get<Board>(`/v1/boards/${id}`);
    return res.data;
  },

  update: async (
    id: string,
    payload: Partial<BoardPayloadDTO>
  ): Promise<Board> => {
    const res = await axiosClient.patch<Board>(`/v1/boards/${id}`, payload);
    return res.data;
  },

  remove: async (id: string): Promise<void> => {
    await axiosClient.delete(`/v1/boards/${id}`);
  },
};
