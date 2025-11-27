export const MESSAGES = {
  USER: {
    REGISTER_SUCCESS: "User registered successfully",
    TOKEN_EXPIRED: "Token is expired",
    NOT_FOUND: "User not found",
    EMAIL_EXISTS: "Email already exists",
    INVALID_CREDENTIALS: "Invalid credentials",
    LOGIN_SUCCESS: "Login successful",
  },

  BOARD: {
    TITLE_REQUIRED: "Board title is required",
    INVALID_ID: "Invalid board ID",
    NOT_FOUND: "Board not found",
    CREATE_SUCCESS: "Board created successfully",
    UPDATE_SUCCESS: "Board updated successfully",
    DELETE_SUCCESS: "Board deleted successfully",
    UPDATE_FORBIDDEN: "You are not allowed to update this board",
    DELETE_FORBIDDEN: "You are not allowed to delete this board",
  },

  LIST: {
    NOT_FOUND: "List not found",
    CREATED: "List created successfully",
    UPDATED: "List updated successfully",
    DELETED: "List deleted",
    RE_ORDERED: "Lists reordered",
  },

  TASK: {
    NOT_FOUND: "Task not found",
    CREATED: "Task created successfully",
    UPDATED: "Task updated successfully",
    DELETED: "Task deleted",
    MOVED: "Task moved successfully",
    RE_ORDERED: "Tasks reordered",
  },

  SERVER: {
    ERROR: "Internal Server Error",
    FORBIDDEN: "Not allowed",
  },
};
