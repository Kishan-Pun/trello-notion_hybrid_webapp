import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { boardAccessMiddleware } from "../../middlewares/boardAccess.middleware.js";
import prisma from "../../config/prisma.js";

const router = Router();

router.get(
  "/:boardId",
  authMiddleware,
  boardAccessMiddleware,
  async (req, res) => {
    try {
      const boardId = req.params.boardId as string;

      const activities = await prisma.activityLog.findMany({
        where: { boardId },
        include: {
          user: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 50, 
      });

      res.json(activities);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
);

export default router;
