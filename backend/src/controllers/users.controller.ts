import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { usersService } from "../services/users.service.js";

export const usersController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const users = await usersService.list();
    res.json({ users });
  }),
};

