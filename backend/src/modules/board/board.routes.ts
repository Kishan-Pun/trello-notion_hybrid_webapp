import { Router } from "express";
import {
  authMiddleware,
  AuthRequest,
} from "../../middlewares/auth.middleware.js";
import {
  createBoardHandler,
  getBoardsHandler,
  deleteBoardHandler,
  inviteMemberHandler,
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

router.post(
  "/:boardId/invite",
  authMiddleware,
  boardAccessMiddleware,
  requireRole(["OWNER", "ADMIN"]),
  inviteMemberHandler,
);

router.delete(
  "/:boardId",
  authMiddleware,
  boardAccessMiddleware,
  requireRole(["OWNER"]),
  deleteBoardHandler,
);

export default router;
