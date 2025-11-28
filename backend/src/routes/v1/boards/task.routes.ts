import { Router } from "express";
import requireAuth from "../../../middlewares/auth.middleware";
import { TaskController } from "../../../controllers/v1/task.controller";

const router = Router();
router.use(requireAuth);

/**
 * @openapi
 * /v1/boards/{boardId}/lists/{listId}/tasks:
 *   post:
 *     summary: Create a task in a list
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: boardId
 *         in: path
 *         required: true
 *       - name: listId
 *         in: path
 *         required: true
 *     responses:
 *       201:
 *         description: Task created
 */
router.post("/:boardId/lists/:listId/tasks", TaskController.createTask);

/**
 * @openapi
 * /v1/boards/{boardId}/lists/{listId}/tasks:
 *   get:
 *     summary: Get tasks for a list
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get("/:boardId/lists/:listId/tasks", TaskController.getTasks);

/**
 * @openapi
 * /v1/boards/tasks/{taskId}:
 *   patch:
 *     summary: Update a task
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task updated
 */
router.patch("/tasks/:taskId", TaskController.updateTask);

/**
 * @openapi
 * /v1/boards/tasks/{taskId}:
 *   delete:
 *     summary: Delete a task
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task deleted
 */
router.delete("/tasks/:taskId", TaskController.deleteTask);

/**
 * @openapi
 * /v1/boards/tasks/{taskId}/move:
 *   patch:
 *     summary: Move a task to another list
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [newListId, newOrder]
 *     responses:
 *       200:
 *         description: Task moved
 */
router.patch("/tasks/:taskId/move", TaskController.moveTask);

/**
 * @openapi
 * /v1/boards/lists/{listId}/tasks/reorder:
 *   patch:
 *     summary: Reorder tasks inside a list
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Tasks reordered
 */
router.patch("/lists/:listId/tasks/reorder", TaskController.reorderTasks);

export default router;
