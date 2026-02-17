import prisma from "../../config/prisma.js";

export const addComment = async (
  taskId: string,
  userId: string,
  content: string
) => {
  return prisma.comment.create({
    data: {
      taskId,
      userId,
      content,
    },
    include: {
      user: { select: { name: true } },
    },
  });
};
