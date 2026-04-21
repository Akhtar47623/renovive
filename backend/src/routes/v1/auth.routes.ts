import { Router } from "express";
import { authController } from "../../controllers/auth.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

export const authRoutes = Router();

authRoutes.post("/signup", authController.signup);
authRoutes.post("/login", authController.login);
authRoutes.post("/forgot-password", authController.forgotPassword);
authRoutes.post("/verify-otp", authController.verifyPasswordOtp);
authRoutes.post("/reset-password", authController.resetPassword);
authRoutes.get("/me", requireAuth, authController.me);

