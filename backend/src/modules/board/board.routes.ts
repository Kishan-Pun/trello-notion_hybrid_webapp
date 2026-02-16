import { Router } from "express";
import { authMiddleware, AuthRequest } from "../../middlewares/auth.middleware.js";
import {
  createBoardHandler,
  getBoardsHandler,
} from "./board.controller.js";
import { transferOwnership } from "./board.service.js";
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
  }
);

export default router;
