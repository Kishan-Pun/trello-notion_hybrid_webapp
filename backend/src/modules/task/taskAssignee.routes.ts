import { Router } from "express";
import { authMiddleware, AuthRequest } from "../../middlewares/auth.middleware.js";
import { boardAccessMiddleware } from "../../middlewares/boardAccess.middleware.js";
import {
  assignUserToTask,
  removeUserFromTask,
} from "./taskAssignee.service.js";

const router = Router();

router.post(
  "/:taskId/:userId",
  authMiddleware,
  boardAccessMiddleware,
 async (req: AuthRequest, res) => {
    try {
      const { taskId, userId } = req.params as {
        taskId: string;
        userId: string;
      };

      const result = await assignUserToTask(
        taskId as string,
        userId as string,
        req.userId!,
      );

      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
);

router.delete(
  "/:taskId/:userId",
  authMiddleware,
  boardAccessMiddleware,
  async (req, res) => {
    const taskId = req.params.taskId as string;
    const userId = req.params.userId as string;

    if (!taskId || !userId) {
      return res.status(400).json({ message: "Invalid parameters" });
    }

    await removeUserFromTask(taskId, userId);
    res.json({ message: "Removed" });
  },
);

export default router;
