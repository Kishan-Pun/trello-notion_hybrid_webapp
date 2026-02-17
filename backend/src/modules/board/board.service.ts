import prisma from "../../config/prisma.js";

export const createBoard = async (title: string, userId: string) => {
  const board = await prisma.board.create({
    data: {
      title,
      members: {
        create: {
          userId,
          role: "OWNER",
        },
      },
    },
  });

  return board;
};

export const getUserBoards = async (userId: string) => {
  const boards = await prisma.board.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
    include: {
      members: {
        select: {
          userId: true,
          role: true,
        },
      },
    },
  });

  return boards;
};

export const transferOwnership = async (
  boardId: string,
  newOwnerId: string,
) => {
  const newOwner = await prisma.boardMember.findUnique({
    where: {
      boardId_userId: {
        boardId,
        userId: newOwnerId,
      },
    },
  });

  if (!newOwner) {
    throw new Error("User must be a board member");
  }

  // Remove current OWNER
  await prisma.boardMember.updateMany({
    where: {
      boardId,
      role: "OWNER",
    },
    data: {
      role: "ADMIN",
    },
  });

  // Promote new owner
  await prisma.boardMember.update({
    where: {
      boardId_userId: {
        boardId,
        userId: newOwnerId,
      },
    },
    data: {
      role: "OWNER",
    },
  });

  return { message: "Ownership transferred successfully" };
};

export const renameBoard = async (
  boardId: string,
  title: string,
  currentUserId: string
) => {
  const member = await prisma.boardMember.findUnique({
    where: {
      boardId_userId: {
        boardId,
        userId: currentUserId,
      },
    },
  });

  if (!member || member.role !== "OWNER") {
    throw new Error("Only owner can rename board");
  }

  return prisma.board.update({
    where: { id: boardId },
    data: { title },
  });
};

export const deleteBoard = async (
  boardId: string,
  currentUserId: string
) => {
  const member = await prisma.boardMember.findUnique({
    where: {
      boardId_userId: {
        boardId,
        userId: currentUserId,
      },
    },
  });

  if (!member || member.role !== "OWNER") {
    throw new Error("Only owner can delete board");
  }

  return prisma.board.delete({
    where: { id: boardId },
  });
};
