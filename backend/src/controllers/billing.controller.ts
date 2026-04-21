import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { parseCreateCheckoutSessionDto } from "../dto/billing/create-checkout-session.dto.js";
import { billingService } from "../services/billing.service.js";

export const billingController = {
  createCheckoutSession: asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req as AuthenticatedRequest;
    const input = parseCreateCheckoutSessionDto(req.body);
    const result = await billingService.createCheckoutSession({ userId, input });
    res.json(result);
  }),

  webhook: asyncHandler(async (req: Request, res: Response) => {
    const signature = req.header("stripe-signature") ?? undefined;
    const rawBody = req.body as Buffer;
    const result = await billingService.handleWebhook({ signature, rawBody });
    res.json(result);
  }),
};

