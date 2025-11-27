import { Router } from "express";
import requireAuth from "../../../middlewares/auth.middleware";
import { ListController } from "../../../controllers/v1/list.controller";

const router = Router();

router.use(requireAuth);

router.post("/:boardId/lists", ListController.createList);
router.get("/:boardId/lists", ListController.getLists);

router.patch("/lists/:listId", ListController.updateList);
router.delete("/lists/:listId", ListController.deleteList);

router.patch("/:boardId/lists/reorder", ListController.reorderLists);

export default router;
