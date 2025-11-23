import { Router } from "express";
import { register, login } from "../../controllers/v1/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);

export default router;
