import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { projectsController } from "../../controllers/projects.controller.js";

export const projectsRoutes = Router();

projectsRoutes.get("/me", requireAuth, projectsController.listMine);
projectsRoutes.get("/me/:id", requireAuth, projectsController.getMine);
projectsRoutes.post("/me", requireAuth, projectsController.createMine);
projectsRoutes.patch("/me/:id", requireAuth, projectsController.updateMine);
projectsRoutes.delete("/me/:id", requireAuth, projectsController.deleteMine);

