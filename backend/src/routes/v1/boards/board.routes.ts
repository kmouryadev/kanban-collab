import { Router } from "express";
import { BoardController } from "../../../controllers/v1/board.controller";
import requireAuth from "../../../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

/**
 * @openapi
 * /v1/boards:
 *   post:
 *     summary: Create a new board
 *     tags:
 *       - Boards
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               backgroundColor:
 *                 type: string
 *     responses:
 *       201:
 *         description: Board created
 */
router.post("/", BoardController.createBoard);

/**
 * @openapi
 * /v1/boards:
 *   get:
 *     summary: Get user's boards
 *     tags:
 *       - Boards
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of boards
 */
router.get("/", BoardController.listBoards);

/**
 * @openapi
 * /v1/boards/{id}:
 *   get:
 *     summary: Get board by ID
 *     tags:
 *       - Boards
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Board details
 *       404:
 *         description: Board not found
 */
router.get("/:id", BoardController.getBoard);

/**
 * @openapi
 * /v1/boards/{id}:
 *   patch:
 *     summary: Update board
 *     tags:
 *       - Boards
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Board updated
 */
router.patch("/:id", BoardController.updateBoard);

/**
 * @openapi
 * /v1/boards/{id}:
 *   delete:
 *     summary: Delete a board
 *     tags:
 *       - Boards
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Board deleted
 */
router.delete("/:id", BoardController.deleteBoard);

export default router;
