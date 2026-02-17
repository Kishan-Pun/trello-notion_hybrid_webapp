import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { boardAccessMiddleware } from "../../middlewares/boardAccess.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import {
  createListHandler,
  getListsHandler,
  updateListHandler,
  deleteListHandler,
} from "./list.controller.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  boardAccessMiddleware,
  requireRole(["OWNER", "ADMIN"]),
  createListHandler
);

router.get(
  "/:boardId",
  authMiddleware,
  boardAccessMiddleware,
  getListsHandler
);

router.put(
  "/:listId",
  authMiddleware,
  boardAccessMiddleware,
  requireRole(["OWNER", "ADMIN"]),
  updateListHandler
);

router.delete(
  "/:listId",
  authMiddleware,
  boardAccessMiddleware,
  requireRole(["OWNER", "ADMIN"]),
  deleteListHandler
);

export default router;
