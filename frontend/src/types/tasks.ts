export type TaskPriority = "low" | "medium" | "high";

export interface TaskUserRef {
  _id: string;
  name: string;
  email: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  boardId: string;
  listId: string;
  order: number;
  priority: TaskPriority;
  assignee?: TaskUserRef | null;
  lastUpdatedBy?: TaskUserRef | null;
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
