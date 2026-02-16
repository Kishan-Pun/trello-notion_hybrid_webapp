import prisma from "../../config/prisma.js";

export const createList = async (
  title: string,
  boardId: string
) => {
  // Find current max position
  const lastList = await prisma.list.findFirst({
    where: { boardId },
    orderBy: { position: "desc" },
  });

  const position = lastList ? lastList.position + 1 : 1;

  const list = await prisma.list.create({
    data: {
      title,
      boardId,
      position,
    },
  });

  return list;
};

export const getListsByBoard = async (boardId: string) => {
  const lists = await prisma.list.findMany({
    where: { boardId },
    orderBy: { position: "asc" },
    include: {
      tasks: true,
    },
  });

  return lists;
};
