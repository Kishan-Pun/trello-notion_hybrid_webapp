import { Router } from "express";
import { signup, login } from "./auth.controller.js";

import prisma from "../../config/prisma.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/users", async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  res.json(users);
});

export default router;
