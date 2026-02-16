import prisma from "../../config/prisma.js";

export const createTask = async (
  title: string,
  description: string | undefined,
  listId: string,
) => {
  const lastTask = await prisma.task.findFirst({
    where: { listId },
    orderBy: { position: "desc" },
  });

  const position = lastTask ? lastTask.position + 1 : 1;

  const task = await prisma.task.create({
    data: {
      title,
      description: description ?? null,
      listId,
      position,
    },
  });

  return task;
};

export const updateTask = async (
  taskId: string,
  title?: string,
  description?: string,
) => {
  return prisma.task.update({
    where: { id: taskId },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && {
        description: description ?? null,
      }),
    },
  });
};

export const moveTask = async (
  taskId: string,
  newListId: string,
  newPosition: number,
) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  // Shift tasks in target list
  await prisma.task.updateMany({
    where: {
      listId: newListId,
      position: {
        gte: newPosition,
      },
    },
    data: {
      position: {
        increment: 1,
      },
    },
  });

  // Update the task
  return prisma.task.update({
    where: { id: taskId },
    data: {
      listId: newListId,
      position: newPosition,
    },
  });
};

export const deleteTask = async (taskId: string) => {
  return prisma.task.delete({
    where: { id: taskId },
  });
};
