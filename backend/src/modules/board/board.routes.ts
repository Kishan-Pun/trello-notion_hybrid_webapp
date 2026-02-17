import { Router } from "express";
import {
  authMiddleware,
  AuthRequest,
} from "../../middlewares/auth.middleware.js";
import {
  createBoardHandler,
  getBoardsHandler,
  deleteBoardHandler,
} from "./board.controller.js";
import { transferOwnership, renameBoard } from "./board.service.js";
import { boardAccessMiddleware } from "../../middlewares/boardAccess.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";

const router = Router();

router.post("/", authMiddleware, createBoardHandler);

router.get("/", authMiddleware, getBoardsHandler);

router.put(
  "/:boardId/transfer/:userId",
  authMiddleware,
  boardAccessMiddleware,
  requireRole(["OWNER"]),
  async (req: AuthRequest, res) => {
    const { boardId, userId } = req.params as {
      boardId: string;
      userId: string;
    };

    const result = await transferOwnership(boardId, userId);
    res.json(result);
  },
);

router.put(
  "/:boardId",
  authMiddleware,
  boardAccessMiddleware,
  requireRole(["OWNER"]),
  async (req: AuthRequest, res) => {
    try {
      const boardId = req.params.boardId as string;
      const { title } = req.body;

      const updated = await renameBoard(boardId, title, req.userId!);

      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },
);

router.delete(
  "/:boardId",
  authMiddleware,
  boardAccessMiddleware,
  requireRole(["OWNER"]),
  deleteBoardHandler,
);

export default router;
