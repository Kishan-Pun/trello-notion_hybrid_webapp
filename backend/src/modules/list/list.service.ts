import prisma from "../../config/prisma.js";

export const createList = async (title: string, boardId: string) => {
  const lastList = await prisma.list.findFirst({
    where: { boardId },
    orderBy: { position: "desc" },
  });

  const position = lastList ? lastList.position + 1 : 1;

  return prisma.list.create({
    data: {
      title,
      boardId,
      position,
    },
  });
};

export const getListsByBoard = async (boardId: string) => {
  return prisma.list.findMany({
    where: { boardId },
    orderBy: { position: "asc" },
    include: {
      tasks: {
        orderBy: { position: "asc" },
        include: {
          assignees: {
            include: {
              user: {
                select: { id: true, name: true },
              },
            },
          },
          labels: true,
          comments: {
            include: {
              user: { select: { id: true, name: true } },
            },
          },
        },
      },
    },
  });
};

export const updateList = async (listId: string, title: string) => {
  return prisma.list.update({
    where: { id: listId },
    data: { title },
  });
};

export const deleteList = async (listId: string) => {
  // Manual safe delete (in case cascade missing)

  const tasks = await prisma.task.findMany({
    where: { listId },
    select: { id: true },
  });

  const taskIds = tasks.map((t) => t.id);

  await prisma.label.deleteMany({
    where: { taskId: { in: taskIds } },
  });

  await prisma.comment.deleteMany({
    where: { taskId: { in: taskIds } },
  });

  await prisma.taskAssignee.deleteMany({
    where: { taskId: { in: taskIds } },
  });

  await prisma.task.deleteMany({
    where: { listId },
  });

  return prisma.list.delete({
    where: { id: listId },
  });
};
