import prisma from "../../config/prisma.js";

export const addLabel = async (
  taskId: string,
  name: string,
  color: string
) => {
  return prisma.label.create({
    data: {
      taskId,
      name,
      color,
    },
  });
};
