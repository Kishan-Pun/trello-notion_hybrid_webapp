import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { createList, getListsByBoard } from "./list.service.js";

export const createListHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { title, boardId } = req.body as {
      title: string;
      boardId: string;
    };

    const list = await createList(title, boardId);

    res.status(201).json(list);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getListsHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const boardId = req.params.boardId as string;

    if (!boardId) {
      return res.status(400).json({ message: "Board ID is required" });
    }

    const lists = await getListsByBoard(boardId);

    res.json(lists);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
