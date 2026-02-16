import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { createBoard, getUserBoards } from "./board.service.js";

export const createBoardHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { title } = req.body as { title: string };

    const board = await createBoard(title, req.userId!);

    res.status(201).json(board);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getBoardsHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const boards = await getUserBoards(req.userId!);

    res.json(boards);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
