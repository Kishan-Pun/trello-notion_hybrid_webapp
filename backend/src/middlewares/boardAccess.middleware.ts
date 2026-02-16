import prisma from "../config/prisma.js";
import { AuthRequest } from "./auth.middleware.js";
import { Response, NextFunction } from "express";

export const boardAccessMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let boardId =
    req.params.boardId ||
    req.body.boardId;

  if (req.params.taskId) {
    const taskId = req.params.taskId as string;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        list: true,
      },
    });

    if (!task || !task.list) {
      return res.status(404).json({ message: "Task not found" });
    }

    boardId = task.list.boardId;
  }

  if (req.body.listId) {
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
        boardId: boardId as string,
        userId: req.userId!,
      },
    },
  });

  if (!member) {
    return res.status(403).json({ message: "Access denied" });
  }

  (req as any).boardRole = member.role;

  next();
};
