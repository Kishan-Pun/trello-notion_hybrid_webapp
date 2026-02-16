import prisma from "../../config/prisma.js";
import { io } from "../../server.js";

export const addMemberToBoard = async (
  boardId: string,
  userIdToAdd: string,
  currentUserId: string,
) => {
  const currentUser = await prisma.boardMember.findUnique({
    where: {
      boardId_userId: { boardId, userId: currentUserId },
    },
  });

  if (!currentUser || !["OWNER", "ADMIN"].includes(currentUser.role)) {
    throw new Error("Insufficient permissions");
  }

  const existingMember = await prisma.boardMember.findUnique({
    where: {
      boardId_userId: { boardId, userId: userIdToAdd },
    },
  });

  if (existingMember) {
    throw new Error("User is already a member");
  }

  const userExists = await prisma.user.findUnique({
    where: { id: userIdToAdd },
  });

  if (!userExists) {
    throw new Error("User not found");
  }

  const newMember = await prisma.boardMember.create({
    data: {
      boardId,
      userId: userIdToAdd,
      role: "MEMBER",
    },
  });

  await prisma.activityLog.create({
    data: {
      action: "MEMBER_ADDED",
      boardId,
      userId: currentUserId,
      metadata: { addedUserId: userIdToAdd },
    },
  });

  // 🔥 Real-time broadcast
  io.to(boardId).emit("member_added", {
    boardId,
    userId: userIdToAdd,
  });

  return newMember;
};

export const getBoardMembers = async (boardId: string) => {
  return prisma.boardMember.findMany({
    where: { boardId },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

export const updateMemberRole = async (
  boardId: string,
  userIdToUpdate: string,
  newRole: string,
  currentUserId: string,
) => {
  if (!["ADMIN", "MEMBER"].includes(newRole)) {
    throw new Error("Invalid role");
  }

  const currentUser = await prisma.boardMember.findUnique({
    where: {
      boardId_userId: { boardId, userId: currentUserId },
    },
  });

  if (!currentUser || currentUser.role !== "OWNER") {
    throw new Error("Only owner can change roles");
  }

  const targetMember = await prisma.boardMember.findUnique({
    where: {
      boardId_userId: { boardId, userId: userIdToUpdate },
    },
  });

  if (!targetMember) {
    throw new Error("Member not found");
  }

  if (targetMember.role === "OWNER") {
    throw new Error("Cannot change owner role. Use ownership transfer.");
  }

  if (userIdToUpdate === currentUserId) {
    throw new Error("Owner cannot change their own role");
  }

  const updated = await prisma.boardMember.update({
    where: {
      boardId_userId: { boardId, userId: userIdToUpdate },
    },
    data: { role: newRole },
  });

  await prisma.activityLog.create({
    data: {
      action: "ROLE_UPDATED",
      boardId,
      userId: currentUserId,
      metadata: {
        targetUserId: userIdToUpdate,
        newRole,
      },
    },
  });

  io.to(boardId).emit("role_updated", {
    boardId,
    userId: userIdToUpdate,
    newRole,
  });

  return updated;
};

export const removeMemberFromBoard = async (
  boardId: string,
  userIdToRemove: string,
  currentUserId: string,
) => {
  const currentUser = await prisma.boardMember.findUnique({
    where: {
      boardId_userId: { boardId, userId: currentUserId },
    },
  });

  if (!currentUser || currentUser.role === "MEMBER") {
    throw new Error("Insufficient permissions");
  }

  const targetMember = await prisma.boardMember.findUnique({
    where: {
      boardId_userId: { boardId, userId: userIdToRemove },
    },
  });

  if (!targetMember) {
    throw new Error("Member not found");
  }

  if (targetMember.role === "OWNER") {
    throw new Error("Cannot remove owner. Transfer ownership first.");
  }

  await prisma.boardMember.delete({
    where: {
      boardId_userId: { boardId, userId: userIdToRemove },
    },
  });

  await prisma.activityLog.create({
    data: {
      action: "MEMBER_REMOVED",
      boardId,
      userId: currentUserId,
      metadata: { removedUserId: userIdToRemove },
    },
  });

  io.to(boardId).emit("member_removed", {
    boardId,
    userId: userIdToRemove,
  });

  return { message: "Member removed" };
};

export const leaveBoard = async (boardId: string, currentUserId: string) => {
  const member = await prisma.boardMember.findUnique({
    where: {
      boardId_userId: { boardId, userId: currentUserId },
    },
  });

  if (!member) {
    throw new Error("Not a board member");
  }

  if (member.role === "OWNER") {
    throw new Error("Owner must transfer ownership before leaving");
  }

  await prisma.boardMember.delete({
    where: {
      boardId_userId: { boardId, userId: currentUserId },
    },
  });

  await prisma.activityLog.create({
    data: {
      action: "MEMBER_LEFT",
      boardId,
      userId: currentUserId,
    },
  });

  io.to(boardId).emit("member_left", {
    boardId,
    userId: currentUserId,
  });

  return { message: "Left board successfully" };
};
