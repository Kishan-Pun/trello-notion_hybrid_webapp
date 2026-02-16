import { AuthRequest } from "./auth.middleware.js";
import { Response, NextFunction } from "express";

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const role = (req as any).boardRole;

    if (!role || !roles.includes(role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    next();
  };
};
