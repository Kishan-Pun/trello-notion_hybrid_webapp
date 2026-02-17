import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import {
  createList,
  getListsByBoard,
  updateList,
  deleteList,
} from "./list.service.js";
import prisma from "../../config/prisma.js";

export const createListHandler = async (req: AuthRequest, res: Response) => {
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

export const getListsHandler = async (req: AuthRequest, res: Response) => {
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

export const updateListHandler = async (req: AuthRequest, res: Response) => {
  try {
    const listId = req.params.listId as string;
    const { title } = req.body;

    const updated = await prisma.list.update({
      where: { id: listId },
      data: { title },
    });

    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteListHandler = async (req: AuthRequest, res: Response) => {
  try {
    const listId = req.params.listId as string;

    await prisma.list.delete({
      where: { id: listId },
    });

    res.json({ message: "List deleted" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
