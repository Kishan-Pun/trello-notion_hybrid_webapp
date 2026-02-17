import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import {
  createList,
  getListsByBoard,
  updateList,
  deleteList,
} from "./list.service.js";

export const createListHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { title, boardId } = req.body;

    const list = await createList(title, boardId);

    res.status(201).json(list);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

export const getListsHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const boardId = req.params.boardId as string;

    const lists = await getListsByBoard(boardId);

    res.json(lists);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

export const updateListHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const listId = req.params.listId as string;
    const { title } = req.body;

    const updated = await updateList(listId, title);

    res.json(updated);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

export const deleteListHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const listId = req.params.listId as string;

    await deleteList(listId);

    res.json({ message: "List deleted successfully" });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};
