import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { aiProposalService } from "../services/ai-proposal.service.js";
import { aiDesignOptionsService } from "../services/ai-design-options.service.js";
import { aiDesignConceptsService } from "../services/ai-design-concepts.service.js";

function toNumber(v: unknown) {
  const n = typeof v === "string" && v.trim() !== "" ? Number(v) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n) ? n : undefined;
}

function toStringArray(v: unknown): string[] | undefined {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string");
  if (typeof v === "string") {
    try {
      const parsed = JSON.parse(v);
      if (Array.isArray(parsed)) return parsed.filter((x): x is string => typeof x === "string");
    } catch {
      // allow comma separated
      return v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return undefined;
}

export const aiController = {
  generateProposal: asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req as AuthenticatedRequest;
    void userId;

    const files = ((req as any).files as Express.Multer.File[] | undefined) ?? [];
    const images = files.map((f) => f.buffer);

    const proposal = await aiProposalService.generateProposal(
      {
        address: String((req.body as any)?.address ?? ""),
        purchasePrice: toNumber((req.body as any)?.purchasePrice),
        squareFt: toNumber((req.body as any)?.squareFt),
        bedroom: toNumber((req.body as any)?.bedroom),
        bathroom: toNumber((req.body as any)?.bathroom),
        yearBuilt: (req.body as any)?.yearBuilt ? String((req.body as any)?.yearBuilt) : undefined,
        zipCode: (req.body as any)?.zipCode ? String((req.body as any)?.zipCode) : undefined,
        roomType: (req.body as any)?.roomType ? String((req.body as any)?.roomType) : undefined,
        budgetLevel: (req.body as any)?.budgetLevel ? String((req.body as any)?.budgetLevel) : undefined,
        designStyle: (req.body as any)?.designStyle ? String((req.body as any)?.designStyle) : undefined,
        renovationScope: toStringArray((req.body as any)?.renovationScope),
      },
      images
    );

    res.json({ ok: true, proposal });
  }),

  generateFullProposal: asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req as AuthenticatedRequest;
    void userId;

    const files = ((req as any).files as Express.Multer.File[] | undefined) ?? [];
    const images = files.map((f) => f.buffer);

    const proposal = await aiProposalService.generateProposal(
      {
        address: String((req.body as any)?.address ?? ""),
        purchasePrice: toNumber((req.body as any)?.purchasePrice),
        squareFt: toNumber((req.body as any)?.squareFt),
        bedroom: toNumber((req.body as any)?.bedroom),
        bathroom: toNumber((req.body as any)?.bathroom),
        yearBuilt: (req.body as any)?.yearBuilt ? String((req.body as any)?.yearBuilt) : undefined,
        zipCode: (req.body as any)?.zipCode ? String((req.body as any)?.zipCode) : undefined,
        roomType: (req.body as any)?.roomType ? String((req.body as any)?.roomType) : undefined,
        budgetLevel: (req.body as any)?.budgetLevel ? String((req.body as any)?.budgetLevel) : undefined,
        designStyle: (req.body as any)?.designStyle ? String((req.body as any)?.designStyle) : undefined,
        renovationScope: toStringArray((req.body as any)?.renovationScope),
      },
      images
    );

    res.json({ ok: true, proposal });
  }),

  designOptions: asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req as AuthenticatedRequest;
    void userId;

    const options = await aiDesignOptionsService.generate({
      address: (req.body as any)?.address ? String((req.body as any).address) : undefined,
      squareFt: toNumber((req.body as any)?.squareFt),
      bedroom: toNumber((req.body as any)?.bedroom),
      bathroom: toNumber((req.body as any)?.bathroom),
      roomType: (req.body as any)?.roomType ? String((req.body as any)?.roomType) : undefined,
      budgetLevel: (req.body as any)?.budgetLevel ? String((req.body as any)?.budgetLevel) : undefined,
      designStyle: (req.body as any)?.designStyle ? String((req.body as any)?.designStyle) : undefined,
      renovationScope: toStringArray((req.body as any)?.renovationScope),
    });

    res.json({ ok: true, options });
  }),

  designConcepts: asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req as AuthenticatedRequest;
    void userId;

    const concepts = await aiDesignConceptsService.generate({
      address: (req.body as any)?.address ? String((req.body as any).address) : undefined,
      squareFt: toNumber((req.body as any)?.squareFt),
      bedroom: toNumber((req.body as any)?.bedroom),
      bathroom: toNumber((req.body as any)?.bathroom),
      roomType: (req.body as any)?.roomType ? String((req.body as any)?.roomType) : undefined,
      budgetLevel: (req.body as any)?.budgetLevel ? String((req.body as any)?.budgetLevel) : undefined,
      designStyle: (req.body as any)?.designStyle ? String((req.body as any)?.designStyle) : undefined,
      renovationScope: toStringArray((req.body as any)?.renovationScope),
      selectedTierTitle: (req.body as any)?.selectedTierTitle ? String((req.body as any)?.selectedTierTitle) : undefined,
    });

    res.json({ ok: true, concepts });
  }),
};

