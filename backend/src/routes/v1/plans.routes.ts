import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { plansController } from "../../controllers/plans.controller.js";

export const plansRoutes = Router();

plansRoutes.post("/me", requireAuth, plansController.setMyPlan);

