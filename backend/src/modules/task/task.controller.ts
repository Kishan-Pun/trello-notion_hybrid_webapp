import { Response } from "express";
import prisma from "../../config/prisma.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import {
  createTask,
  updateTask,
  moveTask,
  deleteTask,
} from "./task.service.js";
import { logActivity } from "../activity/activity.service.js";
import { io } from "../../server.js";

export const createTaskHandler = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, listId } = req.body as {
      title: string;
      description?: string;
      listId: string;
    };

    const task = await createTask(title, description, listId);

    const list = await prisma.list.findUnique({
      where: { id: listId },
    });

    if (list) {
      await logActivity("TASK_CREATED", list.boardId, req.userId!, {
        taskId: task.id,
        listId,
        title,
      });

      io.to(list.boardId).emit("task_created", task);
    }

    res.status(201).json(task);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTaskHandler = async (req: AuthRequest, res: Response) => {
  try {
    const taskId = req.params.taskId as string;
    const { title, description, dueDate } = req.body;

    const task = await updateTask(taskId, title, description, dueDate);

    // Get boardId
    const taskWithList = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        list: true,
      },
    });

    if (taskWithList) {
      await logActivity(
        "TASK_UPDATED",
        taskWithList.list.boardId,
        req.userId!,
        {
          taskId,
          title,
          description,
          dueDate, 
        },
      );

      io.to(taskWithList.list.boardId).emit("task_updated", task);
    }

    res.json(task);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const moveTaskHandler = async (req: AuthRequest, res: Response) => {
  try {
    const taskId = req.params.taskId as string;
    const { newListId, newPosition } = req.body as {
      newListId: string;
      newPosition: number;
    };

    // Get original task before moving
    const originalTask = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        list: true,
      },
    });

    if (!originalTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const task = await moveTask(taskId, newListId, newPosition);

    await logActivity("TASK_MOVED", originalTask.list.boardId, req.userId!, {
      taskId,
      fromListId: originalTask.listId,
      toListId: newListId,
      newPosition,
    });

    io.to(originalTask.list.boardId).emit("task_moved", {
      taskId,
      fromListId: originalTask.listId,
      toListId: newListId,
      newPosition,
    });

    res.json(task);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTaskHandler = async (req: AuthRequest, res: Response) => {
  try {
    const taskId = req.params.taskId as string;

    const taskWithList = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        list: true,
      },
    });

    if (!taskWithList) {
      return res.status(404).json({ message: "Task not found" });
    }

    await deleteTask(taskId);

    await logActivity("TASK_DELETED", taskWithList.list.boardId, req.userId!, {
      taskId,
      title: taskWithList.title,
    });

    io.to(taskWithList.list.boardId).emit("task_deleted", taskId);

    res.json({ message: "Task deleted" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
