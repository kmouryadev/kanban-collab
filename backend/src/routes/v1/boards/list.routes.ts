import { Router } from "express";
import requireAuth from "../../../middlewares/auth.middleware";
import { ListController } from "../../../controllers/v1/list.controller";

const router = Router();

router.use(requireAuth);

/**
 * @openapi
 * /v1/boards/{boardId}/lists:
 *   post:
 *     summary: Create a list inside a board
 *     tags:
 *       - Lists
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: boardId
 *         in: path
 *         required: true
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
 *     responses:
 *       201:
 *         description: List created
 */
router.post("/:boardId/lists", ListController.createList);

/**
 * @openapi
 * /v1/boards/{boardId}/lists:
 *   get:
 *     summary: Get lists for a board
 *     tags:
 *       - Lists
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: boardId
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: List of lists
 */
router.get("/:boardId/lists", ListController.getLists);

/**
 * @openapi
 * /v1/boards/lists/{listId}:
 *   patch:
 *     summary: Update a list
 *     tags:
 *       - Lists
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: listId
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: List updated
 */
router.patch("/lists/:listId", ListController.updateList);

/**
 * @openapi
 * /v1/boards/lists/{listId}:
 *   delete:
 *     summary: Delete a list
 *     tags:
 *       - Lists
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: listId
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: List deleted
 */
router.delete("/lists/:listId", ListController.deleteList);

/**
 * @openapi
 * /v1/boards/{boardId}/lists/reorder:
 *   patch:
 *     summary: Reorder lists inside a board
 *     tags:
 *       - Lists
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orderedIds]
 *     responses:
 *       200:
 *         description: Lists reordered
 */
router.patch("/:boardId/lists/reorder", ListController.reorderLists);

export default router;
