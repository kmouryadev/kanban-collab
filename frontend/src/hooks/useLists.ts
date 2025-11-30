import { useQuery, useMutation } from "@tanstack/react-query";
import { listApi } from "../api/listApi";
import type { CreateListDTO, UpdateListDTO } from "../types/list";
import type { ListResponse } from "../types/api";
import { AppToast } from "../lib/appToast";

export const LISTS_QUERY_KEY = (boardId: string) => ["lists", boardId];

export const useLists = (boardId: string) => {
  const listsQuery = useQuery<ListResponse, Error>({
    queryKey: LISTS_QUERY_KEY(boardId),
    queryFn: () => listApi.getLists(boardId),
    enabled: !!boardId,
  });

  const create = useMutation({
    mutationFn: (data: CreateListDTO) => listApi.createList(boardId, data),
    onSuccess: () => {
      AppToast.success("List Created");
    },
    onError: (err: Error) =>
      AppToast.error("Could not create list", err.message),
  });

  const update = useMutation({
    mutationFn: ({ listId, data }: { listId: string; data: UpdateListDTO }) =>
      listApi.updateList(listId, data),
    onSuccess: () => {
      AppToast.success("List updated successfully");
    },
    onError: (err: Error) =>
      AppToast.error("Could not update list", err.message),
  });

  const remove = useMutation({
    mutationFn: (listId: string) => listApi.deleteList(listId),
    onSuccess: () => {
      AppToast.success("List deleted");
    },
    onError: (err: Error) =>
      AppToast.error("Could not delete list", err.message),
  });

  const reorder = useMutation<
    { message: string },
    Error,
    string[],
    { prev?: ListResponse }
  >({
    mutationFn: (newOrder) => listApi.reorderLists(boardId, newOrder),
    onError: (err: Error) => {
      AppToast.error("List reorder failed", err.message);
    },
    onSuccess: () => AppToast.success("Lists reordered"),
  });

  return {
    listsQuery,
    create,
    update,
    remove,
    reorder,
  };
};
