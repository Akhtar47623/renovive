import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { prisma } from "../db/index.js";
import { parseSetMyRoleDto } from "../dto/roles/set-my-role.dto.js";

export const rolesController = {
  getMyRole: asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req as AuthenticatedRequest;
    const role = await prisma.userRole.findUnique({
      where: { userId },
      select: { role: true },
    });
    res.json({ role: role?.role ?? null });
  }),

  setMyRole: asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req as AuthenticatedRequest;
    const input = parseSetMyRoleDto(req.body);
    // DB enum still uses "homeowner" for end-users.
    const roleForDb = input.role === "user" ? ("homeowner" as any) : input.role;

    const role = await prisma.userRole.upsert({
      where: { userId },
      create: { userId, role: roleForDb },
      update: { role: roleForDb },
      select: { role: true },
    });

    // Normalize back to frontend role label
    res.json({ role: role.role === "homeowner" ? "user" : role.role });
  }),
};

