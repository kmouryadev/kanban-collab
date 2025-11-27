import { Router } from "express";
import authRoutes from "./auth.routes";
import boardModuleRoutes from "./boards/index";

const router = Router();

router.use("/v1/auth", authRoutes);
router.use("/v1/boards", boardModuleRoutes);


export default router;
