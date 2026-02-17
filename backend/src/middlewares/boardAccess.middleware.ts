import { Response, NextFunction } from "express";
import prisma from "../config/prisma.js";
import { AuthRequest } from "./auth.middleware.js";

export const boardAccessMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let boardId: string | undefined;

    // 1️⃣ From params.boardId
    if (typeof req.params.boardId === "string") {
      boardId = req.params.boardId;
    }

    // 2️⃣ From body.boardId
    if (typeof req.body?.boardId === "string") {
      boardId = req.body.boardId;
    }

    // 3️⃣ From taskId
    if (typeof req.params.taskId === "string") {
      const task = await prisma.task.findUnique({
        where: { id: req.params.taskId },
        include: { list: true },
      });

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      boardId = task.list.boardId;
    }

    // 4️⃣ From listId in params
    if (typeof req.params.listId === "string") {
      const list = await prisma.list.findUnique({
        where: { id: req.params.listId },
      });

      if (!list) {
        return res.status(404).json({ message: "List not found" });
      }

      boardId = list.boardId;
    }

    // 5️⃣ From listId in body
    if (typeof req.body?.listId === "string") {
      const list = await prisma.list.findUnique({
        where: { id: req.body.listId },
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
    return res.status(500).json({ message: "Access check failed" });
  }
};
