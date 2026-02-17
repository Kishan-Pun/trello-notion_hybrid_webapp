import prisma from "../config/prisma.js";
import { AuthRequest } from "./auth.middleware.js";
import { Response, NextFunction } from "express";

export const boardAccessMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let boardId: string | undefined =
      (req.params.boardId as string) ||
      (req.body?.boardId as string);

    // If taskId provided → get board from task
    if (req.params.taskId) {
      const task = await prisma.task.findUnique({
        where: { id: req.params.taskId as string },
        include: { list: true },
      });

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      boardId = task.list.boardId;
    }

    // If listId provided → get board from list
    if (req.body?.listId) {
      const list = await prisma.list.findUnique({
        where: { id: req.body.listId as string },
      });

      if (!list) {
        return res.status(404).json({ message: "List not found" });
      }

      boardId = list.boardId;
    }

    if (!boardId) {
      return res.status(400).json({ message: "Board ID required" });
    }

    const member = await prisma.boardMember.findUnique({
      where: {
        boardId_userId: {
          boardId,
          userId: req.userId!,
        },
      },
    });

    if (!member) {
      return res.status(403).json({ message: "Access denied" });
    }

    (req as any).boardRole = member.role;

    next();
  } catch (error) {
    console.error("Board access error:", error);
    res.status(500).json({ message: "Access check failed" });
  }
};
