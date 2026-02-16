import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const parts = authHeader.split(" ");

  if (parts.length < 2) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token: string = parts[1]!; 

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    req.userId = decoded.userId;

    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
