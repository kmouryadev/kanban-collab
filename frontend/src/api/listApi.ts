import type { List, CreateListDTO, UpdateListDTO } from "../types/list";
import type { ListResponse } from "../types/api";
import axiosClient from "./axiosClient";
import { LISTS } from "../apiRoutes";

export const listApi = {
  createList: async (boardId: string, data: CreateListDTO): Promise<List> => {
    const res = await axiosClient.post(LISTS.BASE(boardId), data);
    return res.data;
  },

  getLists: async (boardId: string): Promise<ListResponse> => {
    const res = await axiosClient.get(LISTS.BASE(boardId));
    return res.data;
  },

  updateList: async (listId: string, data: UpdateListDTO): Promise<List> => {
    const res = await axiosClient.patch(LISTS.SINGLE(listId), data);
    return res.data;
  },

  deleteList: async (listId: string): Promise<{ message: string }> => {
    const res = await axiosClient.delete(LISTS.SINGLE(listId));
    return res.data;
  },

  reorderLists: async (
    boardId: string,
    data: string[]
  ): Promise<{ message: string }> => {
    const res = await axiosClient.patch(LISTS.REORDER_LISTS(boardId), {
      orderedIds: data,
    });
    return res.data;
  },
};
