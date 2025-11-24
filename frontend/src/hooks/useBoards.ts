import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  boardsApi,
  type BoardPayloadDTO,
} from "../api/boardApi";
import type { Board, Boards } from "../types/board";

const BOARDS_KEY = ["boards"];

interface UpdateBoardParams {
  id: string;
  payload: BoardPayloadDTO;
}

export const useBoards = () => {
  const queryClient = useQueryClient();

  const list = useQuery<Boards, Error>({
    queryKey: BOARDS_KEY,
    queryFn: async () => {
      return await boardsApi.list();
    },
    staleTime: 1000 * 60,
  });

  const create = useMutation<Board, Error, BoardPayloadDTO>({
    mutationFn: (payload) => boardsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOARDS_KEY });
    },
  });

  const update = useMutation<Board, Error, UpdateBoardParams>({
    mutationFn: ({ id, payload }) => boardsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOARDS_KEY });
    },
  });

  const remove = useMutation<void, Error, string>({
    mutationFn: (id) => boardsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BOARDS_KEY }),
  });

  return { list, create, update, remove };
};
