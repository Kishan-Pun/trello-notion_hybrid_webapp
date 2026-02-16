import { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service.js";

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    const user = await registerUser(name, email, password);

    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    const result = await loginUser(email, password);

    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
