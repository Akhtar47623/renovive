import { Router } from "express";
import { authRoutes } from "./auth.routes.js";
import { rolesRoutes } from "./roles.routes.js";
import { projectsRoutes } from "./projects.routes.js";
import { plansRoutes } from "./plans.routes.js";
import { usersRoutes } from "./users.routes.js";
import { aiRoutes } from "./ai.routes.js";
import { billingRoutes } from "./billing.routes.js";

export const v1Router = Router();

v1Router.use("/auth", authRoutes);
v1Router.use("/roles", rolesRoutes);
v1Router.use("/plans", plansRoutes);
v1Router.use("/projects", projectsRoutes);
v1Router.use("/users", usersRoutes);
v1Router.use("/ai", aiRoutes);
v1Router.use("/billing", billingRoutes);

