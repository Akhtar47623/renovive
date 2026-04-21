import { Router } from "express";
import { usersController } from "../../controllers/users.controller.js";

export const usersRoutes = Router();
usersRoutes.get("/", usersController.list);

