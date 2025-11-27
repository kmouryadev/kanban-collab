import { Router } from "express";
import { BoardController } from "../../../controllers/v1/board.controller";
import requireAuth from "../../../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

router.post("/", BoardController.createBoard);
router.get("/", BoardController.listBoards);
router.get("/:id", BoardController.getBoard);
router.patch("/:id", BoardController.updateBoard);
router.delete("/:id", BoardController.deleteBoard);

export default router;
