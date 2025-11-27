export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  boardId: string;
  listId: string;
  order: number;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  priority?: TaskPriority;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  priority?: TaskPriority;
}

export interface MoveTaskDTO {
  newListId: string;
  newOrder: number;
}
