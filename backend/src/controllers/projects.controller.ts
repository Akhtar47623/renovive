import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { prisma } from "../db/index.js";
import { parseCreateProjectDto } from "../dto/projects/create-project.dto.js";
import { parseProjectIdParam } from "../dto/projects/project-id.param.js";
import { parseUpdateProjectDto } from "../dto/projects/update-project.dto.js";

export const projectsController = {
  listMine: asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req as AuthenticatedRequest;
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json({ projects });
  }),

  getMine: asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req as AuthenticatedRequest;
    const { id } = parseProjectIdParam(req.params);

    const project = await prisma.project.findFirst({ where: { id, userId } });
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    res.json({ project });
  }),

  createMine: asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req as AuthenticatedRequest;
    const input = parseCreateProjectDto(req.body);

    const project = await prisma.project.create({
      data: {
        userId,
        title: input.title,
        description: input.description ?? null,
        budget: input.budget ?? 0,
      },
    });

    res.status(201).json({ project });
  }),

  updateMine: asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req as AuthenticatedRequest;
    const { id } = parseProjectIdParam(req.params);
    const input = parseUpdateProjectDto(req.body);

    const project = await prisma.project.findFirst({ where: { id, userId } });
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        title: input.title,
        description: input.description ?? null,
        budget: input.budget ?? 0,
      },
    });

    res.json({ project: updated });
  }),

  deleteMine: asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req as AuthenticatedRequest;
    const { id } = parseProjectIdParam(req.params);

    await prisma.project.deleteMany({ where: { id, userId } });
    res.status(204).send();
  }),
};

