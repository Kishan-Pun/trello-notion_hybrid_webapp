import { Router } from "express";
import { authMiddleware, AuthRequest } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import prisma from "../config/prisma.js";
import { sendInviteEmail } from "./invite.service.js";

const router = Router();

router.post(
  "/:boardId",
  authMiddleware,
  requireRole(["OWNER", "ADMIN"]),
  async (req: AuthRequest, res) => {
    try {
      const boardId = req.params.boardId;

      if (!boardId || typeof boardId !== "string") {
        return res.status(400).json({ message: "Invalid boardId" });
      }

      const { email } = req.body;

      const board = await prisma.board.findUnique({
        where: { id: boardId },
      });

      if (!board) {
        return res.status(404).json({ message: "Board not found" });
      }

      await sendInviteEmail(email, boardId, board.title);

      res.json({ message: "Invite sent" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
);

export default router;
