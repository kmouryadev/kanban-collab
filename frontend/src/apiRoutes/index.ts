export const API_BASE = "/v1";

export const AUTH = {
  BASE: `${API_BASE}/auth`,
  LOGIN: `${API_BASE}/auth/login`,
  REGISTER: `${API_BASE}/auth/register`,
};

export const BOARDS = {
  BASE: `${API_BASE}/boards`,
  SINGLE: (id: string) => `${API_BASE}/boards/${id}`,
};

export const LISTS = {
  BASE: (boardId: string) => `${API_BASE}/boards/${boardId}/lists`,
  SINGLE: (listId: string) => `${API_BASE}/boards/lists/${listId}`,
  REORDER_LISTS: (boardId: string) =>
    `${API_BASE}/boards/${boardId}/lists/reorder`,
};

export const TASKS = {
  LIST: (boardId: string, listId: string) =>
    `${API_BASE}/boards/${boardId}/lists/${listId}/tasks`,
  SINGLE: (taskId: string) => `${API_BASE}/boards/tasks/${taskId}`,
  REORDER: (listId: string) =>
    `${API_BASE}/boards/lists/${listId}/tasks/reorder`,
  MOVE: (taskId: string) => `${API_BASE}/boards/tasks/${taskId}/move`,
};
