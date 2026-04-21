import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { rolesController } from "../../controllers/roles.controller.js";

export const rolesRoutes = Router();

rolesRoutes.get("/me", requireAuth, rolesController.getMyRole);
rolesRoutes.post("/me", requireAuth, rolesController.setMyRole);

