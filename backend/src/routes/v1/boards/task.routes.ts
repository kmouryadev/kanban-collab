import { Router } from "express";
import requireAuth from "../../../middlewares/auth.middleware";
import { TaskController } from "../../../controllers/v1/task.controller";

const router = Router();
router.use(requireAuth);

router.post("/:boardId/lists/:listId/tasks", TaskController.createTask);
router.get("/:boardId/lists/:listId/tasks", TaskController.getTasks);
router.patch("/tasks/:taskId", TaskController.updateTask);
router.delete("/tasks/:taskId", TaskController.deleteTask);

router.patch("/tasks/:taskId/move", TaskController.moveTask);
router.patch("/lists/:listId/tasks/reorder", TaskController.reorderTasks);

export default router;
