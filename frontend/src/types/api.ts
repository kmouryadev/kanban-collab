import type { Board } from "./board";
import type { List } from "./list";
import type { Task } from "./tasks";

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ListResponse {
  lists: List[];
}

export interface TasksResponse {
  tasks: Task[];
}

export interface SingleTaskResponse {
  task: Task;
}

export interface BoardsResponse {
  boards: Board[];
}

export interface BoardResponse {
  board: Board;
}
