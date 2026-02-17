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
import prisma from "../../config/prisma.js"; // Make sure this exists

const router = Router();

router.post(
  "/invite/:boardId",
  authMiddleware,
  boardAccessMiddleware,
  requireRole(["OWNER", "ADMIN"]),
  async (req: AuthRequest, res) => {
    try {
      const boardId = req.params.boardId as string;
      const { email } = req.body as { email: string };

      if (!boardId) {
        return res.status(400).json({ message: "Board ID required" });
      }

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const existing = await prisma.boardMember.findUnique({
        where: {
          boardId_userId: {
            boardId,
            userId: user.id,
          },
        },
      });

      if (existing) {
        return res.status(400).json({ message: "User already a member" });
      }

      await prisma.boardMember.create({
        data: {
          boardId,
          userId: user.id,
          role: "MEMBER",
        },
      });

      res.json({ message: "User invited successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
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
  },
);

export default router;
