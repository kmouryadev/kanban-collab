import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listApi } from "../api/listApi";
import type {
  CreateListDTO,
  UpdateListDTO,
  List as ListType,
} from "../types/list";
import type { ListResponse } from "../types/api";
import { AppToast } from "../lib/appToast";

export const LISTS_QUERY_KEY = (boardId: string) => ["lists", boardId];

export const useLists = (boardId: string) => {
  const queryClient = useQueryClient();

  const listsQuery = useQuery<ListResponse, Error>({
    queryKey: LISTS_QUERY_KEY(boardId),
    queryFn: () => listApi.getLists(boardId),
    enabled: !!boardId,
  });

  const create = useMutation({
    mutationFn: (data: CreateListDTO) => listApi.createList(boardId, data),
    onSuccess: (newList: ListType) => {
      queryClient.setQueryData<ListResponse | undefined>(
        LISTS_QUERY_KEY(boardId),
        (prev) => {
          if (!prev) return { lists: [newList] };
          return { lists: [...prev.lists, newList] };
        }
      );
      AppToast.success("List Created");
    },
    onError: (err: Error) =>
      AppToast.error("Could not create list", err.message),
  });

  const update = useMutation({
    mutationFn: ({ listId, data }: { listId: string; data: UpdateListDTO }) =>
      listApi.updateList(listId, data),
    onSuccess: (updatedList: ListType) => {
      queryClient.setQueryData<ListResponse | undefined>(
        LISTS_QUERY_KEY(boardId),
        (old) => {
          if (!old) return old;
          return {
            lists: old.lists.map((oldList) =>
              oldList._id === updatedList._id ? updatedList : oldList
            ),
          };
        }
      );
      AppToast.success("List updated successfully");
    },
    onError: (err: Error) =>
      AppToast.error("Could not update list", err.message),
  });

  const remove = useMutation({
    mutationFn: (listId: string) => listApi.deleteList(listId),
    onSuccess: (_res, listId) => {
      queryClient.setQueryData<ListResponse | undefined>(
        LISTS_QUERY_KEY(boardId),
        (old) => {
          if (!old) return old;
          return { lists: old.lists.filter((oldList) => oldList._id !== listId) };
        }
      );
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
    onMutate: async (newOrder) => {
      await queryClient.cancelQueries({ queryKey: LISTS_QUERY_KEY(boardId) });
      const prev = queryClient.getQueryData<ListResponse>(
        LISTS_QUERY_KEY(boardId)
      );
      if (prev) {
        const map = new Map(prev.lists.map((prevList) => [prevList._id, { ...prevList }]));
        const updated = newOrder
          .map((id, idx) => {
            const item = map.get(id);
            if (!item) return null;
            return { ...item, position: idx };
          })
          .filter(Boolean) as ListType[];
        queryClient.setQueryData<ListResponse>(LISTS_QUERY_KEY(boardId), {
          lists: updated,
        });
      }
      return { prev };
    },
    onError: (err, _vars, context) => {
      if (context?.prev)
        queryClient.setQueryData(LISTS_QUERY_KEY(boardId), context.prev);
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
