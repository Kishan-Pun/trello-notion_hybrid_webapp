import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import boardRoutes from "./modules/board/board.routes.js";
import listRoutes from "./modules/list/list.routes.js";
import taskRoutes from "./modules/task/task.routes.js";
import activityRoutes from "./modules/activity/activity.routes.js";
import boardMemberRoutes from "./modules/board/boardMember.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/board-members", boardMemberRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

export default app;
