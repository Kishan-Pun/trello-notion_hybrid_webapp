import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { boardAccessMiddleware } from "../../middlewares/boardAccess.middleware.js";
import {
  addMemberToBoard,
  getBoardMembers,
  leaveBoard,
  removeMemberFromBoard,
  updateMemberRole,
} from "./boardMember.service.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/:boardId/:userId",
  authMiddleware,
  boardAccessMiddleware,
  requireRole(["OWNER", "ADMIN"]),
  async (req: AuthRequest, res) => {
    const { boardId, userId } = req.params as {
      boardId: string;
      userId: string;
    };

    const member = await addMemberToBoard(boardId, userId, req.userId!);

    res.json(member);
  },
);

router.get(
  "/:boardId",
  authMiddleware,
  boardAccessMiddleware,
  async (req, res) => {
    const { boardId } = req.params as { boardId: string };

    const members = await getBoardMembers(boardId);
    res.json(members);
  },
);

router.put(
  "/:boardId/:userId/role",
  authMiddleware,
  boardAccessMiddleware,
  requireRole(["OWNER"]),
  async (req: AuthRequest, res) => {
    const { boardId, userId } = req.params as {
      boardId: string;
      userId: string;
    };

    const { role } = req.body as { role: string };

    const updated = await updateMemberRole(boardId, userId, role, req.userId!);

    res.json(updated);
  },
);

router.delete(
  "/:boardId/:userId",
  authMiddleware,
  boardAccessMiddleware,
  async (req: AuthRequest, res) => {
    const { boardId, userId } = req.params as {
      boardId: string;
      userId: string;
    };

    const result = await removeMemberFromBoard(boardId, userId, req.userId!);

    res.json(result);
  },
);

router.delete(
  "/:boardId/leave",
  authMiddleware,
  boardAccessMiddleware,
  async (req: AuthRequest, res) => {
    const { boardId } = req.params as { boardId: string };

    const result = await leaveBoard(boardId, req.userId!);

    res.json(result);
  }
);


export default router;
