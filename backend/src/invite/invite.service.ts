import prisma from "../config/prisma.js";
import nodemailer from "nodemailer";

export const sendInviteEmail = async (
  email: string,
  boardId: string,
  boardName: string
) => {
  const inviteLink = `${process.env.FRONTEND_URL}/invite/${boardId}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Invitation to ${boardName}`,
    html: `
      <h3>You’ve been invited to join ${boardName}</h3>
      <a href="${inviteLink}">Click here to join</a>
    `,
  });
};
