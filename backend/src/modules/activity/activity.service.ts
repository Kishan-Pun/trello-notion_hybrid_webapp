import prisma from "../../config/prisma.js";

export const logActivity = async (
  action: string,
  boardId: string,
  userId: string,
  metadata?: any
) => {
  return prisma.activityLog.create({
    data: {
      action,
      boardId,
      userId,
      metadata,
    },
  });
};
