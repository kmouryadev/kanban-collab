import type { Task, CreateTaskDTO, UpdateTaskDTO } from "../types/tasks";
import type {
  TasksResponse,
  SingleTaskResponse,
} from "../types/api";
import axiosClient from "./axiosClient";
import { TASKS } from "../apiRoutes";

export const taskApi = {
  createTask: async (
    boardId: string,
    listId: string,
    data: CreateTaskDTO
  ): Promise<Task> => {
    const res = await axiosClient.post(TASKS.LIST(boardId, listId), data);
    return res.data;
  },

  getTasks: async (
    boardId: string,
    listId: string
  ): Promise<TasksResponse> => {
    const res = await axiosClient.get(TASKS.LIST(boardId, listId));
    return res.data;
  },

  updateTask: async (
    taskId: string,
    data: UpdateTaskDTO
  ): Promise<SingleTaskResponse> => {
    const res = await axiosClient.patch(TASKS.SINGLE(taskId), data);
    return res.data;
  },

  deleteTask: async (taskId: string): Promise<{ message: string }> => {
    const res = await axiosClient.delete(TASKS.SINGLE(taskId));
    return res.data;
  },

  reorderTasks: async (
    listId: string,
    orderedIds: string[]
  ): Promise<{ message: string }> => {
    const res = await axiosClient.patch(TASKS.REORDER(listId), { orderedIds });
    return res.data;
  },

  moveTasks: async (
    taskId: string,
    newListId: string,
    newOrder: string
  ): Promise<{ message: string }> => {
    const res = await axiosClient.patch(TASKS.MOVE(taskId), {
      newListId,
      newOrder,
    });
    return res.data;
  },
};
