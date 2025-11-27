import { Router } from "express";

import boardRoutes from "./board.routes";
import listRoutes from "./list.routes";
import taskRoutes from "./task.routes";

const router = Router();

router.use("/", boardRoutes);
router.use("/", listRoutes);
router.use("/", taskRoutes);

export default router;
