import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { createBoard, getUserBoards } from "./board.service.js";
import prisma from "../../config/prisma.js";
import { inviteMemberToBoard } from "./board.service.js";

export const createBoardHandler = async (req: AuthRequest, res: Response) => {
  try {
    const { title } = req.body;

    const board = await prisma.$transaction(async (tx) => {
      // 1️⃣ Create board
      const newBoard = await tx.board.create({
        data: { title },
      });

      // 2️⃣ Insert creator as OWNER
      await tx.boardMember.create({
        data: {
          boardId: newBoard.id,
          userId: req.userId!,
          role: "OWNER",
        },
      });

      return newBoard;
    });

    res.status(201).json(board);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getBoardsHandler = async (req: AuthRequest, res: Response) => {
  try {
    const boards = await prisma.boardMember.findMany({
      where: {
        userId: req.userId!,
      },
      include: {
        board: true,
      },
    });

    res.json(
      boards.map((b) => ({
        id: b.board.id,
        title: b.board.title,
        role: b.role,
        createdAt: b.board.createdAt,
      })),
    );
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

import { deleteBoard } from "./board.service.js";

export const deleteBoardHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const boardId = req.params.boardId as string;

    const result = await deleteBoard(boardId, req.userId!);

    res.json(result);
  } catch (error: any) {
    res.status(403).json({ message: error.message });
  }
};

export const inviteMemberHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const boardId = req.params.boardId as string;
    const { email } = req.body;

    const result = await inviteMemberToBoard(boardId, email);

    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

