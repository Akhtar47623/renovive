import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { prisma } from "../db/index.js";
import { parseSetMyPlanDto } from "../dto/plans/set-my-plan.dto.js";

export const plansController = {
  setMyPlan: asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req as AuthenticatedRequest;
    const input = parseSetMyPlanDto(req.body);

    const user = await prisma.user.update({
      where: { id: userId },
      data: { selectedPlan: input.plan },
      select: { selectedPlan: true },
    });

    res.json({ plan: user.selectedPlan });
  }),
};

