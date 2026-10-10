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
    SHARE_FORBIDDEN: "Only owner can share board",
    SHARED_OWNER_ACCESS: "Owner already has access",
    SHARED_MEMBER_ACCESS:"User already a member",
    WORKFLOW_UPDATE_FORBIDDEN: "Only the owner can update workflow rules",
    WORKFLOW_INVALID_LIST: "Workflow transitions must reference lists on this board",
    REMOVE_MEMBER_FORBIDDEN: "Only the owner can remove members",
    MEMBER_NOT_FOUND: "User is not a member of this board",
    CANNOT_REMOVE_OWNER: "The board owner cannot be removed",
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
    TRANSITION_FORBIDDEN: "This move isn't allowed by the board's workflow rules",
    INVALID_ASSIGNEE: "Assignee must be a member of this board",
  },

  SERVER: {
    ERROR: "Internal Server Error",
    FORBIDDEN: "Not allowed",
  },
};
