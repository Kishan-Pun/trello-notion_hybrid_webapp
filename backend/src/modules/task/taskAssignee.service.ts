import prisma from "../../config/prisma.js";
import { io } from "../../server.js";

export const assignUserToTask = async (
  taskId: string,
  userId: string,
  currentUserId: string,
) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { list: true },
  });

  if (!task) throw new Error("Task not found");

  const result = await prisma.taskAssignee.create({
    data: { taskId, userId },
  });

  const newActivity = await prisma.activityLog.create({
    data: {
      action: "TASK_ASSIGNED",
      boardId: task.list.boardId,
      userId: currentUserId,
      metadata: {
        taskId,
        assignedTo: userId,
      },
    },
  });

  io.to(task.list.boardId).emit("activity_created", newActivity);

  return result;
};


export const removeUserFromTask = async (taskId: string, userId: string) => {
  return prisma.taskAssignee.delete({
    where: {
      taskId_userId: {
        taskId,
        userId,
      },
    },
  });
};
