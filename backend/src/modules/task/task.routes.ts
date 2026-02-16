import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { boardAccessMiddleware } from "../../middlewares/boardAccess.middleware.js";
import {
  createTaskHandler,
  updateTaskHandler,
  moveTaskHandler,
  deleteTaskHandler,
} from "./task.controller.js";

const router = Router();

router.post("/", authMiddleware, boardAccessMiddleware, createTaskHandler);
router.put(
  "/:taskId",
  authMiddleware,
  boardAccessMiddleware,
  updateTaskHandler,
);
router.put(
  "/:taskId/move",
  authMiddleware,
  boardAccessMiddleware,
  moveTaskHandler,
);

router.delete(
  "/:taskId",
  authMiddleware,
  boardAccessMiddleware,
  deleteTaskHandler,
);

export default router;
