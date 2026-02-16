import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { boardAccessMiddleware } from "../../middlewares/boardAccess.middleware.js";
import { createListHandler, getListsHandler } from "./list.controller.js";

const router = Router();

router.post("/", authMiddleware, boardAccessMiddleware, createListHandler);
router.get("/:boardId", authMiddleware, boardAccessMiddleware, getListsHandler);

export default router;
